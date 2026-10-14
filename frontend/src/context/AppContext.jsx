

import React, {

  createContext,

  useContext,

  useEffect,

  useMemo,

  useState,

} from "react";

import { ui } from "../data";

import { supabase } from "../lib_supabase";



const AppContext = createContext(null);



const fallbackProfile = {

  name: "Asitha's Kitchen",

  username: "@asitha",

  bio: "Home cook · Recipe storyteller",

  initials: "A",

};



const isUuid = (value) =>

  typeof value === "string" &&

  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);



const readDemoIds = (userId, kind) => {

  if (typeof window === "undefined" || !userId) return [];

  try {

    const value = JSON.parse(window.localStorage.getItem(`flavorshare:${kind}:${userId}`) || "[]");

    return Array.isArray(value) ? value : [];

  } catch {

    return [];

  }

};



const writeDemoIds = (userId, kind, ids) => {

  if (typeof window === "undefined" || !userId) return;

  try {

    window.localStorage.setItem(`flavorshare:${kind}:${userId}`, JSON.stringify(ids));

  } catch (error) {

    console.warn("Could not persist demo interaction locally:", error);

  }

};



const mapRecipe = (r, profileMap = {}) => ({

  id: r.id,

  name: r.title,

  description:

    r.description ||

    "A recipe shared from the FlavorShare community.",

  category: r.category || "Community",

  region: r.region || "Home Kitchen",

  creator:

    profileMap[r.user_id]?.display_name ||

    profileMap[r.user_id]?.username ||

    "Home Cook",

  creatorId: r.user_id,

  chefType: r.chef_type || "Home Chef",

  time: "30 min",

  image: r.image_url || "/themes/blank.svg",

  video: r.video_url || "",

  mediaType: r.video_url && !r.image_url ? "video" : "image",

  hashtags: r.hashtags || [],

  ingredients: r.ingredients || [],

  steps: r.steps || [],

  theme: r.theme || "Blank",

  userPost: false,

});



export function AppProvider({ children }) {

  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  const [saved, setSaved] = useState([]);

  const [comments, setComments] = useState({});

  const [profile, setProfile] = useState(fallbackProfile);

  const [language, setLanguage] = useState("English");

  const [theme, setTheme] = useState("Blank");

  const [premium, setPremium] = useState(false);

  const [dark, setDark] = useState(false);

  const [flash, setFlash] = useState("");

  const [following, setFollowing] = useState([]);

  const [liked, setLiked] = useState([]);

  const [likeCounts, setLikeCounts] = useState({});

  const [followerCounts, setFollowerCounts] = useState({});



  const notify = (message) => {

    setFlash(message);

    window.clearTimeout(window.__fsFlash);

    window.__fsFlash = window.setTimeout(() => setFlash(""), 5000);

  };



  const t = (key) => ui[language]?.[key] || ui.English[key] || key;



  const loadData = async (user) => {

    if (!user) return;



    setLoading(true);



    try {

      const [

        profileResult,

        recipesResult,

        followsResult,

        likesResult,

        commentsResult,

        allLikesResult,

        allFollowsResult,

        bookmarksResult,

      ] = await Promise.all([

        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),

        supabase.from("recipes").select("*").order("created_at", { ascending: false }),

        supabase.from("follows").select("following_id").eq("follower_id", user.id),

        supabase.from("likes").select("recipe_id").eq("user_id", user.id),

        supabase.from("comments").select("*").order("created_at", { ascending: true }),

        supabase.from("likes").select("recipe_id"),

        supabase.from("follows").select("following_id"),

        supabase.from("bookmarks").select("recipe_id").eq("user_id", user.id),

      ]);



      const results = [

        profileResult,

        recipesResult,

        followsResult,

        likesResult,

        commentsResult,

        allLikesResult,

        allFollowsResult,

        bookmarksResult,

      ];



      const failed = results.find((result) => result.error);

      if (failed) {

        console.error("Error loading FlavorShare data:", failed.error);

        notify(`Some data could not be loaded: ${failed.error.message}`);

      }



      const prof = profileResult.data;

      const recipeRows = recipesResult.data || [];

      const followRows = followsResult.data || [];

      const likeRows = likesResult.data || [];

      const commentRows = commentsResult.data || [];

      const allLikeRows = allLikesResult.data || [];

      const allFollowRows = allFollowsResult.data || [];

      const bookmarkRows = bookmarksResult.data || [];



      const ids = [

        ...recipeRows.map((r) => r.user_id),

        ...followRows.map((r) => r.following_id),

      ].filter(Boolean);



      const profileMap = {};



      if (ids.length) {

        const { data: profiles, error } = await supabase

          .from("profiles")

          .select("id, username, display_name")

          .in("id", [...new Set(ids)]);



        if (error) console.error("Could not load chef profiles:", error);

        (profiles || []).forEach((p) => {

          profileMap[p.id] = p;

        });

      }



      const mappedPosts = recipeRows.map((r) => ({

        ...mapRecipe(r, profileMap),

        userPost: r.user_id === user.id,

      }));



      setPosts(mappedPosts);

      setFollowing([...followRows.map((r) => r.following_id), ...readDemoIds(user.id, "demoFollowing")]);

      setLiked([...likeRows.map((r) => r.recipe_id), ...readDemoIds(user.id, "demoLiked")]);



      const savedIds = new Set(bookmarkRows.map((r) => r.recipe_id));

      setSaved(mappedPosts.filter((r) => savedIds.has(r.id)));



      const countsLikes = {};

      allLikeRows.forEach((r) => {

        countsLikes[r.recipe_id] = (countsLikes[r.recipe_id] || 0) + 1;

      });

      // Sample recipe likes are per-user and device-local; reflect this user's saved demo likes.

      readDemoIds(user.id, "demoLiked").forEach((id) => {

        countsLikes[id] = Math.max(countsLikes[id] || 0, 1);

      });

      setLikeCounts(countsLikes);



      const countsFollows = {};

      allFollowRows.forEach((r) => {

        countsFollows[r.following_id] =

          (countsFollows[r.following_id] || 0) + 1;

      });

      readDemoIds(user.id, "demoFollowing").forEach((id) => {

        countsFollows[id] = (countsFollows[id] || 0) + 1;

      });

      setFollowerCounts(countsFollows);



      const groupedComments = {};

      commentRows.forEach((c) => {

        (groupedComments[c.recipe_id] ||= []).push({

          id: c.id,

          author:

            c.user_id === user.id

              ? prof?.display_name || prof?.username || "You"

              : "Community cook",

          text: c.content,

          createdAt: c.created_at,

        });

      });

      setComments(groupedComments);



      if (prof) {

        const displayName = prof.display_name || prof.username || fallbackProfile.name;

        setProfile({

          name: displayName,

          username: prof.username || fallbackProfile.username,

          bio: prof.bio || fallbackProfile.bio,

          initials: displayName

            .split(/\s+/)

            .map((x) => x[0])

            .join("")

            .slice(0, 2)

            .toUpperCase(),

        });

      }

    } catch (error) {

      console.error("Could not load FlavorShare data:", error);

      notify(error.message || "Could not load your data.");

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    let mounted = true;



    supabase.auth.getSession().then(({ data, error }) => {

      if (!mounted) return;



      if (error) {

        console.error("Could not get session:", error);

        setLoading(false);

        return;

      }



      setSession(data.session);



      if (data.session) {

        loadData(data.session.user);

      } else {

        setLoading(false);

      }

    });



    const {

      data: { subscription },

    } = supabase.auth.onAuthStateChange((_event, newSession) => {

      setSession(newSession);



      if (newSession) {

        loadData(newSession.user);

      } else {

        setPosts([]);

        setSaved([]);

        setFollowing([]);

        setLiked([]);

        setLikeCounts({});

        setFollowerCounts({});

        setComments({});

        setLoading(false);

      }

    });



    return () => {

      mounted = false;

      subscription.unsubscribe();

    };

  }, []);



  const addPost = async ({

    title,

    ingredients,

    steps,

    theme: postTheme,

    file,

    chefType = "Home Chef",

    description = "A recipe shared from the FlavorShare community.",

    category = "Community",

    region = "Home Kitchen",

  }) => {

    if (!session?.user) throw new Error("Please log in first.");



    let image_url = null;

    let video_url = null;



    if (file) {

      const path = `${session.user.id}/${crypto.randomUUID()}-${file.name.replace(

        /[^a-zA-Z0-9._-]/g,

        "_"

      )}`;



      const { error } = await supabase.storage

        .from("recipe-media")

        .upload(path, file, {

          upsert: false,

          contentType: file.type,

        });



      if (error) throw error;



      const { data } = supabase.storage

        .from("recipe-media")

        .getPublicUrl(path);



      if (file.type.startsWith("video/")) {

        video_url = data.publicUrl;

      } else {

        image_url = data.publicUrl;

      }

    }



    const payload = {

      user_id: session.user.id,

      title: title.trim(),

      description,

      category,

      region,

      image_url,

      video_url,

      theme: postTheme,

      chef_type: chefType,

      hashtags: [

        "#FlavorShare",

        `#${postTheme.replace(/[^a-zA-Z0-9]/g, "")}`,

        chefType === "Head Chef"

          ? "#HeadChef"

          : chefType === "Home Chef"

          ? "#HomeChef"

          : "#User",

      ],

      ingredients: ingredients.split(/\n|,/).map((x) => x.trim()).filter(Boolean),

      steps: steps.split(/\n/).map((x) => x.trim()).filter(Boolean),

    };



    const { data, error } = await supabase

      .from("recipes")

      .insert(payload)

      .select("*")

      .single();



    if (error) throw error;



    const recipe = {

      ...mapRecipe(data, {

        [session.user.id]: {

          display_name: profile.name,

          username: profile.username,

        },

      }),

      userPost: true,

    };



    setPosts((current) => [recipe, ...current]);

    notify(t("posted"));

    return recipe;

  };



  const deletePost = async (id) => {

    const recipe = posts.find((r) => r.id === id);

    if (!recipe || recipe.creatorId !== session?.user?.id) return;



    const { error } = await supabase

      .from("recipes")

      .delete()

      .eq("id", id)

      .eq("user_id", session.user.id);



    if (error) {

      notify(error.message);

      return;

    }



    setPosts((current) => current.filter((r) => r.id !== id));

    setSaved((current) => current.filter((r) => r.id !== id));

    notify("Recipe post deleted.");

  };



  const toggleFollow = async (creatorId) => {

    if (!session?.user) {

      notify("Please log in to follow a cook.");

      return;

    }



    if (!creatorId || creatorId === session.user.id) return;



    // Curated Home Chef / Head Chef cards are sample profiles, not auth users.

    // Allow their buttons to work locally instead of disabling them or sending fake IDs to Supabase.

    if (!isUuid(creatorId)) {

      const current = readDemoIds(session.user.id, "demoFollowing");

      const isDemoFollowing = current.includes(creatorId);

      const next = isDemoFollowing

        ? current.filter((id) => id !== creatorId)

        : [...current, creatorId];

      writeDemoIds(session.user.id, "demoFollowing", next);

      setFollowing((items) => isDemoFollowing

        ? items.filter((id) => id !== creatorId)

        : (items.includes(creatorId) ? items : [...items, creatorId]));

      setFollowerCounts((counts) => ({

        ...counts,

        [creatorId]: Math.max(0, (counts[creatorId] || 0) + (isDemoFollowing ? -1 : 1)),

      }));

      notify(isDemoFollowing ? "Unfollowed demo chef on this device." : "Following demo chef on this device.");

      return;

    }



    const isFollowing = following.includes(creatorId);



    if (isFollowing) {

      const { error } = await supabase

        .from("follows")

        .delete()

        .eq("follower_id", session.user.id)

        .eq("following_id", creatorId);



      if (error) {

        notify(`Could not unfollow: ${error.message}`);

        return;

      }



      setFollowing((current) => current.filter((id) => id !== creatorId));

      setFollowerCounts((current) => ({

        ...current,

        [creatorId]: Math.max(0, (current[creatorId] || 0) - 1),

      }));

      notify("Unfollowed cook.");

    } else {

      const { error } = await supabase.from("follows").insert({

        follower_id: session.user.id,

        following_id: creatorId,

      });



      if (error) {

        notify(`Could not follow: ${error.message}`);

        return;

      }



      setFollowing((current) =>

        current.includes(creatorId) ? current : [...current, creatorId]

      );

      setFollowerCounts((current) => ({

        ...current,

        [creatorId]: (current[creatorId] || 0) + 1,

      }));

      notify("Following cook.");

    }

  };



  const toggleLike = async (recipeId) => {

    if (!session?.user) {

      notify("Please log in to like a recipe.");

      return;

    }



    // Numeric IDs belong to the curated sample recipes. Support likes locally for

    // those cards; UUID recipe IDs are real community posts persisted in Supabase.

    if (!isUuid(recipeId)) {

      const current = readDemoIds(session.user.id, "demoLiked");

      const isDemoLiked = current.includes(recipeId);

      const next = isDemoLiked

        ? current.filter((id) => id !== recipeId)

        : [...current, recipeId];

      writeDemoIds(session.user.id, "demoLiked", next);

      setLiked((items) => isDemoLiked

        ? items.filter((id) => id !== recipeId)

        : (items.includes(recipeId) ? items : [...items, recipeId]));

      setLikeCounts((counts) => ({

        ...counts,

        [recipeId]: Math.max(0, (counts[recipeId] || 0) + (isDemoLiked ? -1 : 1)),

      }));

      notify(isDemoLiked ? "Removed like." : "Recipe liked.");

      return;

    }



    const isLiked = liked.includes(recipeId);



    if (isLiked) {

      const { error } = await supabase

        .from("likes")

        .delete()

        .eq("user_id", session.user.id)

        .eq("recipe_id", recipeId);



      if (error) {

        notify(`Could not remove like: ${error.message}`);

        return;

      }



      setLiked((current) => current.filter((id) => id !== recipeId));

      setLikeCounts((current) => ({

        ...current,

        [recipeId]: Math.max(0, (current[recipeId] || 0) - 1),

      }));

    } else {

      const { error } = await supabase.from("likes").insert({

        user_id: session.user.id,

        recipe_id: recipeId,

      });



      if (error) {

        notify(`Could not like recipe: ${error.message}`);

        return;

      }



      setLiked((current) =>

        current.includes(recipeId) ? current : [...current, recipeId]

      );

      setLikeCounts((current) => ({

        ...current,

        [recipeId]: (current[recipeId] || 0) + 1,

      }));

    }

  };



  const toggleBookmark = async (recipe) => {

    if (!session?.user) {

      notify("Please log in to save recipes.");

      return;

    }



    if (!recipe?.id) return;



    const alreadySaved = saved.some((item) => item.id === recipe.id);

    const isCommunityRecipe = posts.some((item) => item.id === recipe.id);



    // Demo recipes are not necessarily rows in the recipes table.

    // Keep those saves in local app state instead of inserting invalid IDs.

    if (!isCommunityRecipe || !isUuid(recipe.id)) {

      setSaved((current) =>

        alreadySaved

          ? current.filter((item) => item.id !== recipe.id)

          : [...current, recipe]

      );

      notify(alreadySaved ? "Removed from My Bowl." : "Saved to My Bowl.");

      return;

    }



    if (alreadySaved) {

      const { error } = await supabase

        .from("bookmarks")

        .delete()

        .eq("user_id", session.user.id)

        .eq("recipe_id", recipe.id);



      if (error) {

        notify(`Could not remove bookmark: ${error.message}`);

        return;

      }



      setSaved((current) => current.filter((item) => item.id !== recipe.id));

      notify("Removed from My Bowl.");

    } else {

      const { error } = await supabase.from("bookmarks").insert({

        user_id: session.user.id,

        recipe_id: recipe.id,

      });



      if (error) {

        notify(`Could not save recipe: ${error.message}`);

        return;

      }



      setSaved((current) =>

        current.some((item) => item.id === recipe.id)

          ? current

          : [...current, recipe]

      );

      notify("Saved to My Bowl.");

    }

  };



  const addComment = async (recipeId, text) => {

    const trimmed = text.trim();

    if (!trimmed || !session?.user) return;



    const { data, error } = await supabase

      .from("comments")

      .insert({

        recipe_id: recipeId,

        user_id: session.user.id,

        content: trimmed,

      })

      .select("*")

      .single();



    if (error) {

      notify(error.message);

      return;

    }



    setComments((current) => ({

      ...current,

      [recipeId]: [

        ...(current[recipeId] || []),

        {

          id: data.id,

          author: profile.name,

          text: trimmed,

          createdAt: data.created_at,

        },

      ],

    }));

  };



  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    setSession(null);
    setPosts([]);
    setSaved([]);
    setFollowing([]);
    setLiked([]);
    setLikeCounts({});
    setFollowerCounts({});
    setComments({});

    return { error: null };
  };



  const value = useMemo(

    () => ({

      session,

      loading,

      posts,

      saved,

      comments,

      profile,

      language,

      theme,

      premium,

      dark,

      flash,

      following,

      liked,

      likeCounts,

      followerCounts,

      setLanguage,

      setTheme,

      setPremium,

      setDark,

      setProfile,

      t,

      notify,

      toggleBookmark,

      addPost,

      deletePost,

      toggleFollow,

      toggleLike,

      addComment,

      signOut,

    }),

    [

      session,

      loading,

      posts,

      saved,

      comments,

      profile,

      language,

      theme,

      premium,

      dark,

      flash,

      following,

      liked,

      likeCounts,

      followerCounts,

    ]

  );



  return (

    <AppContext.Provider value={value}>

      {children}

    </AppContext.Provider>

  );

}



export function useApp() {

  const context = useContext(AppContext);



  if (!context) {

    throw new Error("useApp must be used inside AppProvider");

  }



  return context;

}

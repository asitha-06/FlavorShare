import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ui } from "../data";
import { supabase } from "../lib_supabase";

const AppContext = createContext(null);
const fallbackProfile={name:"Asitha's Kitchen",username:"@asitha",bio:"Home cook · Recipe storyteller",initials:"A"};

const mapRecipe = (r, profileMap={}) => ({
  id:r.id, name:r.title, description:r.description||"A recipe shared from the FlavorShare community.",
  category:r.category||"Community", region:r.region||"Home Kitchen", creator:profileMap[r.user_id]?.display_name||profileMap[r.user_id]?.username||"Home Cook",
  creatorId:r.user_id, time:"30 min", image:r.image_url||"/themes/blank.svg", video:r.video_url||"", mediaType:r.video_url&&!r.image_url?"video":"image",
  hashtags:r.hashtags||[], ingredients:r.ingredients||[], steps:r.steps||[], theme:r.theme||"Blank", userPost:false
});

export function AppProvider({children}){
  const [session,setSession]=useState(null); const [loading,setLoading]=useState(true);
  const [posts,setPosts]=useState([]); const [saved,setSaved]=useState([]); const [comments,setComments]=useState({});
  const [profile,setProfile]=useState(fallbackProfile); const [language,setLanguage]=useState("English");
  const [theme,setTheme]=useState("Blank"); const [premium,setPremium]=useState(false); const [dark,setDark]=useState(false);
  const [flash,setFlash]=useState(""); const [following,setFollowing]=useState([]); const [liked,setLiked]=useState([]);

  const notify=(message)=>{setFlash(message); window.clearTimeout(window.__fsFlash); window.__fsFlash=window.setTimeout(()=>setFlash(""),5000)};
  const t=(key)=>ui[language]?.[key]||ui.English[key]||key;

  const loadData=async(user)=>{
    if(!user) return;
    setLoading(true);
    const [{data:prof},{data:recipeRows},{data:follows},{data:likes},{data:commentRows}]=await Promise.all([
      supabase.from('profiles').select('*').eq('id',user.id).maybeSingle(),
      supabase.from('recipes').select('*').order('created_at',{ascending:false}),
      supabase.from('follows').select('following_id').eq('follower_id',user.id),
      supabase.from('likes').select('recipe_id').eq('user_id',user.id),
      supabase.from('comments').select('*').order('created_at',{ascending:true})
    ]);
    const ids=[...(recipeRows||[]).map(r=>r.user_id),...(follows||[]).map(x=>x.following_id)].filter(Boolean);
    let profileMap={};
    if(ids.length){const {data:ps}=await supabase.from('profiles').select('id,username,display_name').in('id',[...new Set(ids)]); (ps||[]).forEach(p=>profileMap[p.id]=p)}
    const mine=(recipeRows||[]).map(r=>({...mapRecipe(r,profileMap),userPost:r.user_id===user.id}));
    setPosts(mine);
    setFollowing((follows||[]).map(x=>x.following_id)); setLiked((likes||[]).map(x=>x.recipe_id));
    const grouped={}; (commentRows||[]).forEach(c=>{(grouped[c.recipe_id] ||= []).push({id:c.id,author:c.user_id===user.id?(prof?.display_name||prof?.username||"You"):"Community cook",text:c.content,createdAt:c.created_at})}); setComments(grouped);
    if(prof) setProfile({name:prof.display_name||prof.username||fallbackProfile.name,username:prof.username||fallbackProfile.username,bio:prof.bio||fallbackProfile.bio,initials:(prof.display_name||prof.username||"A").split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()});
    setLoading(false);
  };

  useEffect(()=>{ let mounted=true; supabase.auth.getSession().then(({data})=>{if(mounted){setSession(data.session); if(data.session) loadData(data.session.user); else setLoading(false)}}); const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s); if(s) loadData(s.user); else {setPosts([]);setFollowing([]);setLiked([]);setComments({});setLoading(false)}}); return()=>{mounted=false;subscription.unsubscribe()}; },[]);

  const addPost=async({title,ingredients,steps,theme:postTheme,file,description="A recipe shared from the FlavorShare community.",category="Community",region="Home Kitchen"})=>{
    if(!session?.user) throw new Error('Please log in first.');
    let image_url=null,video_url=null;
    if(file){const path=`${session.user.id}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`; const {error}=await supabase.storage.from('recipe-media').upload(path,file,{upsert:false,contentType:file.type}); if(error) throw error; const {data}=supabase.storage.from('recipe-media').getPublicUrl(path); if(file.type.startsWith('video/')) video_url=data.publicUrl; else image_url=data.publicUrl;}
    const payload={user_id:session.user.id,title:title.trim(),description,category,region,image_url,video_url,theme:postTheme,hashtags:['#FlavorShare',`#${postTheme.replace(/[^a-zA-Z0-9]/g,'')}`],ingredients:ingredients.split(/\n|,/).map(x=>x.trim()).filter(Boolean),steps:steps.split(/\n/).map(x=>x.trim()).filter(Boolean)};
    const {data,error}=await supabase.from('recipes').insert(payload).select('*').single(); if(error) throw error;
    const recipe={...mapRecipe(data,{[session.user.id]:{display_name:profile.name,username:profile.username}}),userPost:true}; setPosts(c=>[recipe,...c]); notify(t('posted')); return recipe;
  };
  const deletePost=async(id)=>{const recipe=posts.find(x=>x.id===id); if(!recipe||recipe.creatorId!==session?.user?.id)return; const {error}=await supabase.from('recipes').delete().eq('id',id).eq('user_id',session.user.id); if(error){notify(error.message);return} setPosts(c=>c.filter(x=>x.id!==id)); notify('Recipe post deleted.');};
  const toggleFollow=async(creatorId)=>{if(!session?.user||!creatorId||creatorId===session.user.id)return; const is=following.includes(creatorId); if(is){const {error}=await supabase.from('follows').delete().eq('follower_id',session.user.id).eq('following_id',creatorId); if(error)return;setFollowing(c=>c.filter(x=>x!==creatorId));}else{const {error}=await supabase.from('follows').insert({follower_id:session.user.id,following_id:creatorId});if(error)return;setFollowing(c=>[...c,creatorId]);}};
  const toggleLike=async(recipeId)=>{if(!session?.user)return; const is=liked.includes(recipeId); if(is){const {error}=await supabase.from('likes').delete().eq('user_id',session.user.id).eq('recipe_id',recipeId);if(error)return;setLiked(c=>c.filter(x=>x!==recipeId));}else{const {error}=await supabase.from('likes').insert({user_id:session.user.id,recipe_id:recipeId});if(error)return;setLiked(c=>[...c,recipeId]);}};
  const toggleBookmark=(recipe)=>setSaved(c=>c.some(x=>x.id===recipe.id)?c.filter(x=>x.id!==recipe.id):[...c,recipe]);
  const addComment=async(recipeId,text)=>{const trimmed=text.trim();if(!trimmed||!session?.user)return;const {data,error}=await supabase.from('comments').insert({recipe_id:recipeId,user_id:session.user.id,content:trimmed}).select('*').single();if(error){notify(error.message);return}setComments(c=>({...c,[recipeId]:[...(c[recipeId]||[]),{id:data.id,author:profile.name,text:trimmed,createdAt:data.created_at}]}));};
  const signOut=()=>supabase.auth.signOut();
  const value=useMemo(()=>({session,loading,posts,saved,comments,profile,language,theme,premium,dark,flash,following,liked,setLanguage,setTheme,setPremium,setDark,setProfile,t,notify,toggleBookmark,addPost,deletePost,toggleFollow,toggleLike,addComment,signOut}),[session,loading,posts,saved,comments,profile,language,theme,premium,dark,flash,following,liked]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(){const c=useContext(AppContext);if(!c)throw new Error('useApp must be used inside AppProvider');return c}

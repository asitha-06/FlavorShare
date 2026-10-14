export const recipes = [
  {id:1,name:"Lemon Ricotta Pasta",description:"A bright and creamy Italian comfort dish.",category:"Lunch",region:"Italy",creator:"Mira Kapoor",time:"25 min",image:"https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=85",hashtags:["#Italian","#ComfortFood"],ingredients:["Pasta","Ricotta","Lemon","Garlic","Parmesan","Basil"],steps:["Boil pasta until al dente.","Mix ricotta, lemon zest and garlic.","Toss pasta with the sauce.","Finish with parmesan and basil."]},
  {id:2,name:"Gulab Jamun Cheesecake",description:"A classic Indian sweet meets a creamy modern dessert.",category:"Dessert",region:"Indian",creator:"Nisha Rao",time:"55 min",image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=85",hashtags:["#Indian","#Dessert"],ingredients:["Cream cheese","Gulab jamun","Biscuit crumbs","Cardamom","Cream"],steps:["Prepare the biscuit base.","Beat the cheesecake filling.","Fold in cardamom.","Top with gulab jamun and chill."]},
  {id:3,name:"Coconut Payasam",description:"An old-fashioned South Indian dessert for slow afternoons.",category:"Dessert",region:"Indian",creator:"Meera Joshi",time:"35 min",image:"https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=85",hashtags:["#SouthIndian","#Traditional"],ingredients:["Coconut milk","Rice","Jaggery","Cardamom","Cashews"],steps:["Cook rice gently.","Add coconut milk.","Sweeten with jaggery.","Finish with cardamom and toasted cashews."]},
  {id:4,name:"Masala Dosa",description:"Crisp, golden dosa with a warm potato masala.",category:"Breakfast",region:"Indian",creator:"Arjun Menon",time:"40 min",image:"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=85",hashtags:["#SouthIndia","#Breakfast"],ingredients:["Dosa batter","Potatoes","Onion","Mustard seeds","Curry leaves"],steps:["Prepare potato masala.","Heat the tawa.","Spread batter thinly.","Fill with masala and fold."]},
  {id:5,name:"Miso Ramen Bowl",description:"A cozy Japanese bowl with noodles, miso and vegetables.",category:"Lunch",region:"Japanese",creator:"Kian Lee",time:"30 min",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",hashtags:["#Japanese","#Noodles"],ingredients:["Ramen noodles","Miso","Mushrooms","Spring onion","Corn"],steps:["Prepare miso broth.","Cook noodles.","Add vegetables.","Assemble and garnish."]},
  {id:6,name:"Rose Cardamom Cake",description:"A soft bakery-style cake scented with rose and cardamom.",category:"Dessert",region:"Indian",creator:"Tara Shah",time:"50 min",image:"https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85",hashtags:["#Bakery","#Cardamom"],ingredients:["Flour","Cardamom","Rose water","Sugar","Milk"],steps:["Mix dry ingredients.","Whisk wet ingredients.","Combine gently.","Bake and decorate."]}
];

recipes.forEach((recipe, index) => {
  const isHeadChef = index === 0 || index === 4;
  // These curated sample chefs are demo profiles, not Supabase users.
  // Stable IDs let the UI support local demo likes/follows without disabling buttons.
  recipe.creatorId = `demo-chef-${String(recipe.creator).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  recipe.chefType = isHeadChef ? "Head Chef" : "Home Chef";
  recipe.hashtags = [...(recipe.hashtags || []), isHeadChef ? "#HeadChef" : "#HomeChef", "#FlavorShare"];
});

export const normalizeSearch = value => String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim();
export const matchesRecipe = (recipe, query) => {
  const q = normalizeSearch(query);
  if (!q) return true;
  const haystack = normalizeSearch([recipe.name,recipe.description,recipe.category,recipe.region,recipe.creator,...(recipe.hashtags||[]),...(recipe.ingredients||[])].join(" "));
  const words = q.split(" ").filter(Boolean);
  return haystack.includes(q) || words.every(word => haystack.includes(word));
};
export const categories = ["All","Breakfast","Lunch","Snack","Dessert","Salade"];
export const regions = ["Indian","Chinese","Korean","Japanese","Italy"];
export const themes = ["Blank","Warm Kitchen","Rustic Kitchen","Pastel Bakery","Farm-to-Table","Fresh & Healthy"];

export const themeMeta = {
  "Blank": {font:"DM Sans", subtitle:"Clean, quiet and minimal", image:"/themes/blank.svg", accent:"#7b6a5c"},
  "Warm Kitchen": {font:"Playfair Display", subtitle:"Golden light, herbs and a lived-in kitchen", image:"/themes/warm-kitchen.svg", accent:"#b85f43"},
  "Rustic Kitchen": {font:"Cormorant Garamond", subtitle:"Wood, linen, leaves and handmade warmth", image:"/themes/rustic-kitchen.svg", accent:"#756149"},
  "Pastel Bakery": {font:"Quicksand", subtitle:"Soft bakery colors, cake and little sparkles", image:"/themes/pastel-bakery.svg", accent:"#c47c91"},
  "Farm-to-Table": {font:"Lora", subtitle:"Fresh harvest, grain and garden textures", image:"/themes/farm-to-table.svg", accent:"#688451"},
  "Fresh & Healthy": {font:"Nunito", subtitle:"Crisp greens, citrus and a fresh feel", image:"/themes/fresh-healthy.svg", accent:"#5c8b70"}
};

export const ui = {
  English: {
    menu:"MENU", home:"Home", create:"Create Post", premium:"Premium", regions:"Regions", chefs:"Head & Home Chefs", categories:"Categories", settings:"Settings", profile:"Profile", faq:"FAQ", bookmark:"Bookmarks",
    selectLanguage:"Select your comfortable language", goodFood:"Good food", travels:"travels.", discoverCopy:"Discover recipes from home kitchens, regional tables and little corners of the world.",
    topRecipes:"TOP RECIPES", shared:"Shared from warm kitchens", all:"All", breakfast:"Breakfast", lunch:"Lunch", snack:"Snack", dessert:"Dessert", salade:"Salade",
    regionsTitle:"Every place", regionsTitle2:"has a flavor.", chooseTable:"Choose a table", createTitle:"Set the table for", createTitle2:"your recipe.", chooseTheme:"Choose a theme", post:"Post to FlavorShare", posted:"Recipe posted successfully!", viewHome:"You can view it at the top of Home.",
    language:"Language", appearance:"Appearance", kitchenTheme:"Kitchen theme", light:"Light", dark:"Dark", preview:"Preview theme", useTheme:"Use this theme", back:"Back", comments:"Comments", addComment:"Add a comment...", send:"Send", follow:"Follow", following:"Following", homeCook:"Home Cook", yourPost:"Your post", deletePost:"Delete post", leftBehind:"A few you left behind", seeAll:"See all", searchResults:"SEARCH RESULTS", noRecipes:"No recipes found", trySearch:"Try a recipe name, ingredient, region or cook.", editProfile:"Edit Profile", editing:"Editing...", newRecipes:"new recipes", likes:"likes", followers:"followers", name:"Name", username:"Username", bio:"Bio", saveChanges:"Save changes", cancel:"Cancel", recipeTitle:"Recipe title", ingredients:"Ingredients", steps:"Steps", titlePlaceholder:"Enter recipe title", ingredientsPlaceholder:"Enter ingredients like Tomato, Onion, Garlic...", stepsPlaceholder:"Steps to make... Put each step on a new line.", picturesVideos:"Pictures & Videos", uploadHelp:"Choose a photo or video for this recipe."
  },
  Telugu: {
    menu:"మెనూ", home:"హోమ్", create:"పోస్ట్ సృష్టించండి", premium:"ప్రీమియం", regions:"ప్రాంతాలు", categories:"వర్గాలు", settings:"సెట్టింగ్స్", profile:"ప్రొఫైల్", faq:"తరచుగా అడిగేవి", bookmark:"బుక్‌మార్క్‌లు",
    selectLanguage:"మీకు అనుకూలమైన భాషను ఎంచుకోండి", goodFood:"మంచి ఆహారం", travels:"ప్రయాణిస్తుంది.", discoverCopy:"ఇంటి వంటగదులు మరియు ప్రపంచంలోని వివిధ ప్రాంతాల రుచికరమైన వంటకాలను కనుగొనండి.",
    topRecipes:"ప్రధాన వంటకాలు", shared:"వెచ్చని వంటగదుల నుంచి", all:"అన్నీ", breakfast:"అల్పాహారం", lunch:"మధ్యాహ్న భోజనం", snack:"తిండి", dessert:"డెజర్ట్", salade:"సలాడ్",
    regionsTitle:"ప్రతి ప్రదేశానికి", regionsTitle2:"ఒక ప్రత్యేక రుచి ఉంది.", chooseTable:"ఒక టేబుల్ ఎంచుకోండి", createTitle:"మీ వంటకానికి", createTitle2:"టేబుల్ సిద్ధం చేయండి.", chooseTheme:"థీమ్ ఎంచుకోండి", post:"FlavorShareలో పోస్ట్ చేయండి", posted:"వంటకం విజయవంతంగా పోస్ట్ చేయబడింది!", viewHome:"హోమ్ పేజీ పైభాగంలో చూడవచ్చు.",
    language:"భాష", appearance:"రూపం", kitchenTheme:"వంటగది థీమ్", light:"లైట్", dark:"డార్క్", preview:"థీమ్ ప్రివ్యూ", useTheme:"ఈ థీమ్ ఉపయోగించండి", back:"వెనక్కి", comments:"వ్యాఖ్యలు", addComment:"వ్యాఖ్యను రాయండి...", send:"పంపండి", follow:"ఫాలో చేయండి", following:"ఫాలో అవుతున్నారు", homeCook:"హోమ్ కుక్", yourPost:"మీ పోస్ట్", deletePost:"పోస్ట్ తొలగించండి", leftBehind:"మీరు వదిలిన కొన్ని వంటకాలు", seeAll:"అన్నీ చూడండి", searchResults:"శోధన ఫలితాలు", noRecipes:"వంటకాలు కనబడలేదు", trySearch:"వంటకం పేరు, పదార్థం, ప్రాంతం లేదా వంటవారి పేరుతో వెతకండి.", editProfile:"ప్రొఫైల్ మార్చండి", editing:"మారుస్తున్నారు...", newRecipes:"కొత్త వంటకాలు", likes:"లైక్‌లు", followers:"ఫాలోవర్లు", name:"పేరు", username:"యూజర్ పేరు", bio:"బయో", saveChanges:"మార్పులను సేవ్ చేయండి", cancel:"రద్దు", recipeTitle:"వంటకం పేరు", ingredients:"పదార్థాలు", steps:"తయారీ విధానం", titlePlaceholder:"వంటకం పేరు నమోదు చేయండి", ingredientsPlaceholder:"టమాటా, ఉల్లిపాయ, వెల్లుల్లి వంటి పదార్థాలు నమోదు చేయండి...", stepsPlaceholder:"తయారీ విధానాన్ని ప్రతి దశను కొత్త లైన్‌లో నమోదు చేయండి.", picturesVideos:"ఫోటోలు & వీడియోలు", uploadHelp:"ఈ వంటకానికి ఫోటో లేదా వీడియో ఎంచుకోండి."
  },
  Hindi: {
    menu:"मेनू", home:"होम", create:"पोस्ट बनाएं", premium:"प्रीमियम", regions:"क्षेत्र", categories:"श्रेणियाँ", settings:"सेटिंग्स", profile:"प्रोफ़ाइल", faq:"सामान्य प्रश्न", bookmark:"बुकमार्क",
    selectLanguage:"अपनी पसंदीदा भाषा चुनें", goodFood:"अच्छा खाना", travels:"सफर करता है।", discoverCopy:"घर की रसोई, अलग-अलग क्षेत्रों और दुनिया के स्वादिष्ट व्यंजनों को खोजें।",
    topRecipes:"मुख्य रेसिपी", shared:"गर्म रसोइयों से साझा", all:"सभी", breakfast:"नाश्ता", lunch:"दोपहर का भोजन", snack:"स्नैक", dessert:"मिठाई", salade:"सलाद",
    regionsTitle:"हर जगह", regionsTitle2:"का अपना स्वाद है।", chooseTable:"एक टेबल चुनें", createTitle:"अपनी रेसिपी के लिए", createTitle2:"टेबल सजाएं।", chooseTheme:"थीम चुनें", post:"FlavorShare पर पोस्ट करें", posted:"रेसिपी सफलतापूर्वक पोस्ट हुई!", viewHome:"इसे होम पेज के सबसे ऊपर देख सकते हैं।",
    language:"भाषा", appearance:"दिखावट", kitchenTheme:"किचन थीम", light:"लाइट", dark:"डार्क", preview:"थीम प्रीव्यू", useTheme:"इस थीम का उपयोग करें", back:"वापस", comments:"टिप्पणियाँ", addComment:"टिप्पणी लिखें...", send:"भेजें", follow:"फॉलो करें", following:"फॉलो कर रहे हैं", homeCook:"होम कुक", yourPost:"आपकी पोस्ट", deletePost:"पोस्ट हटाएं", leftBehind:"कुछ रेसिपी जिन्हें आपने छोड़ा", seeAll:"सभी देखें", searchResults:"खोज परिणाम", noRecipes:"कोई रेसिपी नहीं मिली", trySearch:"रेसिपी का नाम, सामग्री, क्षेत्र या कुक के नाम से खोजें।", editProfile:"प्रोफ़ाइल संपादित करें", editing:"संपादन...", newRecipes:"नई रेसिपी", likes:"लाइक्स", followers:"फॉलोअर्स", name:"नाम", username:"यूज़रनेम", bio:"बायो", saveChanges:"बदलाव सहेजें", cancel:"रद्द करें", recipeTitle:"रेसिपी का नाम", ingredients:"सामग्री", steps:"बनाने की विधि", titlePlaceholder:"रेसिपी का नाम लिखें", ingredientsPlaceholder:"टमाटर, प्याज़, लहसुन जैसी सामग्री लिखें...", stepsPlaceholder:"बनाने की विधि लिखें। हर चरण नई लाइन में लिखें।", picturesVideos:"फोटो और वीडियो", uploadHelp:"इस रेसिपी के लिए फोटो या वीडियो चुनें।"
  }
};

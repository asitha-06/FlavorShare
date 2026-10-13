import React, { useEffect, useState } from "react";
import TopBar from "./components/TopBar";
import SideMenu from "./components/SideMenu";
import BowlLoader from "./components/BowlLoader";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import CreatePost from "./pages/CreatePost";
import Premium from "./pages/Premium";
import Regions from "./pages/Regions";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import Bookmark from "./pages/Bookmark";
import RecipeDetail from "./pages/RecipeDetail";
import ThemePreview from "./pages/ThemePreview";
import Chefs from "./pages/Chefs";
import { AppProvider, useApp } from "./context/AppContext";

function AppInner() {
  const { theme, dark, flash, t, session, loading:authLoading, signOut } = useApp();
  const [auth, setAuth] = useState("welcome");
  const [page, setPage] = useState("Home");
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [themePage, setThemePage] = useState("Warm Kitchen");
  const [themeReturnPage, setThemeReturnPage] = useState("Create Post");
  

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    document.documentElement.dataset.dark = dark ? "true" : "false";
  }, [theme, dark]);

  const navigate = (next) => {
    setLoading(true);
    setMenu(false);
    setSelected(null);
    window.setTimeout(() => { setPage(next); setLoading(false); }, 220);
  };

 useEffect(() => {
  if (session) {
    setAuth("app");
  } else {
    setAuth("welcome");
    setPage("Home");
    setSelected(null);
    setMenu(false);
  }
}, [session]);
  const loginSuccess = () => setAuth("app");

  if (authLoading) return <main className="welcome-page"><BowlLoader/></main>;
  if (!session && auth === "welcome") return (
    <main className="welcome-page">
      <div className="welcome-doodle">✦</div>
      <img src="/logo.svg" className="welcome-logo" alt="FlavorShare" />
      <span className="kicker">FLAVORS · STORIES · PEOPLE</span>
      <h1>Welcome to<br/><em>FlavorShare.</em></h1>
      <p>A little kitchen on your screen.</p>
      <button className="primary-button" onClick={() => setAuth("login")}>Enter the kitchen →</button>
      <button className="text-link welcome-signup" onClick={() => setAuth("signup")}>Create an account</button>
      <div className="welcome-loader"><BowlLoader /></div>
    </main>
  );

  if (!session && (auth === "login" || auth === "signup")) return <Auth mode={auth} onSuccess={loginSuccess} setMode={setAuth}/>;

  let content;
  if (selected) content = <RecipeDetail recipe={selected} onBack={() => setSelected(null)} />;
  else if (page === "Home") content = <Home onOpenRecipe={setSelected}/>;
  else if (page === "Discover") content = <Discover onOpenRecipe={setSelected}/>;
  else if (page === "Create Post") content = <CreatePost onPost={(recipe) => { setSelected(recipe); navigate("Home"); }} onOpenTheme={(name) => { setThemePage(name); setThemeReturnPage("Create Post"); navigate("Theme Preview"); }} />;
  else if (page === "Premium") content = <Premium/>;
  else if (page === "Regions") content = <Regions onOpenRecipe={setSelected}/>;
  else if (page === "Chefs") content = <Chefs onOpenRecipe={setSelected}/>;
  else if (page === "Categories") content = <Categories onOpenRecipe={setSelected}/>;
  else if (page === "Settings") content = <Settings onOpenTheme={(name) => { setThemePage(name); setThemeReturnPage("Settings"); navigate("Theme Preview"); }} />;
  else if (page === "Profile") content = <Profile onOpenRecipe={setSelected}/>;
  else if (page === "FAQ") content = <FAQ/>;
  else if (page === "Bookmark") content = <Bookmark onOpenRecipe={setSelected}/>;
  else if (page === "Theme Preview") content = <ThemePreview themeName={themePage} onBack={() => navigate(themeReturnPage)} />;
  else content = <Home onOpenRecipe={setSelected}/>;

  return (
    <div className="app-shell">
      <TopBar onMenu={() => setMenu(true)} onHome={() => navigate("Home")} onProfile={() => navigate("Profile")} />
      <SideMenu page={page} setPage={navigate} open={menu} onClose={() => setMenu(false)}/>
      {loading && <div className="loading-overlay"><BowlLoader/></div>}
      {flash && <div className="flash-message" role="status"><strong>✓</strong><div><b>{flash}</b><small>{t("viewHome")}</small></div></div>}
      <div className="page-content">{content}</div>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}

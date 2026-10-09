import React, { useMemo, useState } from "react";
import SpoonSearch from "../components/SpoonSearch";
import RecipeCard from "../components/RecipeCard";
import Doodles from "../components/Doodles";
import LanguageSelector from "../components/LanguageSelector";
import { categories, recipes, regions, matchesRecipe } from "../data";
import { useApp } from "../context/AppContext";

export default function Home({ onOpenRecipe }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searchSubmitted, setSearchSubmitted] = useState("");
  const { posts, t } = useApp();
  const allRecipes = useMemo(() => [...posts, ...recipes], [posts]);
  const shown = useMemo(() => {
    const q = (searchSubmitted || query).trim();
    return allRecipes.filter(r => (category === "All" || r.category === category) && matchesRecipe(r,q));
  }, [allRecipes, searchSubmitted, query, category]);

  const searchText = (searchSubmitted || query).trim();
  const searchActive = searchText.length > 0;

  return (
    <main>
      <Doodles />
      <section className="home-intro">
        <div>
          <span className="kicker">FLAVORS · STORIES · PEOPLE</span>
          <h1>{t("goodFood")}<br/><em>{t("travels")}</em></h1>
          <p>{t("discoverCopy")}</p>
          <SpoonSearch value={query} onChange={setQuery} onSubmit={() => setSearchSubmitted(query)}/>
        </div>
        <div className="intro-art"><div className="art-ring"></div><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85" alt="Colorful food bowl"/><span className="scribble">pass the<br/>spoon.</span></div>
      </section>
      <section className="prototype-section"><LanguageSelector /></section>
      <section className="prototype-section">
        <div className="section-heading"><div><span className="kicker">YOUR PREVIOUS VIEWED RECIPES</span><h2>{t("leftBehind")}</h2></div><button className="see-all" onClick={() => {setQuery("");setSearchSubmitted("");setCategory("All")}}>{t("seeAll")} →</button></div>
        <div className="mini-row">{allRecipes.slice(0,4).map(r => <button key={r.id} className="mini-card" onClick={() => onOpenRecipe(r)}><img src={r.image} alt=""/><strong>{r.name}</strong><span>{r.description}</span><small>{r.hashtags?.join(" ")}</small></button>)}</div>
      </section>
      <section className="prototype-section search-results-section">
        <div className="section-heading"><div><span className="kicker">{searchActive ? t("searchResults") : t("topRecipes")}</span><h2>{searchActive ? `Results for “${searchText}”` : t("shared")}</h2></div><div className="home-filters">{categories.slice(0,4).map(c => <button key={c} className={category === c ? "filter active" : "filter"} onClick={() => setCategory(c)}>{({All:t("all"),Breakfast:t("breakfast"),Lunch:t("lunch"),Snack:t("snack"),Dessert:t("dessert")})[c]||c}</button>)}</div></div>
        <div className="recipe-grid">{shown.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpenRecipe}/>)}</div>{searchActive && !shown.length && <div className="empty-state"><h2>{t("noRecipes")}</h2><p>{t("trySearch")}</p></div>}
      </section>
      <section className="prototype-section region-section">
        <div className="section-heading"><div><span className="kicker">REGION BASED RECIPES</span><h2>{t("chooseTable")}</h2></div></div>
        <div className="region-row">{regions.map((region, i) => <button key={region} className={`region-tile region-${i}`} onClick={() => {setQuery(region);setSearchSubmitted(region);setCategory("All")}}><span>{region}</span><small>taste & stories</small></button>)}</div>
      </section>
      <footer className="site-footer"><div><strong>Contact</strong><span>+91 912xxx xxxx</span><span>abc@flavorshare.com</span></div><div className="socials"><span>in</span><span>◎</span><span>▶</span></div><small>© FlavorShare 2026</small></footer>
    </main>
  );
}


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

  const searchText = (searchSubmitted || query).trim();
  const searchActive = searchText.length > 0;

  const shown = useMemo(
    () =>
      allRecipes.filter(
        (recipe) =>
          (category === "All" || recipe.category === category) &&
          matchesRecipe(recipe, searchText)
      ),
    [allRecipes, category, searchText]
  );

  return (
    <main>
      <Doodles />

      <section className="home-intro">
        <div>
          <span className="kicker">FLAVORS · STORIES · PEOPLE</span>
          <h1>
            {t("goodFood")}
            <br />
            <em>{t("travels")}</em>
          </h1>
          <p>{t("discoverCopy")}</p>

          <SpoonSearch
            value={query}
            onChange={(value) => {
              setQuery(value);
              setSearchSubmitted("");
            }}
            onSubmit={() => setSearchSubmitted(query)}
          />
        </div>

        <div className="intro-art">
          <div className="art-ring"></div>
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
            alt="Colorful food bowl"
          />
          <span className="scribble">
            pass the
            <br />
            spoon.
          </span>
        </div>
      </section>

      <section className="prototype-section">
        <LanguageSelector />
      </section>

      {!searchActive && (
        <section className="prototype-section">
          <div className="section-heading">
            <div>
              <span className="kicker">YOUR PREVIOUS VIEWED RECIPES</span>
              <h2>{t("leftBehind")}</h2>
            </div>

            <button
              type="button"
              className="see-all"
              onClick={() => {
                setQuery("");
                setSearchSubmitted("");
                setCategory("All");
              }}
            >
              {t("seeAll")} →
            </button>
          </div>

          <div className="mini-row">
            {allRecipes.slice(0, 4).map((recipe) => (
              <button
                type="button"
                key={recipe.id}
                className="mini-card"
                onClick={() => onOpenRecipe(recipe)}
              >
                <img src={recipe.image} alt="" />
                <strong>{recipe.name}</strong>
                <span>{recipe.description}</span>
                <small>{recipe.hashtags?.join(" ")}</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="prototype-section search-results-section">
        <div className="section-heading">
          <div>
            <span className="kicker">
              {searchActive ? t("searchResults") : t("topRecipes")}
            </span>
            <h2>
              {searchActive
                ? `Results for "${searchText}"`
                : t("shared")}
            </h2>
          </div>

          <div className="home-filters">
            {categories.slice(0, 4).map((item) => (
              <button
                type="button"
                key={item}
                className={category === item ? "filter active" : "filter"}
                onClick={() => setCategory(item)}
              >
                {(
                  {
                    All: t("all"),
                    Breakfast: t("breakfast"),
                    Lunch: t("lunch"),
                    Snack: t("snack"),
                    Dessert: t("dessert"),
                  }
                )[item] || item}
              </button>
            ))}
          </div>
        </div>

        <div className="recipe-grid">
          {shown.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onOpen={onOpenRecipe}
            />
          ))}
        </div>

        {searchActive && shown.length === 0 && (
          <div className="empty-state">
            <h2>{t("noRecipes")}</h2>
            <p>{t("trySearch")}</p>
          </div>
        )}
      </section>

      {!searchActive && (
        <section className="prototype-section region-section">
          <div className="section-heading">
            <div>
              <span className="kicker">REGION BASED RECIPES</span>
              <h2>{t("chooseTable")}</h2>
            </div>
          </div>

          <div className="region-row">
            {regions.map((region, index) => (
              <button
                type="button"
                key={region}
                className={`region-tile region-${index}`}
                onClick={() => {
                  setQuery(region);
                  setSearchSubmitted(region);
                  setCategory("All");
                }}
              >
                <span>{region}</span>
                <small>taste & stories</small>
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div>
          <strong>Contact</strong>
          <span>+91 912xxx xxxx</span>
          <span>abc@flavorshare.com</span>
        </div>

        <div className="socials">
          <span>in</span>
          <span>◎</span>
          <span>▶</span>
        </div>

        <small>© FlavorShare 2026</small>
      </footer>
    </main>
  );
}

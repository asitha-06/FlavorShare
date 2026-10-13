
import React, { useEffect, useMemo } from "react";
import RecipeCard from "../components/RecipeCard";
import { recipes } from "../data";
import { useApp } from "../context/AppContext";

const headChefs = [
  {
    id: "head-1",
    name: "Chef Sanjeev Kapoor",
    region: "India",
    specialty: "Indian classics",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Masala Dosa", "Coconut Payasam"],
  },
  {
    id: "head-2",
    name: "Chef Vikas Khanna",
    region: "India",
    specialty: "Modern Indian cuisine",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Gulab Jamun Cheesecake", "Rose Cardamom Cake"],
  },
  {
    id: "head-3",
    name: "Chef Gordon Ramsay",
    region: "Global",
    specialty: "Contemporary cuisine",
    image: "https://images.unsplash.com/photo-1574966739987-65e38c4d9f4a?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Lemon Ricotta Pasta", "Miso Ramen Bowl"],
  },
];

const homeChefs = [
  {
    id: "home-1",
    name: "Andhra Home Chefs",
    region: "Andhra Pradesh",
    specialty: "Spicy regional favorites",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Masala Dosa", "Coconut Payasam"],
  },
  {
    id: "home-2",
    name: "South Indian Home Chefs",
    region: "South India",
    specialty: "Comfort food & family recipes",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Coconut Payasam", "Masala Dosa"],
  },
  {
    id: "home-3",
    name: "Community Home Chefs",
    region: "All regions",
    specialty: "Recipes shared from home kitchens",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85",
    recipeNames: ["Gulab Jamun Cheesecake", "Rose Cardamom Cake"],
  },
];

function ChefCard({ chef, onOpen }) {
  return (
    <button
      type="button"
      className="chef-directory-card"
      onClick={() => onOpen(chef)}
    >
      <img src={chef.image} alt={chef.name} loading="lazy" />
      <span className="kicker">{chef.region}</span>
      <h3>{chef.name}</h3>
      <p>{chef.specialty}</p>
      <span className="chef-card-link">Explore featured recipes →</span>
    </button>
  );
}

export default function Chefs({ onOpenRecipe, initialType = "All" }) {
  const { posts } = useApp();

  const allRecipes = useMemo(
    () => [...posts, ...recipes],
    [posts]
  );

  useEffect(() => {
    if (initialType === "Home Chef") {
      document.getElementById("home-chef-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (initialType === "Head Chef") {
      document.getElementById("head-chef-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [initialType]);

  const homeRecipes = allRecipes.filter(
    (recipe) => (recipe.chefType || "Home Chef") === "Home Chef"
  );

  const headRecipes = allRecipes.filter(
    (recipe) => recipe.chefType === "Head Chef"
  );

  const [selectedChef, setSelectedChef] = React.useState(null);

  const selectedRecipes = selectedChef
    ? allRecipes.filter(
        (recipe) =>
          selectedChef.recipeNames.includes(recipe.name) ||
          (selectedChef.id.startsWith("home-") &&
            (recipe.region || "")
              .toLowerCase()
              .includes(selectedChef.region.toLowerCase()))
      )
    : [];

  return (
    <main className="content-page chefs-page">
      <div className="page-hero compact">
        <span className="kicker">THE PEOPLE BEHIND THE PLATE</span>
        <h1>
          Meet the cooks.
          <br />
          <em>Find your favorites.</em>
        </h1>
        <p>
          Explore professional chefs and home cooks, and discover recipes
          shared by the FlavorShare community.
        </p>
      </div>

      {selectedChef ? (
        <section className="chef-selected">
          <button
            type="button"
            className="back-button"
            onClick={() => setSelectedChef(null)}
          >
            ← All chefs
          </button>

          <div className="chef-profile-banner">
            <img src={selectedChef.image} alt={selectedChef.name} />
            <div>
              <span className="kicker">{selectedChef.region}</span>
              <h2>{selectedChef.name}</h2>
              <p>{selectedChef.specialty}</p>
              <div className="chef-hashtags">
                {selectedChef.id.startsWith("head-")
                  ? "#HeadChef #ChefSpotlight #FlavorShare"
                  : "#HomeChef #RegionalChef #FlavorShare"}
              </div>
            </div>
          </div>

          <h2>Featured recipes</h2>

          <div className="recipe-grid">
            {selectedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onOpen={onOpenRecipe}
              />
            ))}
          </div>

          {!selectedRecipes.length && (
            <p>No recipes are linked to this featured chef yet.</p>
          )}
        </section>
      ) : (
        <>
          <section
            id="head-chef-section"
            className="chef-directory-section"
          >
            <span className="kicker">PROFESSIONAL KITCHENS</span>
            <h2>Head Chefs</h2>
            <p>Recipes from professional chefs and culinary experts.</p>

            <div className="recipe-grid">
              {headRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={onOpenRecipe}
                />
              ))}
            </div>

            {!headRecipes.length && (
              <p>No community Head Chef recipes yet.</p>
            )}

            <h3>Featured professionals</h3>
            <div className="chef-directory-grid">
              {headChefs.map((chef) => (
                <ChefCard
                  key={chef.id}
                  chef={chef}
                  onOpen={setSelectedChef}
                />
              ))}
            </div>
          </section>

          <section
            id="home-chef-section"
            className="chef-directory-section"
          >
            <span className="kicker">RECIPES FROM HOME</span>
            <h2>Home Chefs</h2>
            <p>Family favorites, regional dishes, and community recipes.</p>

            <div className="recipe-grid">
              {homeRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={onOpenRecipe}
                />
              ))}
            </div>

            {!homeRecipes.length && (
              <p>No community Home Chef recipes yet.</p>
            )}

            <h3>Featured home kitchens</h3>
            <div className="chef-directory-grid">
              {homeChefs.map((chef) => (
                <ChefCard
                  key={chef.id}
                  chef={chef}
                  onOpen={setSelectedChef}
                />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

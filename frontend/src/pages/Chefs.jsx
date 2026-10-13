import React, { useMemo, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { recipes } from "../data";
import { useApp } from "../context/AppContext";

const headChefs = [
  { id: "head-1", name: "Chef Sanjeev Kapoor", region: "India", specialty: "Indian classics", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=85", recipeNames: ["Masala Dosa", "Coconut Payasam"] },
  { id: "head-2", name: "Chef Vikas Khanna", region: "India", specialty: "Modern Indian cuisine", image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=85", recipeNames: ["Gulab Jamun Cheesecake", "Rose Cardamom Cake"] },
  { id: "head-3", name: "Chef Gordon Ramsay", region: "Global", specialty: "Contemporary cuisine", image: "https://images.unsplash.com/photo-1574966739987-65e38c4d9f4a?auto=format&fit=crop&w=900&q=85", recipeNames: ["Lemon Ricotta Pasta", "Miso Ramen Bowl"] }
];
const homeChefs = [
  { id: "home-1", name: "Andhra Home Chefs", region: "Andhra Pradesh", specialty: "Spicy regional favorites", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85", recipeNames: ["Masala Dosa", "Coconut Payasam"] },
  { id: "home-2", name: "South Indian Home Chefs", region: "South India", specialty: "Comfort food & family recipes", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=85", recipeNames: ["Coconut Payasam", "Masala Dosa"] },
  { id: "home-3", name: "Community Home Chefs", region: "All regions", specialty: "Recipes shared from home kitchens", image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=85", recipeNames: ["Gulab Jamun Cheesecake", "Rose Cardamom Cake"] }
];
function ChefCard({ chef, onOpen }) {
  return <button type="button" className="chef-directory-card" onClick={() => onOpen(chef)}><img src={chef.image} alt={chef.name} loading="lazy"/><span className="kicker">{chef.region}</span><h3>{chef.name}</h3><p>{chef.specialty}</p><span className="chef-card-link">Explore famous recipes →</span></button>;
}
export default function Chefs({ onOpenRecipe }) {
  const { posts } = useApp();
  const [selected, setSelected] = useState(null);
  const allRecipes = useMemo(() => [...posts, ...recipes], [posts]);
  const chefRecipes = selected ? allRecipes.filter(r => selected.recipeNames.includes(r.name) || (selected.id.startsWith("home-") && (r.region || "").toLowerCase().includes(selected.region.toLowerCase()))) : [];
  return <main className="content-page chefs-page"><div className="page-hero compact"><span className="kicker">THE PEOPLE BEHIND THE PLATE</span><h1>Meet the cooks.<br/><em>Find your favorites.</em></h1><p>Choose a chef card to discover recipes associated with their kitchen. Featured chef cards are editorial examples; community recipes come from your Supabase feed.</p></div>
    {selected ? <section className="chef-selected"><button type="button" className="back-button" onClick={() => setSelected(null)}>← All chefs</button><div className="chef-profile-banner"><img src={selected.image} alt={selected.name}/><div><span className="kicker">{selected.region}</span><h2>{selected.name}</h2><p>{selected.specialty}</p><div className="chef-hashtags">{selected.id.startsWith("head-") ? "#HeadChef #ChefSpotlight #FlavorShare" : "#HomeChef #RegionalChef #FlavorShare"}</div></div></div><h2>Famous recipes</h2><div className="recipe-grid">{chefRecipes.map(r=><RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe}/>)}</div>{!chefRecipes.length&&<p>No recipes are linked to this chef yet. Add recipes through Create Post to grow this collection.</p>}</section> : <><section className="chef-directory-section"><span className="kicker">FEATURED PROFESSIONALS</span><h2>Head Chefs</h2><div className="chef-directory-grid">{headChefs.map(c=><ChefCard key={c.id} chef={c} onOpen={setSelected}/>)}</div></section><section className="chef-directory-section"><span className="kicker">RECIPES FROM HOME</span><h2>Regional Home Chefs</h2><div className="chef-directory-grid">{homeChefs.map(c=><ChefCard key={c.id} chef={c} onOpen={setSelected}/>)}</div></section></>}
  </main>;
}

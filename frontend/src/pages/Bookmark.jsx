import React from "react";
import RecipeCard from "../components/RecipeCard";
import { useApp } from "../context/AppContext";

export default function Bookmark({ onOpenRecipe }) {
  const { saved } = useApp();
  return <main className="content-page"><div className="page-hero compact"><span className="kicker">MY BOWL · BOOKMARK</span><h1>Saved for<br/><em>later.</em></h1><p>Everything you bookmarked gathers here, like a little bowl of ideas.</p></div>{!saved.length ? <div className="empty-bowl"><div className="big-bowl">🥣</div><h2>Your bowl is empty.</h2><p>Tap the bowl icon on a recipe to save it here.</p></div> : <div className="recipe-grid">{saved.map(r => <RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe}/>)}</div>}</main>;
}

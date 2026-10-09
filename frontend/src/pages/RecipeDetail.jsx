import React, { useState } from "react";
import CommentSection from "../components/CommentSection";
import { useApp } from "../context/AppContext";

export default function RecipeDetail({ recipe, onBack }) {
  const { saved, toggleBookmark, following, toggleFollow, deletePost, notify, t } = useApp();
  const [liked, setLiked] = useState(false);
  if (!recipe) return null;
  const bookmarked = saved.some(x => x.id === recipe.id);
  const themeClass = recipe.theme ? `detail-theme-${recipe.theme.toLowerCase().replace(/[^a-z0-9]+/g,"-")}` : "";
  return (
    <main className={`detail-page ${themeClass} ${recipe.userPost ? "detail-user-post" : ""}`} style={recipe.theme ? {"--post-theme-image": `url(${recipe.theme && ({"Blank":"/themes/blank.svg","Warm Kitchen":"/themes/warm-kitchen.svg","Rustic Kitchen":"/themes/rustic-kitchen.svg","Pastel Bakery":"/themes/pastel-bakery.svg","Farm-to-Table":"/themes/farm-to-table.svg","Fresh & Healthy":"/themes/fresh-healthy.svg"}[recipe.theme])}`} : undefined}>
      <button className="back-button" onClick={onBack}>← Back to recipes</button>
      <div className="detail-grid"><div className="detail-photo">{recipe.mediaType==="video"?<video src={recipe.image} controls/>:<img src={recipe.image} alt={recipe.name}/>}<span>{recipe.time}</span></div><div className="detail-copy"><span className="kicker">{recipe.category} · {recipe.region}</span><h1>{recipe.name}</h1><p className="detail-description">{recipe.description}</p><div className="detail-author"><span className="avatar">{recipe.creator.split(" ").map(x => x[0]).join("")}</span><div><strong>{recipe.creator}</strong><small>{t("homeCook")}</small></div><button className={`follow-button ${following.includes(recipe.creator) ? "following" : ""}`} type="button" onClick={() => toggleFollow(recipe.creator)}>{following.includes(recipe.creator) ? t("following") : t("follow")}</button></div><div className="detail-actions"><button className="primary-button" onClick={() => toggleBookmark(recipe)}>{bookmarked ? "Saved in My Bowl" : "Save to My Bowl"}</button><button className={`secondary-button ${liked ? "selected-action" : ""}`} onClick={() => setLiked(v => !v)}>{liked ? "♥ Liked" : "♡ Like"}</button>{recipe.userPost && <button className="danger-button" onClick={() => { if(window.confirm("Delete this recipe post?")){deletePost(recipe.id); notify("Recipe post deleted."); onBack();} }}>Delete post</button>}</div></div></div>
      <div className="recipe-instructions"><section><h2>Ingredients</h2><ul>{recipe.ingredients.map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}</ul></section><section><h2>Steps to make</h2><ol>{recipe.steps.map((x, i) => <li key={`${x}-${i}`}>{x}</li>)}</ol></section></div>
      <CommentSection recipeId={recipe.id}/>
    </main>
  );
}

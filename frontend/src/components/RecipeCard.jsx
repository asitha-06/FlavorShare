import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function RecipeCard({ recipe, onOpen }) {
  const { saved, toggleBookmark, following, toggleFollow, deletePost, notify, t, liked, toggleLike } = useApp();
  const bookmarked = saved.some(x => x.id === recipe.id);
  const isLiked = liked.includes(recipe.id);

  return (
    <article className="recipe-card">
      <button className="recipe-image-button" onClick={() => onOpen(recipe)}>
        <img src={recipe.image} alt={recipe.name} />
        <span className="time-pill">{recipe.time}</span>
      </button>
      <div className="recipe-body">
        <span className="recipe-category">{recipe.category} · {recipe.region}</span>
        <button className="recipe-title-button" onClick={() => onOpen(recipe)}><h3>{recipe.name}</h3></button>
        <p>{recipe.description}</p>
        <div className="recipe-meta">
          <div className="creator"><span className="avatar">{recipe.creator.split(" ").map(x => x[0]).join("")}</span><div><strong>{recipe.creator}</strong><small>{t("homeCook")}</small></div></div>
          <button className={`follow-button ${following.includes(recipe.creator) ? "following" : ""}`} type="button" onClick={() => toggleFollow(recipe.creator)}>{following.includes(recipe.creator) ? t("following") : t("follow")}</button>
        </div>
        {recipe.userPost && <div className="user-post-controls"><span className="created-badge">{t("yourPost")}</span><button className="delete-post-button" type="button" onClick={() => { if (window.confirm("Delete this recipe post?")) deletePost(recipe.id); }}>{t("deletePost")}</button></div>}
        <div className="recipe-actions">
          <button className={`icon-action ${isLiked ? "liked" : ""}`} onClick={() => toggleLike(recipe.id)}>{isLiked ? "♥" : "♡"} <span>{isLiked ? "Liked" : "Like"}</span></button>
          <button className={`icon-action ${bookmarked ? "liked" : ""}`} onClick={() => toggleBookmark(recipe)} title="Save to My Bowl">{bookmarked ? "♣" : "♧"}</button>
        </div>
      </div>
    </article>
  );
}

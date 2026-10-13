import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function RecipeCard({ recipe, onOpen }) {
  const { saved, toggleBookmark, following, toggleFollow, deletePost, notify, t, liked, toggleLike, likeCounts, followerCounts } = useApp();
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
          <div className="creator"><span className="avatar">{recipe.creator.split(" ").map(x => x[0]).join("")}</span><div><strong>{recipe.creator}</strong><small>{recipe.chefType || t("homeCook")} · {followerCounts?.[recipe.creatorId] || 0} followers</small></div></div>
          <button className={`follow-button ${following.includes(recipe.creatorId) ? "following" : ""}`} type="button" disabled={!recipe.creatorId} title={!recipe.creatorId ? "Demo chef card; follow community cooks with accounts" : "Follow this cook"} onClick={() => toggleFollow(recipe.creatorId)}>{following.includes(recipe.creatorId) ? t("following") : t("follow")}</button>
        </div>
        {recipe.userPost && <div className="user-post-controls"><span className="created-badge">{t("yourPost")}</span><button className="delete-post-button" type="button" onClick={() => { if (window.confirm("Delete this recipe post?")) deletePost(recipe.id); }}>{t("deletePost")}</button></div>}
        <div className="recipe-tags">{(recipe.hashtags || []).map(tag => <span key={tag}>{tag}</span>)}</div><div className="recipe-actions">
          <button className={`icon-action ${isLiked ? "liked" : ""}`} onClick={() => toggleLike(recipe.id)}>{isLiked ? "♥" : "♡"} <span>{isLiked ? "Liked" : "Like"}</span> <small>{likeCounts?.[recipe.id] || 0}</small></button>
          <button className={`icon-action ${bookmarked ? "liked" : ""}`} onClick={() => toggleBookmark(recipe)} title="Save to My Bowl">{bookmarked ? "♣" : "♧"}</button>
        </div>
      </div>
    </article>
  );
}

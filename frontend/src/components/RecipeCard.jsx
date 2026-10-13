
import React from "react";
import { useApp } from "../context/AppContext";

export default function RecipeCard({ recipe, onOpen }) {
  const {
    saved,
    toggleBookmark,
    following,
    toggleFollow,
    deletePost,
    notify,
    t,
    liked,
    toggleLike,
    likeCounts,
    followerCounts,
    session,
  } = useApp();

  const bookmarked = saved.some((item) => item.id === recipe.id);
  const isLiked = liked.includes(recipe.id);
  const isFollowing = following.includes(recipe.creatorId);
  const isOwnRecipe = recipe.creatorId === session?.user?.id;

  const creatorName = recipe.creator || "Home Cook";
  const initials = creatorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="recipe-card">
      <button
        type="button"
        className="recipe-image-button"
        onClick={() => onOpen(recipe)}
      >
        <img src={recipe.image} alt={recipe.name} />
        <span className="time-pill">{recipe.time}</span>
      </button>

      <div className="recipe-body">
        <span className="recipe-category">
          {recipe.category} · {recipe.region}
        </span>

        <button
          type="button"
          className="recipe-title-button"
          onClick={() => onOpen(recipe)}
        >
          <h3>{recipe.name}</h3>
        </button>

        <p>{recipe.description}</p>

        <div className="recipe-meta">
          <div className="creator">
            <span className="avatar">{initials}</span>

            <div>
              <strong>{creatorName}</strong>
              <small>
                {recipe.chefType || t("homeCook")} ·{" "}
                {followerCounts?.[recipe.creatorId] || 0} followers
              </small>
            </div>
          </div>

          <button
            type="button"
            className={`follow-button ${isFollowing ? "following" : ""}`}
            disabled={!recipe.creatorId || isOwnRecipe}
            title={
              isOwnRecipe
                ? "You cannot follow your own account"
                : !recipe.creatorId
                ? "This is a demo recipe"
                : isFollowing
                ? "Unfollow this cook"
                : "Follow this cook"
            }
            onClick={() => toggleFollow(recipe.creatorId)}
          >
            {isFollowing ? t("following") : t("follow")}
          </button>
        </div>

        {recipe.userPost && (
          <div className="user-post-controls">
            <span className="created-badge">{t("yourPost")}</span>

            <button
              type="button"
              className="delete-post-button"
              onClick={() => {
                if (window.confirm("Delete this recipe post?")) {
                  deletePost(recipe.id);
                }
              }}
            >
              {t("deletePost")}
            </button>
          </div>
        )}

        <div className="recipe-tags">
          {(recipe.hashtags || []).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="recipe-actions">
          <button
            type="button"
            className={`icon-action ${isLiked ? "liked" : ""}`}
            aria-pressed={isLiked}
            title={isLiked ? "Unlike recipe" : "Like recipe"}
            onClick={() => toggleLike(recipe.id)}
          >
            {isLiked ? "♥" : "♡"}
            <span>{isLiked ? "Liked" : "Like"}</span>
            <small>{likeCounts?.[recipe.id] || 0}</small>
          </button>

          <button
            type="button"
            className={`icon-action ${bookmarked ? "liked" : ""}`}
            aria-pressed={bookmarked}
            title={bookmarked ? "Remove from My Bowl" : "Save to My Bowl"}
            onClick={() => toggleBookmark(recipe)}
          >
            {bookmarked ? "♣" : "♧"}
            <span>{bookmarked ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

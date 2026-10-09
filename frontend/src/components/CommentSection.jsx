import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function CommentSection({ recipeId }) {
  const { comments, addComment } = useApp();
  const [text, setText] = useState("");
  const list = comments[recipeId] || [];

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(recipeId, text);
    setText("");
  };

  return (
    <section className="comments-section">
      <div className="section-heading">
        <div><span className="kicker">COMMUNITY</span><h2>Comments</h2></div>
        <span className="comment-count">{list.length}</span>
      </div>
      <form className="comment-form" onSubmit={submit}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Share a thought about this recipe..." />
        <button className="secondary-button" type="submit">Post</button>
      </form>
      <div className="comment-list">
        {!list.length && <p className="muted-copy">Be the first to leave a little kitchen note.</p>}
        {list.map(comment => (
          <article className="comment-item" key={comment.id}>
            <span className="avatar">{comment.author.split(" ").map(x => x[0]).join("")}</span>
            <div><strong>{comment.author}</strong><p>{comment.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

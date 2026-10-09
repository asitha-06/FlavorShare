import React, { useState } from "react";

export default function SpoonSearch({ value, onChange, onSubmit }) {
  const [active, setActive] = useState(false);

  return (
    <div className={`spoon-search ${active ? "active" : ""}`}>
      <button className="spoon-button" onClick={() => setActive(true)} aria-label="Search">
        <svg viewBox="0 0 70 70" aria-hidden="true">
          <ellipse cx="22" cy="20" rx="14" ry="18" />
          <path d="M30 34L57 62" />
        </svg>
      </button>
      <input
        value={value}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit?.(); }}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setActive(true)}
        placeholder="Search recipes, regions or cooks..."
      />
      {value && <button className="search-clear" type="button" onClick={() => onChange("")}>×</button>}
      <button className="search-go" type="button" onClick={() => onSubmit?.()}>Search</button>
    </div>
  );
}

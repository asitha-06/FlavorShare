import React from "react";

export default function Logo({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="FlavorShare home">
      <img src="/logo.svg" alt="" />
      <span>FlavorShare</span>
    </button>
  );
}

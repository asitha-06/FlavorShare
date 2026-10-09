import React from "react";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";

export default function TopBar({ onMenu, onHome, onProfile }) {
  return (
    <header className="topbar">
      <button className="menu-trigger" onClick={onMenu}>
        <span>☰</span>
        <small>MENU</small>
      </button>
      <Logo onClick={onHome} />
      <div className="top-actions">
        <button onClick={onProfile} className="profile-dot" aria-label="Profile">A</button>
        <div className="top-language"><span>◎</span><LanguageSelector compact/></div>
      </div>
    </header>
  );
}

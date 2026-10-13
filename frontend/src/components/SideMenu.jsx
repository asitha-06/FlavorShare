
import React from "react";
import { useApp } from "../context/AppContext";

const items = [
  ["Home", "⌂", "home"],
  ["Create Post", "＋", "create"],
  ["Premium", "✦", "premium"],
  ["Regions", "◌", "regions"],
  ["Chefs", "♨", "chefs"],
  ["Categories", "▦", "categories"],
  ["Settings", "⚙", "settings"],
  ["Profile", "○", "profile"],
  ["FAQ", "?", "faq"],
  ["Bookmark", "♧", "bookmark"],
];

export default function SideMenu({ page, setPage, open, onClose }) {
  const { t, signOut, notify } = useApp();

  const handleLogout = async () => {
    try {
      const { error } = await signOut();

      if (error) {
        notify(error.message || "Unable to log out. Please try again.");
        return;
      }

      onClose();
    } catch (error) {
      notify(error.message || "Unable to log out. Please try again.");
    }
  };

  return (
    <>
      <div
        className={`menu-backdrop ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`side-menu ${open ? "open" : ""}`}>
        <div className="menu-heading">
          <span className="menu-lines">☰</span>
          <strong>{t("menu")}</strong>
          <button onClick={onClose} className="close-menu">
            ×
          </button>
        </div>

        <nav>
          {items.map(([label, icon, key]) => (
            <button
              key={label}
              className={
                page === label ? "menu-item active" : "menu-item"
              }
              onClick={() => {
                setPage(label);
                onClose();
              }}
            >
              <span>{icon}</span>
              {key === "chefs" ? "Head & Home Chefs" : t(key)}
            </button>
          ))}

          <button
            type="button"
            className="menu-item logout-item"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </nav>

        <div className="menu-note">
          <span>made around a table</span>
          <small>FlavorShare · 2026</small>
        </div>
      </aside>
    </>
  );
}

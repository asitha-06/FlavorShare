
import React from "react";
import { useApp } from "../context/AppContext";

const items = [
  ["Home", "⌂", "home"],
  ["Create Post", "＋", "create"],
  ["Premium", "✦", "premium"],
  ["Regions", "◌", "regions"],
  ["Home Chef", "♨", "homeChef"],
  ["Head Chef", "♨", "headChef"],
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
      window.location.reload();
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

      <aside
        className={`side-menu ${open ? "open" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          maxHeight: "100dvh",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div className="menu-heading" style={{ flexShrink: 0 }}>
          <span className="menu-lines">☰</span>
          <strong>{t("menu")}</strong>

          <button
            type="button"
            onClick={onClose}
            className="close-menu"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {items.map(([label, icon, key]) => (
            <button
              type="button"
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
              {key === "homeChef"
                ? "Home Chef"
                : key === "headChef"
                ? "Head Chef"
                : t(key)}
            </button>
          ))}
        </nav>

        <div
          style={{
            flexShrink: 0,
            padding: "10px 12px",
            borderTop: "1px solid rgba(128,128,128,0.2)",
            background: "inherit",
          }}
        >
          <button
            type="button"
            className="menu-item logout-item"
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              minHeight: "44px",
              visibility: "visible",
              opacity: 1,
              cursor: "pointer",
            }}
          >
            <span>↪</span>
            Logout
          </button>

          <div className="menu-note">
            <span>made around a table</span>
            <small>FlavorShare · 2026</small>
          </div>
        </div>
      </aside>
    </>
  );
}

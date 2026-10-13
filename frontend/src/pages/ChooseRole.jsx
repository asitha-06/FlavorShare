
import React, { useState } from "react";
import { supabase } from "../lib_supabase";

const roles = [
  {
    value: "viewer",
    title: "Viewer",
    description: "Discover recipes, like posts and follow chefs."
  },
  {
    value: "homechef",
    title: "Home Chef",
    description: "Share family recipes and regional cooking."
  },
  {
    value: "headchef",
    title: "Head Chef",
    description: "Share professional recipes and chef expertise."
  }
];

export default function ChooseRole({ user, onComplete }) {
  const [role, setRole] = useState("viewer");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function saveRole() {
    if (!user?.id) return;

    setBusy(true);
    setError("");

    const { error } = await supabase
      .from("profiles")
      .upsert(
        { id: user.id, role },
        { onConflict: "id" }
      );

    setBusy(false);

    if (error) {
      setError(error.message);
      return;
    }

    onComplete(role);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="kicker">WELCOME TO FLAVORSHARE</span>
        <h1>Choose your kitchen role</h1>
        <p>You can explore FlavorShare based on your interests.</p>

        {roles.map(item => (
          <label
            key={item.value}
            style={{
              display: "block",
              padding: 16,
              margin: "12px 0",
              border: role === item.value
                ? "2px solid #b85f43"
                : "1px solid #ddd",
              borderRadius: 12,
              cursor: "pointer"
            }}
          >
            <input
              type="radio"
              name="role"
              value={item.value}
              checked={role === item.value}
              onChange={() => setRole(item.value)}
            />
            <strong style={{ marginLeft: 10 }}>
              {item.title}
            </strong>
            <p>{item.description}</p>
          </label>
        ))}

        {error && <p className="form-error">{error}</p>}

        <button
          className="primary-button"
          disabled={busy}
          onClick={saveRole}
        >
          {busy ? "Saving..." : "Continue"}
        </button>
      </section>
    </main>
  );
}

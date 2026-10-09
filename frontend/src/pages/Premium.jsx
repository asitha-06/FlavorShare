import React from "react";
import { useApp } from "../context/AppContext";

export default function Premium() {
  const { premium, setPremium } = useApp();
  return <main className="content-page"><div className="premium-hero"><span className="kicker">PREMIUM</span><h1>Learn, cook,<br/><em>go live.</em></h1><p>Long-form tutorials, live cooking sessions and creator-led kitchen stories.</p><button className="primary-button" onClick={() => setPremium(v => !v)}>{premium ? "Premium active ✓" : "Activate prototype premium"}</button>{premium && <span className="premium-status">Prototype mode — no payment was made.</span>}</div><div className="premium-grid"><article><span>01</span><h2>Cooking tutorials</h2><p>Slow, clear lessons you can cook along with.</p></article><article><span>02</span><h2>Go Live</h2><p>Host a live kitchen session for your community.</p></article><article><span>03</span><h2>Creator notes</h2><p>Behind-the-recipe stories and kitchen tips.</p></article></div></main>;
}

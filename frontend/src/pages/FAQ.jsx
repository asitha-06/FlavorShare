import React, { useState } from "react";

const faqs = [
  ["How do I save a recipe?", "Tap the bowl icon on any recipe card. The recipe will fly into My Bowl."],
  ["Can I create my own recipe?", "Open Create Post from the menu and choose a theme before adding your recipe."],
  ["Can I browse by region?", "Yes. Use Regions to explore Indian, Chinese, Korean, Japanese and Italian recipes."]
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <main className="content-page">
      <div className="page-hero compact"><span className="kicker">FAQ</span><h1>A few things<br/><em>you may wonder.</em></h1></div>
      <div className="faq-list">{faqs.map(([q,a], i) => <article key={q}><button onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><b>{open === i ? "−" : "+"}</b></button>{open === i && <p>{a}</p>}</article>)}</div>
    </main>
  );
}

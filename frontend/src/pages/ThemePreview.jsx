import React from "react";
import { themeMeta } from "../data";
import { useApp } from "../context/AppContext";
export default function ThemePreview({themeName,onBack}){
  const {theme,setTheme,t}=useApp(); const meta=themeMeta[themeName]||themeMeta.Blank;
  const apply=()=>{setTheme(themeName); onBack()};
  return <main className={`theme-preview theme-${themeName.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`} style={{"--theme-image":`url(${meta.image})`}}>
    <div className="theme-preview-top"><button className="back-button" onClick={onBack}>← {t("back")}</button><span className="kicker">FLAVORSHARE · THEME</span></div>
    <section className="theme-preview-card">
      <div className="theme-preview-copy"><span className="kicker">CUSTOM KITCHEN</span><h1>{themeName}</h1><p>{meta.subtitle}</p><div className="theme-preview-actions"><button className="primary-button" onClick={apply}>{t("useTheme")}</button>{theme===themeName&&<span className="theme-current">✓ Current theme</span>}</div></div>
      <div className="theme-preview-art" aria-label={`${themeName} preview`}><div className="theme-art-inner"><span>✦</span><strong>made with<br/>a little love</strong><small>recipes · stories · people</small></div></div>
    </section>
  </main>
}

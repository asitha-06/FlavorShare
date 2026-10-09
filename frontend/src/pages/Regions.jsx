import React,{useState} from "react";
import {regions,recipes} from "../data";
import RecipeCard from "../components/RecipeCard";
import {useApp} from "../context/AppContext";
export default function Regions({onOpenRecipe}){const [region,setRegion]=useState("Indian");const list=recipes.filter(r=>r.region===region);const {t}=useApp();return <main className="content-page"><div className="page-hero compact"><span className="kicker">{t("regions")}</span><h1>{t("regionsTitle")}<br/><em>{t("regionsTitle2")}</em></h1><p>Explore recipes by region and meet the home cooks behind them.</p></div><div className="region-selector region-pills">{regions.map(r=><button key={r} className={r===region?"selected":""} onClick={()=>setRegion(r)}>{r}</button>)}</div><div className="recipe-grid">{(list.length?list:recipes.slice(0,3)).map(r=><RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe}/>)}</div></main>}

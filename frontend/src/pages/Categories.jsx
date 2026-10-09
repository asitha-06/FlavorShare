import React,{useState} from "react";
import {categories,recipes} from "../data";
import RecipeCard from "../components/RecipeCard";
import {useApp} from "../context/AppContext";
export default function Categories({onOpenRecipe}){const [cat,setCat]=useState("Breakfast");const {t}=useApp();const labels={All:t("all"),Breakfast:t("breakfast"),Lunch:t("lunch"),Snack:t("snack"),Dessert:t("dessert"),Salade:t("salade")};const list=recipes.filter(r=>cat==="All"||r.category===cat);return <main className="content-page"><div className="page-hero compact"><span className="kicker">{t("categories")}</span><h1>What's on<br/><em>your plate?</em></h1></div><div className="category-grid">{categories.map(c=><button key={c} className={`category-tile ${cat===c?"active":""}`} onClick={()=>setCat(c)}>{labels[c]}<span>→</span></button>)}</div><div className="recipe-grid">{(list.length?list:recipes).map(r=><RecipeCard key={r.id} recipe={r} onOpen={onOpenRecipe}/>)}</div></main>}

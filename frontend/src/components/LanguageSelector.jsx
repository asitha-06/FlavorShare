import React from "react";
import { useApp } from "../context/AppContext";
export default function LanguageSelector({compact=false}){const {language,setLanguage,t}=useApp();return <div className={compact?"language-selector compact":"language-selector"}>{!compact&&<span>{t("selectLanguage")}</span>}{["English","Telugu","Hindi"].map(item=><button key={item} className={language===item?"selected":""} onClick={()=>setLanguage(item)}>{item}</button>)}</div>}

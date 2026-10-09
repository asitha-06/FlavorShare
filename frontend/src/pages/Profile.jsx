import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import LanguageSelector from "../components/LanguageSelector";

export default function Profile() {
  const { profile, setProfile, posts, t } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const save = (e) => { e.preventDefault(); setProfile(draft); setEditing(false); };
  return <main className="content-page">
    <section className="profile-card">
      <div className="profile-avatar">{profile.initials}</div>
      <span className="kicker">{t("profile")}</span>
      <h1>{profile.name}</h1>
      <p>{profile.bio}</p>
      <div className="profile-actions">
        <button className="secondary-button" onClick={() => { setDraft(profile); setEditing(true); }}>{editing ? t("editing") : t("editProfile")}</button>
        <div className="profile-language"><span>{t("language")}</span><LanguageSelector compact /></div>
      </div>
      <div className="profile-stats"><span><strong>{posts.length}</strong> {t("newRecipes")}</span><span><strong>248</strong> {t("likes")}</span><span><strong>56</strong> {t("followers")}</span></div>
    </section>
    {editing && <form className="edit-profile-card" onSubmit={save}>
      <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value, initials: e.target.value.split(" ").map(x => x[0]).join("").slice(0,2).toUpperCase()})} placeholder={t("name")}/><input value={draft.username} onChange={e => setDraft({...draft, username: e.target.value})} placeholder={t("username")}/><textarea value={draft.bio} onChange={e => setDraft({...draft, bio: e.target.value})} placeholder={t("bio")}/><div className="edit-profile-actions"><button className="primary-button" type="submit">{t("saveChanges")}</button><button className="secondary-button" type="button" onClick={() => setEditing(false)}>{t("cancel")}</button></div>
    </form>}
  </main>;
}

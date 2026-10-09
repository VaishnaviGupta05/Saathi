"use client";

import { useMemo, useState } from "react";
import {
  BookHeart, BookOpen, CalendarDays, Check, ChevronDown, Feather, Flower2,
  Heart, LockKeyhole, MoonStar, Palette, PenLine, Plus, Search, Sparkles,
  Star, Sun, WandSparkles, X
} from "lucide-react";
import { themes, type ThemeId } from "@/lib/themes";

type Mood = "peaceful" | "happy" | "heavy" | "hopeful" | "unsure";
type Entry = { id: string; title: string; body: string; mood: Mood; date: string; theme: ThemeId; favorite: boolean };

const moodCopy: Record<Mood, { label: string; emoji: string; theme: ThemeId; prompt: string }> = {
  peaceful: { label: "Peaceful", emoji: "☁️", theme: "garden", prompt: "What felt soft or good about today?" },
  happy: { label: "Happy", emoji: "🌷", theme: "rosewater", prompt: "What do I want to remember about this feeling?" },
  heavy: { label: "A little heavy", emoji: "🌙", theme: "moonlight", prompt: "What do I need to say without fixing anything?" },
  hopeful: { label: "Hopeful", emoji: "✨", theme: "old-soul", prompt: "What possibility am I quietly excited about?" },
  unsure: { label: "Not sure yet", emoji: "🫧", theme: "paper", prompt: "If I could begin anywhere, what would I write?" }
};

const starterEntries: Entry[] = [
  { id: "1", title: "A small thing worth keeping", body: "The light looked different this afternoon. For a little while, I let myself do nothing but notice it.", mood: "peaceful", date: "OCT 08", theme: "garden", favorite: true },
  { id: "2", title: "Things I am learning", body: "I am allowed to grow slowly. I don't have to turn every feeling into a plan.", mood: "hopeful", date: "OCT 05", theme: "old-soul", favorite: false }
];

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState<"shelf" | "memories" | "studio">("shelf");
  const [themeId, setThemeId] = useState<ThemeId>("paper");
  const [mood, setMood] = useState<Mood>("peaceful");
  const [showMood, setShowMood] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [entries, setEntries] = useState<Entry[]>(starterEntries);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fontMode, setFontMode] = useState<"hand" | "type">("hand");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  const theme = themes.find((item) => item.id === themeId) ?? themes[0];
  const filteredEntries = useMemo(
    () => entries.filter((entry) => `${entry.title} ${entry.body}`.toLowerCase().includes(search.toLowerCase())),
    [entries, search]
  );

  function unlock() {
    // UI prototype only. No password is stored or checked in this demo.
    // Connect a real authentication/key-unwrapping flow before handling private content.
    if (pin.trim().length < 4) {
      setPinError("Use at least 4 characters to preview the private space.");
      return;
    }
    setPinError("");
    setUnlocked(true);
    setNotice("Preview unlocked. This demo does not provide real password security yet.");
  }

  function beginEntry(entry?: Entry) {
    setSelectedEntry(entry ?? null);
    setTitle(entry?.title ?? "");
    setBody(entry?.body ?? "");
    setMood(entry?.mood ?? mood);
    setThemeId(entry?.theme ?? moodCopy[mood].theme);
    setEditorOpen(true);
    setNotice("");
  }

  function saveEntry() {
    if (!title.trim() && !body.trim()) {
      setNotice("Write a little something before saving your page.");
      return;
    }
    const now = new Date();
    const entry: Entry = {
      id: selectedEntry?.id ?? `${now.getTime()}`,
      title: title.trim() || "A page from today",
      body: body.trim(),
      mood,
      date: now.toLocaleDateString("en-US", { month: "short", day: "2-digit" }).toUpperCase(),
      theme: themeId,
      favorite: selectedEntry?.favorite ?? false
    };
    setEntries((current) => selectedEntry
      ? current.map((item) => item.id === selectedEntry.id ? entry : item)
      : [entry, ...current]);
    setEditorOpen(false);
    setNotice("Page saved in this preview session. It will disappear when you refresh.");
  }

  function openMoodSuggestion(nextMood: Mood) {
    setMood(nextMood);
    setThemeId(moodCopy[nextMood].theme);
    setShowMood(false);
    setNotice(`Suggested theme: ${themes.find((item) => item.id === moodCopy[nextMood].theme)?.name}. You can change it any time.`);
  }

  if (!unlocked) {
    return (
      <main className="gate-screen">
        <div className="gate-orb orb-one" /><div className="gate-orb orb-two" />
        <section className="gate-card">
          <div className="brand-mark"><BookHeart size={23} strokeWidth={1.5} /></div>
          <p className="eyebrow">A LITTLE HOME FOR YOUR THOUGHTS</p>
          <h1>Welcome back,<br /><em>dear heart.</em></h1>
          <p className="gate-copy">Your words are waiting in their quiet little corner of the world.</p>
          <label className="field-label" htmlFor="diary-password">Your diary password</label>
          <div className="password-field">
            <LockKeyhole size={17} />
            <input id="diary-password" type="password" value={pin} onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && unlock()} placeholder="Enter any 4+ characters for preview" autoComplete="off" />
          </div>
          {pinError && <p className="error-text">{pinError}</p>}
          <button className="button button-primary gate-button" onClick={unlock}>Open my diary <span>↗</span></button>
          <p className="privacy-note"><LockKeyhole size={13} /> Prototype gate only — not real security yet.</p>
          <div className="gate-flower">✿</div>
        </section>
        <p className="gate-footer">saathi <span>·</span> a softer place to land</p>
      </main>
    );
  }

  return (
    <main className={`app-shell theme-${theme.id}`}>
      <aside className="sidebar">
        <a className="wordmark" href="#" onClick={(e) => { e.preventDefault(); setActiveTab("shelf"); }}><span className="wordmark-icon"><BookHeart size={21} /></span><span>saathi<small>your personal diary</small></span></a>
        <div className="side-label">YOUR LITTLE WORLD</div>
        <nav className="side-nav">
          <button className={activeTab === "shelf" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("shelf")}><BookOpen size={17} /> My diary shelf</button>
          <button className={activeTab === "memories" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("memories")}><CalendarDays size={17} /> Memory garden</button>
          <button className={activeTab === "studio" ? "nav-item active" : "nav-item"} onClick={() => setActiveTab("studio")}><Palette size={17} /> Diary atelier</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><Flower2 size={19} /><p>There is no right way to feel.<br /><em>Just begin where you are.</em></p></div>
          <button className="lock-button" onClick={() => { setUnlocked(false); setPin(""); setEditorOpen(false); }}><LockKeyhole size={15} /> Lock Saathi</button>
          <span className="version-note">A little work in progress · v0.1</span>
        </div>
      </aside>

      <section className="main-panel">
        <header className="topbar">
          <div className="breadcrumb">saathi <span>/</span> {activeTab === "shelf" ? "My diary shelf" : activeTab === "memories" ? "Memory garden" : "Diary atelier"}</div>
          <div className="topbar-right"><span className="private-pill"><span /> Private preview</span><button className="icon-button" aria-label="Toggle night theme" onClick={() => setThemeId(themeId === "moonlight" ? "paper" : "moonlight")}><MoonStar size={18} /></button></div>
        </header>

        {activeTab === "shelf" && <>
          <section className="welcome-row">
            <div><p className="eyebrow">FRIDAY, OCTOBER 9</p><h1>Hello, <em>beautiful soul.</em></h1><p className="welcome-sub">A little space for all the things you don't always say out loud.</p></div>
            <div className="sun-doodle"><Sun size={32} strokeWidth={1.2} /><span>take it<br />slowly</span></div>
          </section>
          <section className="prompt-card">
            <div className="prompt-decoration"><Sparkles size={22} /><span>✳</span></div>
            <div className="prompt-content"><p className="eyebrow">A GENTLE PLACE TO BEGIN</p><h2>{moodCopy[mood].prompt}</h2><p>Some days need words. Some days just need a page.</p></div>
            <div className="prompt-actions"><button className="button button-light" onClick={() => beginEntry()}>Begin writing <PenLine size={15} /></button><button className="text-button" onClick={() => setShowMood(!showMood)}>Change my mood <ChevronDown size={14} /></button></div>
            {showMood && <div className="mood-popover"><p className="eyebrow">HOW ARE YOU ARRIVING?</p>{(Object.keys(moodCopy) as Mood[]).map((key) => <button key={key} onClick={() => openMoodSuggestion(key)} className={mood === key ? "mood-option selected" : "mood-option"}><span>{moodCopy[key].emoji}</span>{moodCopy[key].label}{mood === key && <Check size={14} />}</button>)}</div>}
          </section>
          {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><X size={14} /></button></div>}
          <section className="section-heading"><div><p className="eyebrow">A COLLECTION OF LITTLE WORLDS</p><h2>Your diary shelf <span>✳</span></h2></div><span className="muted-count">{themes.length} styles to explore</span></section>
          <section className="diary-grid">
            {themes.map((item, index) => <button key={item.id} className={`diary-card cover-${item.id}`} onClick={() => { setThemeId(item.id); beginEntry(); }}>
              <div className="cover-art"><span className="cover-stamp">{item.symbol}</span><div className="cover-lines" /><span className="cover-kicker">{item.kicker}</span><span className="cover-title">{item.coverTitle}</span><span className="cover-subtitle">{item.subtitle}</span><span className="cover-flower">{item.flower}</span><span className="cover-number">No. 0{index + 1}</span></div>
              <span className="card-caption"><span><strong>{item.name}</strong><small>{item.description}</small></span><span className="card-arrow">↗</span></span>
            </button>)}
            <button className="create-card" onClick={() => setActiveTab("studio")}><span className="create-icon"><Plus size={21} /></span><strong>Create your own</strong><small>Make a diary that feels like you</small></button>
          </section>
        </>}

        {activeTab === "memories" && <section className="content-view"><p className="eyebrow">A GENTLE LOOK BACK</p><h1>Your <em>memory garden.</em></h1><p className="welcome-sub">Little moments, saved in their own time.</p><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a memory..." /></div><div className="memory-list">{filteredEntries.map((entry) => <button key={entry.id} className="memory-item" onClick={() => beginEntry(entry)}><span className="memory-date">{entry.date}</span><span className="memory-copy"><strong>{entry.title}</strong><small>{entry.body || "A quiet page."}</small></span><span className="memory-mood">{moodCopy[entry.mood].emoji}</span></button>)}{filteredEntries.length === 0 && <p className="empty-state">No pages found just yet. Your next memory might be one sentence away.</p>}</div></section>}

        {activeTab === "studio" && <section className="content-view"><p className="eyebrow">MAKE IT YOURS</p><h1>The diary <em>atelier.</em></h1><p className="welcome-sub">Choose a little world for the words you want to write.</p><div className="theme-picker">{themes.map((item) => <button key={item.id} onClick={() => setThemeId(item.id)} className={themeId === item.id ? "theme-choice chosen" : "theme-choice"}><span className={`theme-swatch swatch-${item.id}`}><span>{item.symbol}</span></span><span><strong>{item.name}</strong><small>{item.description}</small></span>{themeId === item.id && <Check size={16} />}</button>)}</div><div className="studio-tip"><WandSparkles size={18} /><p><strong>Mood-to-Paper</strong><br />Choose a mood on your home shelf and Saathi will suggest a matching theme. The final choice is always yours.</p></div></section>}

        <footer className="page-footer"><span>Made with a little tenderness <Heart size={12} fill="currentColor" /></span><span>Your words belong to you.</span></footer>
      </section>

      {editorOpen && <div className="editor-overlay" role="dialog" aria-modal="true" aria-labelledby="editor-heading">
        <section className={`editor-modal theme-${theme.id}`}>
          <header className="editor-top"><div><p className="eyebrow">A PAGE OF YOUR OWN</p><h2 id="editor-heading">{selectedEntry ? "Return to this memory" : "Dear diary..."}</h2></div><button className="icon-button" onClick={() => setEditorOpen(false)} aria-label="Close editor"><X size={19} /></button></header>
          <div className="editor-toolbar"><div className="font-switch"><button className={fontMode === "hand" ? "selected" : ""} onClick={() => setFontMode("hand")}><Feather size={14} /> Handwritten</button><button className={fontMode === "type" ? "selected" : ""} onClick={() => setFontMode("type")}>Aa Typing</button></div><label className="theme-select-label">Paper <select value={themeId} onChange={(e) => setThemeId(e.target.value as ThemeId)}>{themes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
          <div className={`writing-paper ${fontMode === "hand" ? "handwriting" : "typing"}`}><input className="entry-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give this page a name..." /><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Dear diary,\n\n${moodCopy[mood].prompt}`} rows={10} autoFocus /><div className="paper-bottom"><span>{moodCopy[mood].emoji} {moodCopy[mood].label}</span><span>{body.trim() ? body.trim().split(/\s+/).length : 0} words · just for you</span></div></div>
          <div className="editor-bottom"><button className="text-button" onClick={() => setShowMood(!showMood)}>{moodCopy[mood].emoji} Mood: {moodCopy[mood].label} <ChevronDown size={14} /></button><div><button className="button button-quiet" onClick={() => setEditorOpen(false)}>Close</button><button className="button button-primary" onClick={saveEntry}>Save page <Check size={15} /></button></div></div>
          {showMood && <div className="editor-moods">{(Object.keys(moodCopy) as Mood[]).map((key) => <button key={key} onClick={() => { setMood(key); setShowMood(false); }}>{moodCopy[key].emoji} {moodCopy[key].label}</button>)}</div>}
        </section>
      </div>}
    </main>
  );
}

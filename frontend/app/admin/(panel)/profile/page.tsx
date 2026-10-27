"use client";
import { useEffect, useRef, useState } from "react";
import { usePortfolioData, type PortfolioData } from "@/lib/store";
import { fileToDataUrl } from "@/lib/imageHelper";

const DEFAULT_LINKEDIN_AVATAR =
  "https://media.licdn.com/dms/image/v2/D5603AQG5_zj4hbSbnw/profile-displayphoto-scale_400_400/B56aF3H1p6H0Ag-/0/1792999909826?e=1794441600&v=beta&t=6coUTXkIXtU-SGnUP0Rqua5w_PdeefJWI0nTrI0ibM8";

export default function ProfilePage() {
  const { data, update, ready } = usePortfolioData();
  const [o, setO] = useState<(PortfolioData["owner"] & { avatar?: string }) | null>(null);
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (ready && data.owner) {
      // Find Chapter 5 bg as fallback if owner.avatar is not yet set
      const ch5Bg = data.chapters?.find((c) => c.k === 5)?.bg;
      setO({
        ...data.owner,
        avatar: data.owner.avatar || ch5Bg || DEFAULT_LINKEDIN_AVATAR,
      });
    }
  }, [ready, data.owner, data.chapters]);

  if (!o) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const dataUrl = await fileToDataUrl(file);
      setO((prev) => (prev ? { ...prev, avatar: dataUrl } : prev));
      setToast("Image loaded from file (click Save to persist)");
      setTimeout(() => setToast(""), 2500);
    } catch (err: any) {
      alert(err?.message || "Failed to read image file.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const f = (k: keyof typeof o, label: string) => (
    <div className="fld">
      <label htmlFor={k}>{label}</label>
      <input
        id={k}
        value={o[k] ?? ""}
        onChange={(e) => setO({ ...o, [k]: e.target.value })}
      />
    </div>
  );

  const save = (e: React.FormEvent) => {
    e.preventDefault();

    const currentAvatar = o.avatar || DEFAULT_LINKEDIN_AVATAR;

    // Sync contact cards & Chapter 5 image with the updated owner info
    const updatedChapters = (data.chapters || []).map((ch) => {
      let bg = ch.bg;
      if (ch.k === 5) {
        bg = currentAvatar;
      }

      const rows = (ch.rows || []).map((r) => {
        if (r.h === "Get in touch" || r.h === "Contact") {
          const cards = r.cards.map((card) => {
            if (card.t === "Email" || card.icon === "mail") {
              return { ...card, d: o.email, go: `mailto:${o.email}` };
            }
            if (card.t === "Phone" || card.icon === "phone") {
              return { ...card, d: o.phone, go: `tel:${o.tel || o.phone}` };
            }
            if (card.t === "LinkedIn" || card.icon === "link") {
              return { ...card, go: o.linkedin };
            }
            if (card.t === "GitHub" || card.icon === "file") {
              return { ...card, go: o.github };
            }
            return card;
          });
          return { ...r, cards };
        }
        return r;
      });

      return { ...ch, bg, rows };
    });

    update({ ...data, owner: o, chapters: updatedChapters });
    setToast("Profile & photo saved");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <form className="panel" onSubmit={save}>
      <h2>Profile &amp; Contact</h2>
      <p className="hint">
        Manage your personal information, profile photo, and public contact channels.
      </p>

      {/* Profile Picture & About Me Photo Section */}
      <div
        style={{
          background: "#181818",
          border: "1px solid #282828",
          borderRadius: 8,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            marginBottom: 8,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>About Me / Profile Picture</span>
          <span
            style={{
              fontSize: "0.75rem",
              background: "rgba(0,184,169,0.2)",
              color: "#00b8a9",
              padding: "2px 8px",
              borderRadius: 4,
              border: "1px solid rgba(0,184,169,0.4)",
            }}
          >
            Chapter 5 &amp; Avatars
          </span>
        </h3>
        <p style={{ color: "#888", fontSize: "13px", marginBottom: 16 }}>
          This photo appears in your <b>About me billboard portrait</b>, the{" "}
          <b>chapter switcher avatar</b>, and the <b>home profile screen</b>.
        </p>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* Visual Previews */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #e50914",
                  boxShadow: "0 0 16px rgba(229,9,20,0.35)",
                  background: "#000",
                }}
              >
                <img
                  src={o.avatar || DEFAULT_LINKEDIN_AVATAR}
                  alt="Avatar Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_LINKEDIN_AVATAR;
                  }}
                />
              </div>
              <small style={{ color: "#777", display: "block", marginTop: 6, fontSize: "11px" }}>
                Avatar Circle
              </small>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 130,
                  height: 90,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid #333",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
                  background: "#000",
                }}
              >
                <img
                  src={o.avatar || DEFAULT_LINKEDIN_AVATAR}
                  alt="Hero Card Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_LINKEDIN_AVATAR;
                  }}
                />
              </div>
              <small style={{ color: "#777", display: "block", marginTop: 6, fontSize: "11px" }}>
                Billboard Portrait
              </small>
            </div>
          </div>

          {/* Controls */}
          <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 10 }}>
            <div className="fld" style={{ margin: 0 }}>
              <label htmlFor="avatar">Image URL (LinkedIn, CDN, or Direct Link)</label>
              <input
                id="avatar"
                value={o.avatar ?? ""}
                placeholder="https://... or upload a local file"
                onChange={(e) => setO({ ...o, avatar: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
              <button
                type="button"
                className="abtn ghost sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Processing..." : "📁 Upload from computer"}
              </button>
              <button
                type="button"
                className="abtn ghost sm"
                onClick={() => setO({ ...o, avatar: DEFAULT_LINKEDIN_AVATAR })}
              >
                ↺ Use LinkedIn Photo
              </button>
              {o.avatar && o.avatar !== DEFAULT_LINKEDIN_AVATAR && (
                <button
                  type="button"
                  className="abtn danger sm"
                  onClick={() => setO({ ...o, avatar: "" })}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: "1.1rem", marginBottom: 14, color: "#fff" }}>Basic Information</h3>
      <div className="grid2">
        {f("name", "Name")}
        {f("email", "Email")}
        {f("phone", "Phone")}
        {f("tel", "Phone (tel: link)")}
        {f("linkedin", "LinkedIn URL")}
        {f("github", "GitHub URL")}
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button className="abtn" type="submit">
          Save profile &amp; photo
        </button>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </form>
  );
}

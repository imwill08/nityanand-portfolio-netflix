export const ICONS = {
  dash: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  film: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 15h18M8 5v14M16 5v14"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>',
};

export const NAV: { href: string; label: string; icon: keyof typeof ICONS }[] = [
  { href: "/admin", label: "Dashboard", icon: "dash" },
  { href: "/admin/chapters", label: "Chapters", icon: "film" },
  { href: "/admin/profile", label: "Profile & Contact", icon: "user" },
];

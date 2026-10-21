import AdminLayout from "@/admin/AdminLayout";

export const metadata = { title: "Admin Studio — Nityanand Portfolio", robots: { index: false, follow: false } };

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

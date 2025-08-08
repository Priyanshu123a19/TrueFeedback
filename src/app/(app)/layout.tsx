import type { Metadata } from "next";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Anonymous feedback platform",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>  {/* ✅ FIXED: Only fragment, no HTML/BODY */}
      <Navbar />
      {children}
    </>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AppLayout() {
  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto border-x border-border bg-background/40 backdrop-blur-[2px] w-full">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

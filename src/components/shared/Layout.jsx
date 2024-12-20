import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <main className="bg-gradient">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
}

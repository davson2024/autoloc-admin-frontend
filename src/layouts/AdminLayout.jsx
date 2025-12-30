import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ marginLeft: 250, padding: 30, width: "100%" }}>
        <Navbar />
        {children}
      </main>
    </div>
  );
}

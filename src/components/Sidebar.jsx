import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">🚗 AutoLoc Admin</div>

      <NavLink to="/" className="nav-item">📊 Dashboard</NavLink>
      <NavLink to="/voitures" className="nav-item">🚙 Gestion Voitures</NavLink>
      <NavLink to="/reservations" className="nav-item">📅 Réservations</NavLink>
      <NavLink to="/utilisateurs" className="nav-item">👥 Utilisateurs</NavLink>
    </aside>
  );
}

import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className="stats-grid">
        <StatCard value="0" label="Voitures" icon="🚗" bg="#E3F2FD" color="#2962FF" />
        <StatCard value="0" label="Réservations" icon="📅" bg="#E8F5E9" color="#4CAF50" />
        <StatCard value="0" label="En attente" icon="⏳" bg="#FFF3E0" color="#FF9800" />
        <StatCard value="0 FCFA" label="Revenus" icon="💰" bg="#F3E5F5" color="#9C27B0" />
      </div>

      <h2 style={{ marginTop: 30 }}>Réservations Récentes</h2>
      {/* Table sera branchée plus tard */}
    </AdminLayout>
  );
}

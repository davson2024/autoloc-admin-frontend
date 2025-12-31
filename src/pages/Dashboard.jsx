import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";
import { getReservations, getReservationStats, validerReservation, refuserReservation } from "../api/reservationApi";
import { getVoitures } from "../api/voitureApi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVoitures: 0,
    totalReservations: 0,
    reservationsEnAttente: 0,
    revenus: 0
  });
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au montage
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les stats et les voitures
      const [statsResponse, voituresResponse, reservationsResponse] = await Promise.all([
        getReservationStats(),
        getVoitures(),
        getReservations()
      ]);

      const statsData = statsResponse.data;
      const voitures = voituresResponse.data;
      const allReservations = reservationsResponse.data;

      // Calculer les revenus (somme des montants des réservations validées)
      const revenus = allReservations
        .filter(r => r.statut === 'VALIDÉE')
        .reduce((sum, r) => sum + (r.montantTotal || 0), 0);

      setStats({
        totalVoitures: voitures.length,
        totalReservations: statsData.total,
        reservationsEnAttente: statsData.enAttente,
        revenus: revenus
      });

      // Ne garder que les 5 dernières réservations
      setReservations(allReservations.slice(0, 5));

    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError('Impossible de charger les données. Vérifiez que le backend est démarré.');
      
      // Données de test en cas d'erreur
      setStats({
        totalVoitures: 12,
        totalReservations: 45,
        reservationsEnAttente: 8,
        revenus: 2500000
      });
      
      setReservations([
        {
          id: 1,
          client: "Jean Dupont",
          voiture: "Toyota Corolla",
          dateDebut: "2025-01-15",
          dateFin: "2025-01-20",
          statut: "EN_ATTENTE",
          montantTotal: 75000
        },
        {
          id: 2,
          client: "Marie Martin",
          voiture: "Peugeot 208",
          dateDebut: "2025-01-16",
          dateFin: "2025-01-18",
          statut: "VALIDÉE",
          montantTotal: 50000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async (id) => {
    try {
      await validerReservation(id);
      alert('Réservation validée avec succès !');
      loadDashboardData(); // Recharger
    } catch (err) {
      alert('Erreur lors de la validation');
    }
  };

  const handleRefuser = async (id) => {
    try {
      await refuserReservation(id);
      alert('Réservation refusée avec succès !');
      loadDashboardData(); // Recharger
    } catch (err) {
      alert('Erreur lors du refus');
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <span className="badge badge-warning">En attente</span>;
      case 'VALIDÉE':
        return <span className="badge badge-success">Validée</span>;
      case 'REFUSÉE':
        return <span className="badge badge-danger">Refusée</span>;
      default:
        return <span className="badge badge-info">{statut}</span>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">
          <p>⏳ Chargement du dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Alerte si erreur backend */}
      {error && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffc107',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#856404'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-grid">
        <StatCard 
          value={stats.totalVoitures} 
          label="Voitures" 
          icon="🚗" 
          bg="#E3F2FD" 
          color="#2962FF" 
        />
        <StatCard 
          value={stats.totalReservations} 
          label="Réservations" 
          icon="📅" 
          bg="#E8F5E9" 
          color="#4CAF50" 
        />
        <StatCard 
          value={stats.reservationsEnAttente} 
          label="En attente" 
          icon="⏳" 
          bg="#FFF3E0" 
          color="#FF9800" 
        />
        <StatCard 
          value={`${stats.revenus.toLocaleString()} FCFA`} 
          label="Revenus" 
          icon="💰" 
          bg="#F3E5F5" 
          color="#9C27B0" 
        />
      </div>

      {/* Table des réservations récentes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 Réservations Récentes</h2>
          <button className="btn btn-primary" onClick={loadDashboardData}>
            🔄 Actualiser
          </button>
        </div>

        {reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>Aucune réservation</h3>
            <p>Les réservations apparaîtront ici</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Voiture</th>
                  <th>Date début</th>
                  <th>Date fin</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((resa) => (
                  <tr key={resa.id}>
                    <td>#{resa.id}</td>
                    <td>{resa.utilisateur?.nomComplet || resa.client || 'N/A'}</td>
                    <td>
                      {resa.voiture?.marque && resa.voiture?.modele 
                        ? `${resa.voiture.marque} ${resa.voiture.modele}` 
                        : resa.voiture || 'N/A'}
                    </td>
                    <td>{new Date(resa.dateDebut).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(resa.dateFin).toLocaleDateString('fr-FR')}</td>
                    <td>{(resa.montantTotal || resa.montant || 0).toLocaleString()} FCFA</td>
                    <td>{getStatusBadge(resa.statut)}</td>
                    <td>
                      {resa.statut === 'EN_ATTENTE' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleValider(resa.id)}
                          >
                            ✅
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                            onClick={() => handleRefuser(resa.id)}
                          >
                            ❌
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
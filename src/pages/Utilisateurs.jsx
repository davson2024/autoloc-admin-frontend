import { useState, useEffect } from 'react';
import AdminLayout from "../layouts/AdminLayout";

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [stats, setStats] = useState({ total: 0, actifs: 0, inactifs: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const response = await fetch('http://localhost:8080/utilisateurs');
      
      if (!response.ok) throw new Error('Erreur chargement');
      
      const data = await response.json();
      setUtilisateurs(data);
      
      // Calculer les stats
      setStats({
        total: data.length,
        actifs: data.filter(u => u.actif !== false).length,
        inactifs: data.filter(u => u.actif === false).length
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur de chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleVoirDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleToggleActif = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/utilisateurs/${id}/toggle-actif`, {
        method: 'PUT'
      });
      
      if (!response.ok) throw new Error('Erreur modification');
      
      alert('Statut modifié !');
      chargerDonnees();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;

    try {
      const response = await fetch(`http://localhost:8080/utilisateurs/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur suppression');
      
      alert('Utilisateur supprimé !');
      chargerDonnees();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>👥 Gestion des Utilisateurs</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: 30 }}>
        <div className="stat-card">
          <div><h3>{stats.total}</h3><p>Total</p></div>
          <div className="stat-icon" style={{ background: '#E3F2FD', color: '#2962FF' }}>👥</div>
        </div>
        <div className="stat-card">
          <div><h3>{stats.actifs}</h3><p>Actifs</p></div>
          <div className="stat-icon" style={{ background: '#E8F5E9', color: '#4CAF50' }}>✅</div>
        </div>
        <div className="stat-card">
          <div><h3>{stats.inactifs}</h3><p>Inactifs</p></div>
          <div className="stat-icon" style={{ background: '#FFEBEE', color: '#F44336' }}>❌</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Date Inscription</th>
            <th>Réservations</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nomComplet || `${user.prenom} ${user.nom}`}</td>
              <td>{user.email}</td>
              <td>{user.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : '-'}</td>
              <td>
                <span className="badge" style={{ background: '#3498db', color: 'white' }}>
                  {user.nombreReservations || 0}
                </span>
              </td>
              <td>
                <span className={`badge ${user.actif !== false ? 'badge-success' : 'badge-danger'}`}>
                  {user.actif !== false ? 'Actif' : 'Inactif'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleVoirDetails(user)}
                  style={{ marginRight: 5, padding: '5px 10px', fontSize: 12 }}
                >
                  👁️
                </button>
                <button 
                  className={`btn ${user.actif !== false ? 'badge-warning' : 'badge-success'}`}
                  onClick={() => handleToggleActif(user.id)}
                  style={{ marginRight: 5, padding: '5px 10px', fontSize: 12 }}
                >
                  {user.actif !== false ? '🔒' : '🔓'}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(user.id)}
                  style={{ padding: '5px 10px', fontSize: 12 }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Détails Utilisateur */}
      {showModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 8,
            maxWidth: 600,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>👤 Détails de l'utilisateur</h2>
            
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 15 }}>
                <strong>ID :</strong> {selectedUser.id}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Nom :</strong> {selectedUser.nom}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Prénom :</strong> {selectedUser.prenom}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Email :</strong> {selectedUser.email}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Date d'inscription :</strong> {selectedUser.dateInscription ? new Date(selectedUser.dateInscription).toLocaleDateString('fr-FR') : '-'}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Nombre de réservations :</strong> {selectedUser.nombreReservations || 0}
              </div>
              <div style={{ marginBottom: 15 }}>
                <strong>Statut :</strong> 
                <span className={`badge ${selectedUser.actif !== false ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: 10 }}>
                  {selectedUser.actif !== false ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={handleCloseModal}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
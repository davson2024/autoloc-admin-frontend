import { useState, useEffect } from 'react';
import AdminLayout from "../layouts/AdminLayout";
import { getVoitures, changerDisponibilite } from '../api/voitureApi';

export default function Voitures() {
  const [voitures, setVoitures] = useState([]);
  const [stats, setStats] = useState({ total: 0, disponibles: 0, indisponibles: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVoiture, setSelectedVoiture] = useState(null);
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    prixParJour: '',
    image: '',
    description: '',
    anneeFabrication: '',
    carburant: 'Essence',
    nombrePlaces: '5',
    disponible: true
  });

  useEffect(() => {
    chargerDonnees();
  }, []);

  const chargerDonnees = async () => {
    try {
      const resVoitures = await getVoitures();
      const voituresData = resVoitures.data;
      
      setVoitures(voituresData);
      
      // Calculer les stats
      const disponibles = voituresData.filter(v => v.disponible).length;
      setStats({
        total: voituresData.length,
        disponibles: disponibles,
        indisponibles: voituresData.length - disponibles
      });
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur de chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenModal = (voiture = null) => {
    if (voiture) {
      setEditMode(true);
      setSelectedVoiture(voiture);
      setFormData({
        marque: voiture.marque || '',
        modele: voiture.modele || '',
        prixParJour: voiture.prixParJour || '',
        image: voiture.image || '',
        description: voiture.description || '',
        anneeFabrication: voiture.anneeFabrication || '',
        carburant: voiture.carburant || 'Essence',
        nombrePlaces: voiture.nombrePlaces || '5',
        disponible: voiture.disponible !== false
      });
    } else {
      setEditMode(false);
      setSelectedVoiture(null);
      setFormData({
        marque: '',
        modele: '',
        prixParJour: '',
        image: '',
        description: '',
        anneeFabrication: '',
        carburant: 'Essence',
        nombrePlaces: '5',
        disponible: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedVoiture(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const voitureData = {
        ...formData,
        prixParJour: parseFloat(formData.prixParJour),
        anneeFabrication: formData.anneeFabrication ? parseInt(formData.anneeFabrication) : null,
        nombrePlaces: formData.nombrePlaces ? parseInt(formData.nombrePlaces) : null
      };

      const url = editMode 
        ? `http://localhost:8080/voitures/${selectedVoiture.id}`
        : 'http://localhost:8080/voitures';
      
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voitureData)
      });
      
      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      alert(editMode ? 'Voiture modifiée !' : 'Voiture créée !');
      handleCloseModal();
      chargerDonnees();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleToggleDisponibilite = async (id) => {
    try {
      await changerDisponibilite(id);
      alert('Disponibilité modifiée !');
      chargerDonnees();
    } catch (error) {
      console.error('Erreur disponibilité:', error);
      alert('Erreur lors de la modification');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return;

    try {
      const response = await fetch(`http://localhost:8080/voitures/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      alert('Voiture supprimée !');
      chargerDonnees();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (loading) return <AdminLayout><p>Chargement...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>🚙 Gestion des Voitures</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          ➕ Ajouter une voiture
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: 30 }}>
        <div className="stat-card">
          <div><h3>{stats.total}</h3><p>Total</p></div>
          <div className="stat-icon" style={{ background: '#E3F2FD', color: '#2962FF' }}>🚗</div>
        </div>
        <div className="stat-card">
          <div><h3>{stats.disponibles}</h3><p>Disponibles</p></div>
          <div className="stat-icon" style={{ background: '#E8F5E9', color: '#4CAF50' }}>✅</div>
        </div>
        <div className="stat-card">
          <div><h3>{stats.indisponibles}</h3><p>Indisponibles</p></div>
          <div className="stat-icon" style={{ background: '#FFEBEE', color: '#F44336' }}>❌</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Prix/Jour</th>
            <th>Année</th>
            <th>Carburant</th>
            <th>Places</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voitures.map((voiture) => (
            <tr key={voiture.id}>
              <td>{voiture.id}</td>
              <td>
                {voiture.image ? (
                  <img 
                    src={voiture.image} 
                    alt={`${voiture.marque} ${voiture.modele}`}
                    style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : '📷'}
              </td>
              <td>{voiture.marque}</td>
              <td>{voiture.modele}</td>
              <td>{voiture.prixParJour?.toLocaleString()} FCFA</td>
              <td>{voiture.anneeFabrication || '-'}</td>
              <td>{voiture.carburant || '-'}</td>
              <td>{voiture.nombrePlaces || '-'}</td>
              <td>
                <span className={`badge ${voiture.disponible ? 'badge-success' : 'badge-danger'}`}>
                  {voiture.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-primary" 
                  onClick={() => handleOpenModal(voiture)}
                  style={{ marginRight: 5, padding: '5px 10px', fontSize: 12 }}
                >
                  ✏️
                </button>
                <button 
                  className={`btn ${voiture.disponible ? 'badge-warning' : 'badge-success'}`}
                  onClick={() => handleToggleDisponibilite(voiture.id)}
                  style={{ marginRight: 5, padding: '5px 10px', fontSize: 12 }}
                >
                  {voiture.disponible ? '🔒' : '🔓'}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDelete(voiture.id)}
                  style={{ padding: '5px 10px', fontSize: 12 }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Formulaire */}
      {showModal && (
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
            <h2>{editMode ? '✏️ Modifier la voiture' : '➕ Ajouter une voiture'}</h2>
            
            <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
              <div style={{ display: 'grid', gap: 15 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Marque *</label>
                  <input
                    type="text"
                    name="marque"
                    value={formData.marque}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Modèle *</label>
                  <input
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Prix/Jour (FCFA) *</label>
                  <input
                    type="number"
                    name="prixParJour"
                    value={formData.prixParJour}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>URL Image</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://exemple.com/image.jpg"
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Année</label>
                    <input
                      type="number"
                      name="anneeFabrication"
                      value={formData.anneeFabrication}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Carburant</label>
                    <select
                      name="carburant"
                      value={formData.carburant}
                      onChange={handleInputChange}
                      style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                    >
                      <option value="Essence">Essence</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Électrique">Électrique</option>
                      <option value="Hybride">Hybride</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>Nombre de places</label>
                  <input
                    type="number"
                    name="nombrePlaces"
                    value={formData.nombrePlaces}
                    onChange={handleInputChange}
                    min="2"
                    max="9"
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                    id="disponible"
                  />
                  <label htmlFor="disponible" style={{ fontWeight: 'bold' }}>
                    Disponible à la location
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={handleCloseModal}
                  style={{ background: '#95a5a6', color: 'white' }}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editMode ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
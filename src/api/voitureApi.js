import api from './axios';

export const getVoitures = () => api.get('/voitures');

export const changerDisponibilite = (id) => api.put(`/voitures/${id}/disponibilite`);
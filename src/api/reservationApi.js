import api from './axios';

export const getReservations = () => api.get('/reservations');

export const getReservationStats = () => api.get('/reservations/stats');

export const validerReservation = (id) => api.put(`/reservations/${id}/valider`);

export const refuserReservation = (id) => api.put(`/reservations/${id}/refuser`);
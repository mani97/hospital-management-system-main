import axios from 'axios';

const BASE = 'http://localhost:9098/api';

/** Axios wrappers for the Pharmacy module. */
class PharmacyService {
    // ---- Medicines ----
    getMedicines(search) { return axios.get(`${BASE}/medicines`, { params: search ? { search } : {} }); }
    getMedicine(id) { return axios.get(`${BASE}/medicines/${id}`); }
    addMedicine(m) { return axios.post(`${BASE}/medicines`, m); }
    updateMedicine(id, m) { return axios.put(`${BASE}/medicines/${id}`, m); }
    updateStock(id, quantity, locationId) { return axios.patch(`${BASE}/medicines/${id}/stock`, { quantity, locationId }); }
    deleteMedicine(id) { return axios.delete(`${BASE}/medicines/${id}`); }
    getLowStock(threshold = 10) { return axios.get(`${BASE}/medicines/alerts/low-stock`, { params: { threshold } }); }
    getExpired() { return axios.get(`${BASE}/medicines/alerts/expired`); }
    getExpiring(days = 30) { return axios.get(`${BASE}/medicines/alerts/expiring`, { params: { days } }); }

    // ---- Locations (branches) ----
    getLocations() { return axios.get(`${BASE}/locations`); }
    createLocation(l) { return axios.post(`${BASE}/locations`, l); }
    updateLocation(id, l) { return axios.put(`${BASE}/locations/${id}`, l); }
    deleteLocation(id) { return axios.delete(`${BASE}/locations/${id}`); }
    getLocationStock(id) { return axios.get(`${BASE}/locations/${id}/stock`); }
    getMedicineAvailability(medicineId) { return axios.get(`${BASE}/locations/medicine/${medicineId}/stock`); }
    transferStock(t) { return axios.post(`${BASE}/locations/transfer`, t); }

    // ---- Prescriptions ----
    getPrescriptions(params) { return axios.get(`${BASE}/prescriptions`, { params }); }
    createPrescription(p) { return axios.post(`${BASE}/prescriptions`, p); }

    // ---- Bills ----
    generateBill(b) { return axios.post(`${BASE}/bills`, b); }
    getBills(params) { return axios.get(`${BASE}/bills`, { params }); }
    downloadInvoice(id) { return axios.get(`${BASE}/bills/${id}/invoice`, { responseType: 'blob' }); }
    emailBill(id) { return axios.post(`${BASE}/bills/${id}/email`); }

    // ---- Lookups (existing endpoints) ----
    getPatients() { return axios.get('http://localhost:9098/admin/getAllPatients'); }
    getDoctors() { return axios.get('http://localhost:9098/admin/getAllDoctors'); }
}

/** Extracts a readable message from an axios error (works for network errors too). */
export const errMsg = (e) =>
    e.response?.data?.message || e.message || 'Something went wrong';

export default new PharmacyService();

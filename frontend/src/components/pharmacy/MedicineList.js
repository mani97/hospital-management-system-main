import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

const LOW_STOCK_THRESHOLD = 10;

/**
 * Medicine inventory table with search filter, stock update and delete.
 * Choose a location to see that branch's stock; "All locations" shows totals.
 */
const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    PharmacyService.getLocations().then(r => setLocations(r.data)).catch(() => {});
  }, []);

  const load = useCallback((q, loc) => {
    const req = loc
      // per-location view: each row's quantity is the quantity at that location
      ? PharmacyService.getLocationStock(loc).then(r => {
          const term = (q || '').trim().toLowerCase();
          return r.data
            .map(s => ({ ...s.medicine, quantity: s.quantity }))
            .filter(m => !term || [m.medicineName, m.category, m.manufacturer].some(v => (v || '').toLowerCase().includes(term)));
        })
      : PharmacyService.getMedicines(q).then(r => r.data);
    req.then(data => { setMedicines(data); setError(''); }).catch(e => setError(errMsg(e)));
  }, []);

  // Debounced search-as-you-type
  useEffect(() => {
    const t = setTimeout(() => load(search, locationId), 300);
    return () => clearTimeout(t);
  }, [search, locationId, load]);

  const handleDelete = (m) => {
    if (!window.confirm(`Delete ${m.medicineName} (batch ${m.batchNumber}) from ALL locations?`)) return;
    PharmacyService.deleteMedicine(m.id).then(() => load(search, locationId)).catch(e => alert(errMsg(e)));
  };

  const handleStock = (m) => {
    // with no location selected, stock changes apply to the default Main Pharmacy
    const where = locationId ? locations.find(l => String(l.id) === String(locationId)).name : 'Main Pharmacy';
    const v = window.prompt(`New stock quantity for ${m.medicineName} at ${where}:`, locationId ? m.quantity : '');
    if (v === null) return;
    const qty = parseInt(v, 10);
    if (isNaN(qty) || qty < 0) { alert('Enter a valid non-negative number'); return; }
    PharmacyService.updateStock(m.id, qty, locationId ? Number(locationId) : undefined)
      .then(() => load(search, locationId)).catch(e => alert(errMsg(e)));
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-muted">Medicines</h2>
        <div>
          <Link className="btn btn-outline-secondary me-2" to="/pharmacy">Dashboard</Link>
          <Link className="btn btn-outline-primary me-2" to="/pharmacy/locations">Locations</Link>
          <Link className="btn btn-success" to="/pharmacy/medicines/add">+ Add Medicine</Link>
        </div>
      </div>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <select className="form-select" value={locationId} onChange={e => setLocationId(e.target.value)}>
            <option value="">All locations (total stock)</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name}{l.city ? ` - ${l.city}` : ''}</option>)}
          </select>
        </div>
        <div className="col-md-8">
          <input className="form-control" placeholder="Search by name, category or manufacturer..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr><th>Name</th><th>Category</th><th>Manufacturer</th><th>Batch</th><th>Expiry</th><th>Qty{locationId ? ' (this location)' : ' (total)'}</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {medicines.length === 0 && <tr><td colSpan="8" className="text-center text-muted">No medicines found</td></tr>}
            {medicines.map(m => (
              <tr key={m.id} className={m.expiryDate < today ? 'table-dark' : ''}>
                <td>{m.medicineName}</td>
                <td>{m.category}</td>
                <td>{m.manufacturer}</td>
                <td>{m.batchNumber}</td>
                <td>{m.expiryDate}{m.expiryDate < today && <span className="badge bg-dark ms-1">Expired</span>}</td>
                <td>{m.quantity}{m.quantity < LOW_STOCK_THRESHOLD && <span className="badge bg-danger ms-1">Low</span>}</td>
                <td>₹{Number(m.price).toFixed(2)}</td>
                <td>
                  <Link className="btn btn-sm btn-primary me-1" to={`/pharmacy/medicines/edit/${m.id}`}>Edit</Link>
                  <button className="btn btn-sm btn-info me-1" onClick={() => handleStock(m)}>Stock</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineList;

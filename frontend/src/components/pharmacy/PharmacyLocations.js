import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

const emptyLoc = { name: '', city: '', address: '', active: true };
const LOW = 10;

/** Manage pharmacy branches, view per-location stock and transfer stock between branches. */
const PharmacyLocations = () => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState(emptyLoc);
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [stock, setStock] = useState([]);
  const [transfer, setTransfer] = useState({ toLocationId: '', medicineId: '', quantity: 1 });
  const [error, setError] = useState('');

  const loadLocations = useCallback(() =>
    PharmacyService.getLocations().then(r => setLocations(r.data)).catch(e => setError(errMsg(e))), []);

  const loadStock = useCallback((id) =>
    PharmacyService.getLocationStock(id).then(r => setStock(r.data)).catch(e => setError(errMsg(e))), []);

  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { alert('Location name is required'); return; }
    const req = editId ? PharmacyService.updateLocation(editId, form) : PharmacyService.createLocation(form);
    req.then(() => { setForm(emptyLoc); setEditId(null); loadLocations(); }).catch(err => alert(errMsg(err)));
  };

  const remove = (l) => {
    if (!window.confirm(`Delete location ${l.name}?`)) return;
    PharmacyService.deleteLocation(l.id).then(() => {
      if (selected && selected.id === l.id) { setSelected(null); setStock([]); }
      loadLocations();
    }).catch(err => alert(errMsg(err)));
  };

  const view = (l) => { setSelected(l); setTransfer({ toLocationId: '', medicineId: '', quantity: 1 }); loadStock(l.id); };

  const doTransfer = (e) => {
    e.preventDefault();
    if (!transfer.toLocationId || !transfer.medicineId || Number(transfer.quantity) < 1) {
      alert('Choose destination, medicine and quantity >= 1'); return;
    }
    PharmacyService.transferStock({
      fromLocationId: selected.id, toLocationId: Number(transfer.toLocationId),
      medicineId: Number(transfer.medicineId), quantity: Number(transfer.quantity)
    }).then(() => { alert('Stock transferred'); loadStock(selected.id); })
      .catch(err => alert(errMsg(err)));
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-3">
        <h2 className="text-muted">Pharmacy Locations</h2>
        <Link className="btn btn-outline-secondary" to="/pharmacy">Dashboard</Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card card-body mb-4" onSubmit={save}>
        <h6>{editId ? 'Edit location' : 'Add location'}</h6>
        <div className="row g-2">
          <div className="col-md-3"><input className="form-control" placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="col-md-2"><input className="form-control" placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
          <div className="col-md-4"><input className="form-control" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="col-md-1 d-flex align-items-center">
            <div className="form-check"><input id="act" type="checkbox" className="form-check-input" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /><label htmlFor="act" className="form-check-label">Active</label></div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-success me-1">{editId ? 'Update' : 'Add'}</button>
            {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(emptyLoc); }}>Cancel</button>}
          </div>
        </div>
      </form>

      <table className="table table-bordered align-middle">
        <thead className="table-light"><tr><th>Name</th><th>City</th><th>Address</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {locations.map(l => (
            <tr key={l.id} className={selected && selected.id === l.id ? 'table-primary' : ''}>
              <td>{l.name}</td><td>{l.city}</td><td>{l.address}</td>
              <td><span className={`badge bg-${l.active ? 'success' : 'secondary'}`}>{l.active ? 'Active' : 'Inactive'}</span></td>
              <td>
                <button className="btn btn-sm btn-info me-1" onClick={() => view(l)}>View stock</button>
                <button className="btn btn-sm btn-primary me-1" onClick={() => { setEditId(l.id); setForm({ name: l.name, city: l.city || '', address: l.address || '', active: l.active }); }}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => remove(l)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="card mt-4">
          <div className="card-header">Stock at <b>{selected.name}</b></div>
          <div className="card-body">
            <table className="table table-sm">
              <thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Qty</th></tr></thead>
              <tbody>
                {stock.length === 0 && <tr><td colSpan="4" className="text-muted text-center">No stock at this location</td></tr>}
                {stock.map(s => (
                  <tr key={s.id}>
                    <td>{s.medicine.medicineName}</td><td>{s.medicine.batchNumber}</td><td>{s.medicine.expiryDate}</td>
                    <td>{s.quantity}{s.quantity < LOW && <span className="badge bg-danger ms-1">Low</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h6 className="mt-3">Transfer stock out of {selected.name}</h6>
            <form className="row g-2" onSubmit={doTransfer}>
              <div className="col-md-3">
                <select className="form-select" value={transfer.medicineId} onChange={e => setTransfer({ ...transfer, medicineId: e.target.value })}>
                  <option value="">Medicine</option>
                  {stock.filter(s => s.quantity > 0).map(s => <option key={s.id} value={s.medicine.id}>{s.medicine.medicineName} ({s.quantity})</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" value={transfer.toLocationId} onChange={e => setTransfer({ ...transfer, toLocationId: e.target.value })}>
                  <option value="">Destination</option>
                  {locations.filter(l => l.id !== selected.id && l.active).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div className="col-md-2"><input type="number" min="1" className="form-control" value={transfer.quantity} onChange={e => setTransfer({ ...transfer, quantity: e.target.value })} /></div>
              <div className="col-md-2"><button className="btn btn-warning">Transfer</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyLocations;

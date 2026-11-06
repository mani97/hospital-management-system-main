import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

/** Pharmacy landing page: navigation + low-stock / expiry alert panels. */
const PharmacyDashboard = () => {
  const [lowStock, setLowStock] = useState([]);
  const [expired, setExpired] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([PharmacyService.getLowStock(10), PharmacyService.getExpired(), PharmacyService.getExpiring(30)])
      .then(([l, e, x]) => { setLowStock(l.data); setExpired(e.data); setExpiring(x.data); })
      .catch(e => setError(errMsg(e)));
  }, []);

  const panel = (title, color, rows, extra) => (
    <div className="col-md-4 mb-3">
      <div className={`card border-${color}`}>
        <div className={`card-header bg-${color} text-white`}>{title} ({rows.length})</div>
        <ul className="list-group list-group-flush">
          {rows.length === 0 && <li className="list-group-item text-muted">Nothing to report</li>}
          {rows.map(m => <li key={m.id} className="list-group-item">{m.medicineName} <small className="text-muted">({extra(m)})</small></li>)}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-muted mb-0">Pharmacy Management</h2>
        <Link className="btn btn-outline-secondary" to="/adminDashboard">
          <i className="fas fa-arrow-left me-1"></i> Admin Dashboard
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <Link className="btn btn-primary me-2" to="/pharmacy/medicines">Medicines</Link>
        <Link className="btn btn-success me-2" to="/pharmacy/medicines/add">Add Medicine</Link>
        <Link className="btn btn-info me-2" to="/pharmacy/prescriptions">Prescriptions</Link>
        <Link className="btn btn-warning me-2" to="/pharmacy/billing">Billing</Link>
        <Link className="btn btn-dark" to="/pharmacy/locations">Locations</Link>
      </div>
      <div className="row">
        {panel('Low Stock', 'danger', lowStock, m => `qty ${m.quantity}`)}
        {panel('Expiring in 30 days', 'warning', expiring, m => `exp ${m.expiryDate}`)}
        {panel('Expired', 'dark', expired, m => `exp ${m.expiryDate}`)}
      </div>
    </div>
  );
};

export default PharmacyDashboard;


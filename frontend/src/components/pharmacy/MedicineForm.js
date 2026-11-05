import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PharmacyService from '../../service/PharmacyService';

const empty = { medicineName: '', category: '', manufacturer: '', batchNumber: '', expiryDate: '', quantity: '', price: '', locationId: '' };

/**
 * Shared add/edit form with client-side validation (mirrors backend rules).
 * Add: quantity is the initial stock at the chosen location.
 * Edit: stock is managed per location (Medicines > Stock, or Locations > Transfer).
 */
const MedicineForm = ({ initial, title, onSubmit, isEdit }) => {
  const [form, setForm] = useState({ ...empty, ...initial });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (isEdit) return;
    PharmacyService.getLocations().then(r => {
      const active = r.data.filter(l => l.active);
      setLocations(active);
      const main = active.find(l => l.name === 'Main Pharmacy') || active[0];
      if (main) setForm(f => (f.locationId ? f : { ...f, locationId: String(main.id) }));
    }).catch(() => {});
  }, [isEdit]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    ['medicineName', 'category', 'manufacturer', 'batchNumber'].forEach(k => {
      if (!String(form[k]).trim()) e[k] = 'Required';
    });
    if (!form.expiryDate) e.expiryDate = 'Required';
    else if (form.expiryDate < new Date().toISOString().slice(0, 10)) e.expiryDate = 'Must not be in the past';
    if (form.quantity === '' || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity))) e.quantity = 'Enter a whole number >= 0';
    if (form.price === '' || Number(form.price) <= 0) e.price = 'Must be greater than 0';
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    Promise.resolve(onSubmit({
      ...form, quantity: Number(form.quantity), price: Number(form.price),
      locationId: form.locationId ? Number(form.locationId) : null
    })).finally(() => setSubmitting(false));
  };

  const field = (name, label, type = 'text', extra = {}) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input name={name} type={type} className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
        value={form[name]} onChange={change} {...extra} />
      {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="container my-4" style={{ maxWidth: 800 }}>
      <h2 className="text-muted mb-3">{title}</h2>
      <form onSubmit={submit} noValidate>
        <div className="row">
          {field('medicineName', 'Medicine Name')}
          {field('category', 'Category')}
          {field('manufacturer', 'Manufacturer')}
          {field('batchNumber', 'Batch Number')}
          {field('expiryDate', 'Expiry Date', 'date')}
          {field('quantity', isEdit ? 'Total quantity (manage via Stock / Transfer)' : 'Initial stock quantity', 'number', { min: 0, disabled: !!isEdit })}
          {!isEdit && (
            <div className="col-md-6 mb-3">
              <label className="form-label">Stock location</label>
              <select name="locationId" className="form-select" value={form.locationId} onChange={change}>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}{l.city ? ` - ${l.city}` : ''}</option>)}
              </select>
            </div>
          )}
          {field('price', 'Price (₹)', 'number', { min: 0, step: '0.01' })}
        </div>
        <button className="btn btn-success me-2" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
        <Link className="btn btn-secondary" to="/pharmacy/medicines">Cancel</Link>
      </form>
    </div>
  );
};

export default MedicineForm;


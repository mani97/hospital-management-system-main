import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

const blankItem = { medicineId: '', quantity: 1, dosage: '', durationDays: '' };

/**
 * Prescription page. Doctors create prescriptions linked to a patient;
 * pharmacists view the list (filter by status) and jump to billing.
 */
const PrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [status, setStatus] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ doctorId: '', patientId: '', notes: '', items: [{ ...blankItem }] });
  const [error, setError] = useState('');

  const loadList = () =>
    PharmacyService.getPrescriptions(status ? { status } : {})
      .then(r => setPrescriptions(r.data)).catch(e => setError(errMsg(e)));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadList(); }, [status]);

  useEffect(() => {
    PharmacyService.getDoctors().then(r => setDoctors(r.data)).catch(() => {});
    PharmacyService.getPatients().then(r => setPatients(r.data)).catch(() => {});
    PharmacyService.getMedicines().then(r => setMedicines(r.data)).catch(() => {});
  }, []);

  const setItem = (i, k, v) => {
    const items = form.items.map((it, idx) => idx === i ? { ...it, [k]: v } : it);
    setForm({ ...form, items });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.patientId) { alert('Select doctor and patient'); return; }
    if (form.items.some(i => !i.medicineId || !i.dosage.trim() || Number(i.quantity) < 1)) {
      alert('Each medicine needs a selection, quantity >= 1 and dosage'); return;
    }
    const payload = {
      doctorId: Number(form.doctorId), patientId: Number(form.patientId), notes: form.notes,
      items: form.items.map(i => ({
        medicineId: Number(i.medicineId), quantity: Number(i.quantity), dosage: i.dosage,
        durationDays: i.durationDays ? Number(i.durationDays) : null
      }))
    };
    PharmacyService.createPrescription(payload).then(() => {
      alert('Prescription created');
      setShowForm(false);
      setForm({ doctorId: '', patientId: '', notes: '', items: [{ ...blankItem }] });
      loadList();
    }).catch(err => alert(errMsg(err)));
  };

  const name = (u) => (u ? `${u.firstName} ${u.lastName}` : '-');

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-muted">Prescriptions</h2>
        <div>
          <Link className="btn btn-outline-secondary me-2" to="/pharmacy">Dashboard</Link>
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>{showForm ? 'Close' : '+ New Prescription'}</button>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      {showForm && (
        <form className="card card-body mb-4" onSubmit={submit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Doctor</label>
              <select className="form-select" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                <option value="">Select doctor</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{name(d)} - {d.specialization}</option>)}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Patient</label>
              <select className="form-select" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
                <option value="">Select patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{name(p)}</option>)}
              </select>
            </div>
          </div>
          <h6>Medicines</h6>
          {form.items.map((it, i) => (
            <div className="row mb-2" key={i}>
              <div className="col-md-4">
                <select className="form-select" value={it.medicineId} onChange={e => setItem(i, 'medicineId', e.target.value)}>
                  <option value="">Select medicine</option>
                  {medicines.map(m => <option key={m.id} value={m.id}>{m.medicineName} (stock {m.quantity})</option>)}
                </select>
              </div>
              <div className="col-md-1"><input type="number" min="1" className="form-control" value={it.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} /></div>
              <div className="col-md-4"><input className="form-control" placeholder="Dosage e.g. 1-0-1 after food" value={it.dosage} onChange={e => setItem(i, 'dosage', e.target.value)} /></div>
              <div className="col-md-2"><input type="number" min="1" className="form-control" placeholder="Days" value={it.durationDays} onChange={e => setItem(i, 'durationDays', e.target.value)} /></div>
              <div className="col-md-1">
                <button type="button" className="btn btn-outline-danger" disabled={form.items.length === 1}
                  onClick={() => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })}>×</button>
              </div>
            </div>
          ))}
          <div className="mb-3">
            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setForm({ ...form, items: [...form.items, { ...blankItem }] })}>+ Add medicine</button>
          </div>
          <textarea className="form-control mb-3" rows="2" maxLength="500" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div><button className="btn btn-primary">Save Prescription</button></div>
        </form>
      )}

      <select className="form-select mb-3" style={{ maxWidth: 220 }} value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="DISPENSED">Dispensed</option>
      </select>

      <table className="table table-bordered align-middle">
        <thead className="table-light"><tr><th>#</th><th>Date</th><th>Patient</th><th>Doctor</th><th>Medicines</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {prescriptions.length === 0 && <tr><td colSpan="7" className="text-center text-muted">No prescriptions</td></tr>}
          {prescriptions.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.prescriptionDate}</td>
              <td>{name(p.patient)}</td>
              <td>{name(p.doctor)}</td>
              <td>{p.items.map(i => <div key={i.id}>{i.medicine.medicineName} × {i.quantity} <small className="text-muted">({i.dosage})</small></div>)}</td>
              <td><span className={`badge bg-${p.status === 'PENDING' ? 'warning' : 'success'}`}>{p.status}</span></td>
              <td>{p.status === 'PENDING' && <Link className="btn btn-sm btn-warning" to={`/pharmacy/billing?prescriptionId=${p.id}&patientId=${p.patient.id}`}>Bill</Link>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionPage;

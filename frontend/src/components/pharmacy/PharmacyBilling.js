import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

/**
 * Pharmacy billing. Bill either a pending prescription (?prescriptionId=&patientId=)
 * or an over-the-counter sale. Shows live subtotal / tax / total, then lets the
 * user download the PDF invoice or email it.
 */
const PharmacyBilling = () => {
  const params = new URLSearchParams(useLocation().search);
  const prescriptionId = params.get('prescriptionId');

  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [patientId, setPatientId] = useState(params.get('patientId') || '');
  const [items, setItems] = useState([{ medicineId: '', quantity: 1 }]);
  const [rxItems, setRxItems] = useState([]);
  const [taxPercent, setTaxPercent] = useState(12);
  const [paymentMode, setPaymentMode] = useState('CASH');
  const [emailBill, setEmailBill] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [bill, setBill] = useState(null);
  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState('');
  const [stockById, setStockById] = useState({}); // medicineId -> qty at selected location

  useEffect(() => {
    PharmacyService.getPatients().then(r => setPatients(r.data)).catch(() => {});
    PharmacyService.getMedicines().then(r => setMedicines(r.data)).catch(() => {});
    PharmacyService.getLocations().then(r => {
      const active = r.data.filter(l => l.active);
      setLocations(active);
      const main = active.find(l => l.name === 'Main Pharmacy') || active[0];
      if (main) setLocationId(String(main.id));
    }).catch(() => {});
  }, []);

  // Load stock of the selected branch so the user sees what can actually be sold
  useEffect(() => {
    if (!locationId) return;
    PharmacyService.getLocationStock(locationId)
      .then(r => setStockById(Object.fromEntries(r.data.map(s => [String(s.medicine.id), s.quantity]))))
      .catch(() => setStockById({}));
  }, [locationId]);

  // When billing a prescription, load its items for preview
  useEffect(() => {
    if (!prescriptionId) return;
    PharmacyService.getPrescriptions({ patientId: params.get('patientId') })
      .then(r => {
        const p = r.data.find(x => String(x.id) === prescriptionId);
        if (p) setRxItems(p.items.map(i => ({ medicineId: i.medicine.id, quantity: i.quantity })));
      }).catch(e => alert(errMsg(e)));
    // eslint-disable-next-line
  }, [prescriptionId]);

  const lines = prescriptionId ? rxItems : items;
  const medById = useMemo(() => Object.fromEntries(medicines.map(m => [String(m.id), m])), [medicines]);

  const subtotal = lines.reduce((s, l) => {
    const m = medById[String(l.medicineId)];
    return s + (m ? Number(m.price) * Number(l.quantity || 0) : 0);
  }, 0);
  const tax = subtotal * Number(taxPercent || 0) / 100;
  const total = subtotal + tax;

  const setItem = (i, k, v) => setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const generate = () => {
    if (!patientId) { alert('Select a patient'); return; }
    if (Number(taxPercent) < 0 || Number(taxPercent) > 100) { alert('Tax must be 0-100'); return; }
    const payload = {
      patientId: Number(patientId), taxPercent: Number(taxPercent), paymentMode,
      locationId: locationId ? Number(locationId) : null,
      emailBill, whatsappConfirmation: whatsapp
    };
    if (prescriptionId) payload.prescriptionId = Number(prescriptionId);
    else {
      if (items.some(i => !i.medicineId || Number(i.quantity) < 1)) { alert('Complete all medicine rows'); return; }
      payload.items = items.map(i => ({ medicineId: Number(i.medicineId), quantity: Number(i.quantity) }));
    }
    PharmacyService.generateBill(payload).then(r => setBill(r.data)).catch(e => alert(errMsg(e)));
  };

  const download = () =>
    PharmacyService.downloadInvoice(bill.id).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `invoice-${bill.id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    }).catch(e => alert(errMsg(e)));

  const email = () => PharmacyService.emailBill(bill.id).then(() => alert('Invoice emailed')).catch(e => alert(errMsg(e)));

  if (bill) {
    return (
      <div className="container my-4" style={{ maxWidth: 700 }}>
        <div className="card">
          <div className="card-header bg-success text-white">Invoice INV-{String(bill.id).padStart(6, '0')}</div>
          <div className="card-body">
            <p><b>Patient:</b> {bill.patient.firstName} {bill.patient.lastName}</p>
            {bill.location && <p><b>Pharmacy:</b> {bill.location.name}</p>}
            <table className="table table-sm">
              <thead><tr><th>Medicine</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>{bill.billItems.map(i => (
                <tr key={i.id}><td>{i.medicine.medicineName}</td><td>{i.quantity}</td><td>₹{i.unitPrice}</td><td>₹{i.lineTotal}</td></tr>
              ))}</tbody>
            </table>
            <p className="mb-1">Subtotal: ₹{bill.subtotal}</p>
            <p className="mb-1">Tax ({bill.taxPercent}%): ₹{bill.taxAmount}</p>
            <h5>Total: ₹{bill.totalAmount}</h5>
            <button className="btn btn-primary me-2" onClick={download}>Download PDF</button>
            <button className="btn btn-info me-2" onClick={email}>Email Invoice</button>
            <Link className="btn btn-secondary" to="/pharmacy">Done</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between mb-3">
        <h2 className="text-muted">Pharmacy Billing</h2>
        <Link className="btn btn-outline-secondary" to="/pharmacy">Dashboard</Link>
      </div>
      {prescriptionId && <div className="alert alert-info">Billing prescription #{prescriptionId}</div>}

      <label className="form-label">Pharmacy location (stock is deducted from here)</label>
      <select className="form-select mb-3" value={locationId} onChange={e => setLocationId(e.target.value)}>
        {locations.map(l => <option key={l.id} value={l.id}>{l.name}{l.city ? ` - ${l.city}` : ''}</option>)}
      </select>

      <label className="form-label">Patient</label>
      <select className="form-select mb-3" value={patientId} disabled={!!prescriptionId} onChange={e => setPatientId(e.target.value)}>
        <option value="">Select patient</option>
        {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
      </select>

      {prescriptionId ? (
        <table className="table table-sm">
          <thead><tr><th>Medicine</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>{rxItems.map((l, i) => {
            const m = medById[String(l.medicineId)];
            return <tr key={i}><td>{m ? m.medicineName : l.medicineId}</td><td>{l.quantity}</td><td>₹{m ? m.price : '-'}</td></tr>;
          })}</tbody>
        </table>
      ) : (
        <>
          {items.map((it, i) => (
            <div className="row mb-2" key={i}>
              <div className="col-8">
                <select className="form-select" value={it.medicineId} onChange={e => setItem(i, 'medicineId', e.target.value)}>
                  <option value="">Select medicine</option>
                  {medicines.map(m => <option key={m.id} value={m.id}>{m.medicineName} - ₹{m.price} (stock here: {stockById[String(m.id)] || 0})</option>)}
                </select>
              </div>
              <div className="col-3"><input type="number" min="1" className="form-control" value={it.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} /></div>
              <div className="col-1"><button className="btn btn-outline-danger" disabled={items.length === 1} onClick={() => setItems(items.filter((_, idx) => idx !== i))}>×</button></div>
            </div>
          ))}
          <button className="btn btn-sm btn-outline-primary mb-3" onClick={() => setItems([...items, { medicineId: '', quantity: 1 }])}>+ Add medicine</button>
        </>
      )}

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Tax % (GST)</label>
          <input type="number" min="0" max="100" step="0.5" className="form-control" value={taxPercent} onChange={e => setTaxPercent(e.target.value)} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Payment mode</label>
          <select className="form-select" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
            <option>CASH</option><option>CARD</option><option>UPI</option>
          </select>
        </div>
      </div>
      <div className="form-check"><input id="em" type="checkbox" className="form-check-input" checked={emailBill} onChange={e => setEmailBill(e.target.checked)} /><label htmlFor="em" className="form-check-label">Email bill to patient</label></div>
      <div className="form-check mb-3"><input id="wa" type="checkbox" className="form-check-input" checked={whatsapp} onChange={e => setWhatsapp(e.target.checked)} /><label htmlFor="wa" className="form-check-label">Send WhatsApp confirmation</label></div>

      <div className="card card-body mb-3">
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        <div>Tax: ₹{tax.toFixed(2)}</div>
        <h5 className="mb-0">Total: ₹{total.toFixed(2)}</h5>
      </div>
      <button className="btn btn-success" onClick={generate}>Generate Bill</button>
    </div>
  );
};

export default PharmacyBilling;


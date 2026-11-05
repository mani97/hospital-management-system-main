import React, { useEffect, useState } from 'react';
import MedicineForm from './MedicineForm';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

const EditMedicine = ({ match, history }) => {
  const id = match.params.id;
  const [medicine, setMedicine] = useState(null);

  useEffect(() => {
    PharmacyService.getMedicine(id).then(r => setMedicine(r.data))
      .catch(e => { alert(errMsg(e)); history.push('/pharmacy/medicines'); });
  }, [id, history]);

  const save = (data) =>
    PharmacyService.updateMedicine(id, data)
      .then(() => { alert('Medicine updated'); history.push('/pharmacy/medicines'); })
      .catch(e => alert(errMsg(e)));

  if (!medicine) return <div className="container my-4">Loading...</div>;
  return <MedicineForm title="Edit Medicine" initial={medicine} onSubmit={save} isEdit />;
};

export default EditMedicine;


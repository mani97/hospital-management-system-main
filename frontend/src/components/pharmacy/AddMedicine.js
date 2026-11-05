import React from 'react';
import MedicineForm from './MedicineForm';
import PharmacyService, { errMsg } from '../../service/PharmacyService';

const AddMedicine = ({ history }) => {
  const save = (data) =>
    PharmacyService.addMedicine(data)
      .then(() => { alert('Medicine added'); history.push('/pharmacy/medicines'); })
      .catch(e => alert(errMsg(e)));
  return <MedicineForm title="Add Medicine" onSubmit={save} />;
};

export default AddMedicine;


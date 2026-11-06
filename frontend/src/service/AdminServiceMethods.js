import axios from 'axios';

const ADMIN_API_BASE_URL = 'http://localhost:9098/admin';

class AdminServiceMethods {
   
    logoutAdmin() {
        sessionStorage.removeItem("admin");
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('storage'));
    }

    addNewDoctor(doctor){
        console.log(doctor);
        return axios.post(ADMIN_API_BASE_URL + '/doctorSignUp',doctor);
        
    }

    fetchAllDoctors(){
        return axios.get(ADMIN_API_BASE_URL + '/getAllDoctors');
    }

    deleteDoctor(doctorId){
        return axios.delete(ADMIN_API_BASE_URL + '/removeDoctor/' + doctorId);
    }

    fetchAllPatients(){
        return axios.get(ADMIN_API_BASE_URL + '/getAllPatients');
    }

    deletePatient(patientId){
        return axios.delete(ADMIN_API_BASE_URL + '/removePatient/' + patientId);
    }

    saveDonor(donor){
        return axios.post(ADMIN_API_BASE_URL + '/bloodDonor',donor);
    }

    fetchAllBloodDonors(){
       return axios.get(ADMIN_API_BASE_URL + '/searchDonors');
    }
}

export default new AdminServiceMethods();
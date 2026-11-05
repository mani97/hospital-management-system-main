// import React, { Component } from 'react';
// import AdminServiceMethods from '../service/AdminServiceMethods';

// class DoctorListForAdmin extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             doctors: [],
//             message: null
//         }

//         this.reloadDoctorList = this.reloadDoctorList.bind(this);
//         this.deleteDoctor = this.deleteDoctor.bind(this);
//     }

//     componentDidMount() {
//         this.reloadDoctorList();
//     }

//     reloadDoctorList() {
//         AdminServiceMethods.fetchAllDoctors()
//             .then((resp) => {
//                 this.setState({
//                     doctors: resp.data,
//                     message: "Doctor list rendered successfully"
//                 })
//                 console.log(this.state.message);
//             });
//     }

//     deleteDoctor = doctorId => {
//         if(window.confirm("Are you sure you want to delete this doctor?")){
//             AdminServiceMethods.deleteDoctor(doctorId)
//                 .then(res => {
//                     this.setState({ message: 'Doctor deleted successfully.' });
//                     console.log(this.state.message, 'Doctor ID: ', doctorId);
//                     this.setState({ doctors: this.state.doctors.filter(doctor => doctor.id !== doctorId) });
//                 })
//         }else
//             this.props.history.push('#');
//     }

//     render() {
//         return (
//             <>
//                 <div className="container my-4">
//                     <button className="btn btn-secondary offset-11" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
//                     {this.state.doctors.length === 0 ? <h3>No doctors in database</h3> :
//                         <div>
//                             <h3>Doctor List</h3>
//                             <table className="table table-bordered">
//                                 <thead className="bg-dark text-light">
//                                     <tr>
//                                         <th className="visually-hidden">Id</th>
//                                         <th>Name</th>
//                                         <th>Qualification</th>
//                                         <th>Specialization</th>
//                                         <th>City</th>
//                                         <th>Consultation Fee</th>
//                                         <th>Email</th>
//                                         <th>Mobile Number</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {
//                                         this.state.doctors.map(
//                                             doctor =>
//                                                 <tr key={doctor.id}>
//                                                     <td className="visually-hidden">{doctor.id}</td>
//                                                     <td>{`${doctor.firstName + ' ' + doctor.lastName}`}</td>
//                                                     <td>{doctor.qualification}</td>
//                                                     <td>{doctor.specialization}</td>
//                                                     <td>{doctor.city}</td>
//                                                     <td>{doctor.fees}</td>
//                                                     <td>{doctor.email}</td>
//                                                     <td>{doctor.mobileNumber}</td>
//                                                     <td>
//                                                         <button className="btn btn-danger" onClick={() => { this.deleteDoctor(doctor.id) }}> Delete</button>
//                                                     </td>
//                                                 </tr>
//                                         )
//                                     }
//                                 </tbody>
//                             </table>
//                         </div>}
//                 </div>
//             </>
//         )
//     }
// }

// export default DoctorListForAdmin

import React, { Component } from 'react';
import AdminServiceMethods from '../service/AdminServiceMethods';
import Swal from 'sweetalert2';
class DoctorListForAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            doctors: [],
            message: null,
            currentPage: 1,
            doctorsPerPage: 5
        };

        this.reloadDoctorList = this.reloadDoctorList.bind(this);
        this.deleteDoctor = this.deleteDoctor.bind(this);
    }

    componentDidMount() {
        this.reloadDoctorList();
    }

    reloadDoctorList() {
        AdminServiceMethods.fetchAllDoctors()
            .then((resp) => {
                this.setState({
                    doctors: resp.data,
                    message: "Doctor list rendered successfully"
                });
                console.log(this.state.message);
            });
    }

    deleteDoctor = (doctorId) => {
        Swal.fire({
            title: 'Confirm Deletion',
            text: 'Are you sure you want to delete this doctor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                AdminServiceMethods.deleteDoctor(doctorId)
                    .then(() => {
                        this.setState({
                            message: 'Doctor deleted successfully.'
                        });
                        console.log(this.state.message, 'Doctor ID: ', doctorId);
                        this.setState({
                            doctors: this.state.doctors.filter(doctor => doctor.id !== doctorId)
                        });
    
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Doctor has been deleted successfully.'
                        });
                    })
                    .catch((error) => {
                        console.error('Error deleting doctor: ', error.response.data);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'An error occurred while deleting the doctor.'
                        });
                    });
            }
        });
    };
    

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };
    
    render() {
        const { doctors, currentPage, doctorsPerPage } = this.state;

        const indexOfLastDoctor = currentPage * doctorsPerPage;
        const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
        const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

        const totalPages = Math.ceil(doctors.length / doctorsPerPage);
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <>
        <div className="container my-4">
            <button className="btn btn-secondary offset-11" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
            {doctors.length === 0 ? <h3>No doctors in the database</h3> :
                <div>
                    <h3>Doctor List</h3>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-light">
                            <tr>
                                <th className="visually-hidden">Id</th>
                                <th>Name</th>
                                <th>Qualification</th>
                                <th>Specialization</th>
                                <th>City</th>
                                <th>Consultation Fee</th>
                                <th>Email</th>
                                <th>Mobile Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentDoctors.map(doctor =>
                                <tr key={doctor.id}>
                                    <td className="visually-hidden">{doctor.id}</td>
                                    <td>{`${doctor.firstName} ${doctor.lastName}`}</td>
                                    <td>{doctor.qualification}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.city}</td>
                                    <td>{doctor.fees}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.mobileNumber}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => { this.deleteDoctor(doctor.id) }}> Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination justify-content-center">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => this.handlePageChange(currentPage - 1)}>Previous</button>
                            </li>
                            {pageNumbers.map((number) => (
                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => this.handlePageChange(number)}>
                                        {number}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => this.handlePageChange(currentPage + 1)}>Next</button>
                            </li>
                        </ul>
                    </div>
                </div>}
        </div>
    </>
        );
    }
}

export default DoctorListForAdmin;


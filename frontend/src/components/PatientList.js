// import React, { Component } from 'react';
// import AdminServiceMethods from '../service/AdminServiceMethods';

// class PatientList extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             patients: [],
//             message: null
//         }

//         this.reloadPatientList = this.reloadPatientList.bind(this);
//         this.deletePatient = this.deletePatient.bind(this);
//     }

//     componentDidMount() {
//         this.reloadPatientList();
//     }

//     reloadPatientList() {
//         AdminServiceMethods.fetchAllPatients()
//             .then((resp) => {
//                 this.setState({
//                     patients: resp.data,
//                     message: "Patient list rendered successfully"
//                 })
//                 console.log(this.state.message);
//             });
//     }

//     deletePatient = patientId => {
//         if (window.confirm("Are you sure you want to delete this patient?")) {
//             AdminServiceMethods.deletePatient(patientId)
//                 .then(res => {
//                     this.setState({ message: 'Patient deleted successfully.' });
//                     console.log(this.state.message, 'Patient ID: ', patientId);
//                     this.setState({ patients: this.state.patients.filter(patient => patient.id !== patientId) });
//                 })
//         } else
//             this.props.history.push('#');
//     }

//     render() {
//         return (
//             <>
//                 <div className="container my-4">
//                     <button className="btn btn-secondary offset-11" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
//                     {this.state.patients.length === 0 ? <h3>No patients in database</h3> :
//                         <div>
//                             <h3>Patient List</h3>
//                             <table className="table table-bordered">
//                                 <thead className="bg-dark text-light">
//                                     <tr>
//                                         <th className="visually-hidden">Id</th>
//                                         <th>Name</th>
//                                         <th>D.O.B.</th>
//                                         <th>City</th>
//                                         <th>Gender</th>
//                                         <th>Blood Group</th>
//                                         <th>Email</th>
//                                         <th>Mobile Number</th>
//                                         <th>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {
//                                         this.state.patients.map(
//                                             patient =>
//                                                 <tr key={patient.id}>
//                                                     <td className="visually-hidden">{patient.id}</td>
//                                                     <td>{`${patient.firstName + ' ' + patient.lastName}`}</td>
//                                                     <td>{patient.dob}</td>
//                                                     <td>{patient.city}</td>
//                                                     <td>{patient.gender}</td>
//                                                     <td>{patient.bloodGroup}</td>
//                                                     <td>{patient.email}</td>
//                                                     <td>{patient.mobileNumber}</td>
//                                                     <td>
//                                                         <button className="btn btn-danger" onClick={() => { this.deletePatient(patient.id) }}> Delete</button>
//                                                     </td>
//                                                 </tr>
//                                         )
//                                     }
//                                 </tbody>
//                             </table>
//                         </div>
//                     }
//                 </div>
//             </>
//         )
//     }
// }

// export default PatientList

import React, { Component } from 'react';
import AdminServiceMethods from '../service/AdminServiceMethods';
import Swal from 'sweetalert2';
class PatientList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            patients: [],
            message: null,
            currentPage: 1,
            patientsPerPage: 5
        };

        this.reloadPatientList = this.reloadPatientList.bind(this);
        this.deletePatient = this.deletePatient.bind(this);
    }

    componentDidMount() {
        this.reloadPatientList();
    }

    reloadPatientList() {
        AdminServiceMethods.fetchAllPatients()
            .then((resp) => {
                this.setState({
                    patients: resp.data,
                    message: 'Patient list rendered successfully'
                });
                console.log(this.state.message);
            });
    }

    deletePatient = (patientId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this patient!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                AdminServiceMethods.deletePatient(patientId)
                    .then(() => {
                        this.setState({
                            message: 'Patient deleted successfully.'
                        });
                        console.log(
                            this.state.message,
                            'Patient ID: ',
                            patientId
                        );
                        this.setState({
                            patients: this.state.patients.filter(
                                (patient) => patient.id !== patientId
                            )
                        });
                        Swal.fire(
                            'Deleted!',
                            'The patient has been deleted.',
                            'success'
                        );
                    })
                    .catch((error) => {
                        console.error(
                            'Error deleting patient: ',
                            error.response.data
                        );
                        Swal.fire(
                            'Error!',
                            'An error occurred while deleting the patient.',
                            'error'
                        );
                    });
            }
        });
    };

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const { patients, currentPage, patientsPerPage } = this.state;

        const indexOfLastPatient = currentPage * patientsPerPage;
        const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
        const currentPatients = patients.slice(
            indexOfFirstPatient,
            indexOfLastPatient
        );

        const totalPages = Math.ceil(patients.length / patientsPerPage);
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <>
                <div className="container my-4">
                    <button
                        className="btn btn-secondary offset-11"
                        onClick={() => {
                            this.props.history.push('/adminDashboard');
                        }}
                    >
                        Go Back
                    </button>
                    {patients.length === 0 ? (
                        <h3>No patients in database</h3>
                    ) : (
                        <div>
                            <h3>Patient List</h3>
                            <table className="table table-bordered">
                                <thead className="bg-dark text-light">
                                    <tr>
                                        <th className="visually-hidden">Id</th>
                                        <th>Name</th>
                                        <th>D.O.B.</th>
                                        <th>City</th>
                                        <th>Gender</th>
                                        <th>Blood Group</th>
                                        <th>Email</th>
                                        <th>Mobile Number</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPatients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td className="visually-hidden">
                                                {patient.id}
                                            </td>
                                            <td>
                                                {`${patient.firstName} ${patient.lastName}`}
                                            </td>
                                            <td>{patient.dob}</td>
                                            <td>{patient.city}</td>
                                            <td>{patient.gender}</td>
                                            <td>{patient.bloodGroup}</td>
                                            <td>{patient.email}</td>
                                            <td>{patient.mobileNumber}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        this.deletePatient(
                                                            patient.id
                                                        );
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="pagination justify-content-center">
                                <ul className="pagination">
                                    <li
                                        className={`page-item ${
                                            currentPage === 1 ? 'disabled' : ''
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                this.handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>
                                    {pageNumbers.map((number) => (
                                        <li
                                            key={number}
                                            className={`page-item ${
                                                currentPage === number
                                                    ? 'active'
                                                    : ''
                                            }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    this.handlePageChange(
                                                        number
                                                    )
                                                }
                                            >
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                    <li
                                        className={`page-item ${
                                            currentPage === totalPages
                                                ? 'disabled'
                                                : ''
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                this.handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default PatientList;


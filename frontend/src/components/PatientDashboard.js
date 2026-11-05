// import React, { Component } from 'react'
// import { NavLink } from "react-router-dom";
// import PatientServiceMethods from '../service/PatientServiceMethods';

// class PatientDashboard extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             patientId: '',
//             firstName: ''
//         }

//         this.loadPatient = this.loadPatient.bind(this);
//         this.updatePatient = this.updatePatient.bind(this);
//     }

//     componentDidMount() {
//         this.loadPatient();
//     };

//     loadPatient = () => {
//         let patient = JSON.parse(sessionStorage.getItem("patient"));
//         this.setState({
//             patientId: patient.userId,
//             firstName: patient.userFirstName
//         })
//     }

//     updatePatient = id => {
//         this.props.history.push('/update-profile');
//     }

//     logoutPatient = () => PatientServiceMethods.logoutPatient();

//     render() {
//         let { patientId, firstName } = this.state;

//         return (
//             <>
//                 <div className="container">
//                     <div className="row my-3">
//                         <div className="col-sm-6"><h2 className="text-capitalize">Hello, {firstName}</h2></div>
//                         <div className="col-sm-6">
//                             <NavLink onClick={this.logoutPatient} className="btn btn-link btn-danger text-light offset-10 text-uppercase text-decoration-none " to="/">Logout</NavLink>
//                         </div>
//                     </div>

//                     <div className="row">
//                         <div className="col-sm-6">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">Book Appointment</h5>
//                                     <p className="card-text">Book appointments with best doctors in city.</p>
//                                     <button onClick={() => { this.props.history.push('/specialization-list-by-city') }} className="btn btn-primary">Book</button>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-sm-6">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">Show Current Appointment</h5>
//                                     <p className="card-text">View your current appointment.</p>
//                                     <button onClick={() => { this.props.history.push('/current-app') }} className="btn btn-warning">View</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row my-3">
//                         <div className="col-sm-6">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">View Appointment History</h5>
//                                     <p className="card-text">Click to view your till date appointment history.</p>
//                                     <button onClick={() => { this.props.history.push('/app-history') }} className="btn btn-info">View</button>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-sm-6">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">Update Profile</h5>
//                                     <p className="card-text">Edit your account details.</p>
//                                     <button className="btn btn-success" onClick={() => { this.updatePatient(this.state.patientId) }}>Update</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row my-3">
//                         <div className="col-sm-6">
//                             <div className="card">
//                                 <div className="card-body">
//                                     <h5 className="card-title">Get Blood Donor Info</h5>
//                                     <p className="card-text">Click to view details of available blood donors.</p>
//                                     <button onClick={() => { this.props.history.push('/get-donors-by-city-and-blood-group') }} className="btn btn-warning">View</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         )
//     }
// }

// export default PatientDashboard


import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PatientServiceMethods from '../service/PatientServiceMethods';
import img1 from "../assets/medical-appointment.png"
import img2 from "../assets/calendar.png"
import img3 from "../assets/online.png"
import img4 from "../assets/profile.png"
import img5 from "../assets/blood-donation.png"
class PatientDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            patientId: '',
            firstName: '',
        };

        this.loadPatient = this.loadPatient.bind(this);
        this.updatePatient = this.updatePatient.bind(this);
    }

    componentDidMount() {
        this.loadPatient();
    }

    loadPatient = () => {
        let patient = JSON.parse(sessionStorage.getItem('patient'));
        this.setState({
            patientId: patient.userId,
            firstName: patient.userFirstName,
        });
    };

    updatePatient = (id) => {
        this.props.history.push('/update-profile');
    };

    logoutPatient = () => PatientServiceMethods.logoutPatient();

    render() {
        let { patientId, firstName } = this.state;

        return (
            <div className="container">
                <div className="row my-3">
                    <div className="col-sm-6">
                        <h2 className="text-capitalize">Hello, {firstName}</h2>
                    </div>
                    <div className="col-sm-6">
                        <NavLink
                            onClick={this.logoutPatient}
                            className="btn btn-link btn-danger text-light offset-10 text-uppercase text-decoration-none"
                            to="/"
                        >
                            Logout
                        </NavLink>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-4">
                        <div className="card">
                            <img
                                src={img1}
                                className="card-img-top"
                                alt="Book Appointment"
                                style={{width:"80%",height:"250px"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Book Appointment</h5>
                                <p className="card-text">
                                    Book appointments with the best doctors in the city.
                                </p>
                                <button
                                    onClick={() => this.props.history.push('/specialization-list-by-city')}
                                    className="btn btn-primary"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="card">
                            <img
                                src={img2}
                                className="card-img-top"
                                alt="Show Current Appointment"
                                style={{width:"80%",height:"250px"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Show Current Appointment</h5>
                                <p className="card-text">View your current appointment.</p>
                                <button
                                    onClick={() => this.props.history.push('/current-app')}
                                    className="btn btn-warning"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="card">
                            <img
                                src={img3}
                                className="card-img-top"
                                alt="View Appointment History"
                                style={{width:"80%",height:"250px"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">View Appointment History</h5>
                                <p className="card-text">
                                    Click to view your till date appointment history.
                                </p>
                                <button
                                    onClick={() => this.props.history.push('/app-history')}
                                    className="btn btn-info"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row my-3">
                    <div className="col-sm-4">
                        <div className="card">
                            <img
                                src={img4}
                                className="card-img-top"
                                alt="Update Profile"
                                style={{width:"80%",height:"250px"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Update Profile</h5>
                                <p className="card-text">Edit your account details.</p>
                                <button
                                    className="btn btn-success"
                                    onClick={() => this.updatePatient(this.state.patientId)}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="card">
                            <img
                                src={img5}
                                className="card-img-top"
                                alt="Get Blood Donor Info"
                                style={{width:"80%",height:"250px"}}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Get Blood Donor Info</h5>
                                <p className="card-text">Click to view details of available blood donors.</p>
                                <button
                                    onClick={() => this.props.history.push('/get-donors-by-city-and-blood-group')}
                                    className="btn btn-warning"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img
                                
                                src="https://cdn-icons-png.flaticon.com/512/10415/10415623.png"
                                className="card-img-top"
                                alt="Add Donor"
                                style={{ width: '80%', height: '250px' }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">Add New Donor</h5>
                                <p className="card-text">Add a new blood donor to the database.</p>
                                <button
                                    onClick={() => { this.props.history.push('/add-new-donor') }}
                                    className="btn btn-info"
                                >
                                    ADD
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Add more cards here if needed */}
                </div>
            </div>
        );
    }
}

export default PatientDashboard;


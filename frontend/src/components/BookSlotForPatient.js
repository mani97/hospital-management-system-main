// import React, { Component } from 'react';
// import AppointmentService from '../service/AppointmentService';
// import moment from 'moment';
// import Swal from 'sweetalert2';
// class BookSlotForPatient extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             slots: [],
//             message: null
             
//         }

//         this.confirmSlot = this.confirmSlot.bind(this);
//     }


// confirmSlot = (doctorId, patientId, time) => {
//   AppointmentService.bookAppointmentForPatient(doctorId, patientId, time.replace("T"," "))
//     .then(response => {
//       this.setState({
//         slots: response.data,
//         message: "Appointment Confirmed!!!"
//       });

//       Swal.fire({
//         icon: 'success',
//         title: 'Appointment Confirmed!',
//         text: this.state.message,
//         onClose: () => {
//           console.log(this.state.message);
//           this.props.history.push('/patientDashboard');
//         },
//       });
//     })
//     .catch(error => {
//       console.error("in err ", error.response.data);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: error.response.data.message,
//       });
//     });
// }

//     render() {
//         let { doctor, time } = this.props.location.state;
//         let patient = JSON.parse(sessionStorage.getItem("patient"));

//         return (
//             <>
//                 <div className="container my-4">
//                 <button className="btn btn-secondary my-2 offset-10" onClick={() => { this.props.history.push('/patientDashboard') }} style={{minWidth: "13vw"}}>Back To Dashboard</button>
//                     <h3>Confirm Appointment</h3>
//                     <table className="table table-bordered">
//                         <thead className="bg-dark text-light">
//                             <tr>
//                                 <th className="visually-hidden">Patient ID</th>
//                                 <th>Patient Name</th>
//                                 <th>Doctor Name</th>
//                                 <th>Area</th>
//                                 <th>Consultaion Fee</th>
//                                 <th>Specialization</th>
//                                 <th>Time</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td className="visually-hidden">{patient.userId}</td>
//                                 <td>{patient.userFirstName}</td>
//                                 <td>{`${'Dr. ' + doctor.firstName + ' ' + doctor.lastName}`}</td>
//                                 <td>{`${doctor.area + ', ' +  doctor.city}`}</td>
//                                 <td>{doctor.fees}</td>
//                                 <td>{doctor.specialization}</td>
//                                 <td>{moment(Date.parse(time)).format("LT")}</td>
//                                 <td>
//                                     <button className="btn btn-success" onClick={() => { this.confirmSlot(doctor.id, patient.userId, time)}}>Confirm</button>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </>
//         )
//     }
// }

// export default BookSlotForPatient
import React, { Component } from 'react';
import AppointmentService from '../service/AppointmentService';
import moment from 'moment';
import Swal from 'sweetalert2';

class BookSlotForPatient extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slots: [],
      message: null,
      isSlotConfirmed: false, // New state to track slot confirmation
    };

    this.confirmSlot = this.confirmSlot.bind(this);
  }

//   componentDidMount() {
//     const patient = JSON.parse(sessionStorage.getItem('patient'));
//     const { doctor, time } = this.props.location.state;
  
//     // Fetch slots or appointments for the patient using their ID, doctor ID, and time
//     AppointmentService.getPatientAppointments(patient.userId)
//       .then(response => {
//         const appointments = response.data;
  
//         // Check if the current slot is already confirmed
//         const isSlotConfirmed = appointments.some(appointment => (
//           appointment.doctorId === doctor.id &&
//           moment(appointment.time).format() === time
//         ));
  
//         this.setState({
//           isSlotConfirmed,
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching patient appointments:', error);
//       });
//   }
  

  confirmSlot = (doctorId, patientId, time) => {
    if (this.state.isSlotConfirmed) {
      Swal.fire({
        icon: 'info',
        title: 'Already Confirmed',
        text: 'You have already confirmed this appointment.',
      });
      return;
    }
  
    // Book the appointment
    AppointmentService.bookAppointmentForPatient(doctorId, patientId, time.replace("T"," "))
      .then(response => {
        this.setState({
          slots: response.data,
          message: "Appointment Confirmed!!!",
          isSlotConfirmed: true, // Mark the slot as confirmed
        });
  
        // Show a success alert
        Swal.fire({
          icon: 'success',
          title: 'Appointment Confirmed!',
          text: this.state.message,
          onClose: () => {
            console.log(this.state.message);
            this.props.history.push('/patientDashboard');
          },
        });
      })
      .catch(error => {
        console.error("in err ", error.response.data);
        // Show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
        });
      });
  };
  

  render() {
    let { doctor, time } = this.props.location.state;
    let patient = JSON.parse(sessionStorage.getItem('patient'));

    return (
      <>
        <div className="container my-4">
          <button
            className="btn btn-secondary my-2 offset-10"
            onClick={() => {
              this.props.history.push('/patientDashboard');
            }}
            style={{ minWidth: '13vw' }}
          >
            Back To Dashboard
          </button>
          <h3>Confirm Appointment</h3>
          <table className="table table-bordered">
            <thead className="bg-dark text-light">
              <tr>
                <th className="visually-hidden">Patient ID</th>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Area</th>
                <th>Consultaion Fee</th>
                <th>Specialization</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="visually-hidden">{patient.userId}</td>
                <td>{patient.userFirstName}</td>
                <td>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</td>
                <td>{`${doctor.area}, ${doctor.city}`}</td>
                <td>{doctor.fees}</td>
                <td>{doctor.specialization}</td>
                <td>{moment(Date.parse(time)).format('LT')}</td>
                <td>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      this.confirmSlot(doctor.id, patient.userId, time);
                    }}
                    disabled={this.state.isSlotConfirmed}
                  >
                    Confirm
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default BookSlotForPatient;



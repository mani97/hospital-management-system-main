// import React, { Component } from 'react';
// import AdminServiceMethods from '../service/AdminServiceMethods';

// class AddNewDonor extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             name: '',
//             email: '',
//             contactNumber: '',
//             city: '',
//             state: '',
//             bloodGroup: '',
//             message: null
//         }

//         this.addDonor = this.addDonor.bind(this);
//     }


//     validateEmail() {
//         let email = document.getElementById("email").value;

//         var regexEmail = /\S+@\S+\.\S+/;
//         if (regexEmail.test(email) === true) {
//             document.getElementById("emailVr").innerHTML = "";
//             return true;
//         } else {
//             document.getElementById("emailVr").innerHTML = "email format should be 'abc@gmail.com'"

//         }

//     }
//     removeWarnings() {
//         document.getElementById("emailVr").innerHTML = "";
//         document.getElementById("mobileNumberVr").innerHTML = "";

//     }

//     validateMobileNumber() {
//         let number = document.getElementById('contactNumber').value;
//         if (/^\d{10}$/.test(number)) {
//             document.getElementById("contactNumber").innerHTML = "";

//         } else {
//             document.getElementById("mobileNumberVr").innerHTML = "Phone number must be 10 digits.";

//             return false
//         }
//     }

//     addDonor = e => {
//         e.preventDefault();
//         let donor =
//         {
//             name: this.state.name,
//             email: this.state.email,
//             contactNumber: this.state.contactNumber,
//             city: this.state.city,
//             state: this.state.state,
//             bloodGroup: this.state.bloodGroup,
//         };

//         AdminServiceMethods.saveDonor(donor)
//             .then(res => {
//                 console.log(res.data);
//                 this.setState({ message: 'Donor added successfully.' });
//                 alert(this.state.message);
//                 this.props.history.push('/adminDashboard');
//             }).catch(error => {
//                 console.error("in err ", error.response.data);
//                 //err.response.data => DTO on the server side : ErrorResponse
//                 alert(error.response.data.message);
//                 this.props.history.push('/adminDashboard');
//             });
//     }

//     onChange = e =>
//         this.setState({ [e.target.name]: e.target.value });

//     handleBloodGroupChange = e => {
//         this.setState({ bloodGroup: e.target.value })
//     }

//     render() {
//         return (
//             <>
//                 <div className="container overflow-hidden" style={{ minHeight: "50vh" }}>
//                     <div className="row mt-3">
//                         <div className="col-sm-8">
//                             <h2 className="text-muted offset-9">Add Donor</h2>
//                         </div>
//                         <div className="col-sm-4">
//                             <button className="btn btn-secondary text-uppercase offset-8" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
//                         </div>
//                     </div>
//                     <form>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="username" className="col-2 col-form-label">Donor Name</label>
//                             <div className="col-5">
//                                 <input type="text" id="name" className="form-control" placeholder="Enter donor's name" name="name" value={this.state.name} onChange={this.onChange} />
//                             </div>
//                         </div>

//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="email" className="col-2 col-form-label">Email</label>
//                             <div className="col-5">
//                                 <input type="email" id="email" className="form-control" placeholder="e.g. abc@xyz.com" name="email" value={this.state.email} onChange={this.onChange} required onFocus={this.removeWarnings} onBlur={this.validateEmail} /><span style={{ color: 'red' }} id='emailVr'></span>
//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label className="col-2 col-form-label">Blood Group</label>
//                             <div className="col-5 d-flex justify-content-between">
//                                 <select value={this.state.bloodGroup} onChange={this.handleBloodGroupChange} style={{ width: "7vw", height: "7vh" }}>
//                                     <option value="" disabled>--select--</option>
//                                     <option value="A_POSITIVE">A+</option>
//                                     <option value="A_NEGATIVE">A-</option>
//                                     <option value="B_POSITIVE">B+</option>
//                                     <option value="B_NEGATIVE">B-</option>
//                                     <option value="O_POSITIVE">O+</option>
//                                     <option value="O_NEGATIVE">O-</option>
//                                     <option value="AB_POSITIVE">AB+</option>
//                                     <option value="AB_NEGATIVE">AB-</option>
//                                 </select>
//                             </div>
//                         </div>

//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="contactNumber" className="col-2 col-form-label">Contact Number</label>
//                             <div className="col-5">
//                                 <input type="text" id="contactNumber" className="form-control" placeholder="Donor's contact number" name="contactNumber" value={this.state.contactNumber} onChange={this.onChange} pattern="[0-9]{10}" onBlur={this.validateMobileNumber} onFocus={this.removeWarnings} required /><span id='mobileNumberVr' style={{ color: 'red' }}></span>
//                             </div>
//                         </div>

//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="city" className="col-2 col-form-label">City</label>
//                             <div className="col-5">
//                                 <input type="text" id="city" className="form-control" placeholder="Donor's city " name="city" value={this.state.city} onChange={this.onChange} />
//                             </div>
//                         </div>

//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="state" className="col-2 col-form-label">State</label>
//                             <div className="col-5">
//                                 <input type="text" id="state" className="form-control" placeholder="Donor's  State" name="state" value={this.state.state} onChange={this.onChange} />
//                             </div>
//                         </div>

//                         <button className="btn btn-lg btn-primary text-uppercase mt-3 offset-6" onClick={this.addDonor}>Submit</button>
//                     </form>
//                 </div>
//             </>
//         )
//     }
// }

// export default AddNewDonor;

import React, { Component } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import AdminServiceMethods from '../service/AdminServiceMethods';
import Card from 'react-bootstrap/Card';
const donorValidationSchema = Yup.object().shape({
  name: Yup.string().min(3,'name must 3 charecter').required('Donor Name is Required'),
  email: Yup.string().email('Invalid email').required('Donor email is Required'),
  bloodGroup: Yup.string().required('Blood group is Required'),
  contactNumber: Yup.string().matches(/^\d{10}$/, 'Must be 10 digits').required('Mobile number is Required'),
  city: Yup.string().min(3,'City must 3 charecter').required('City is Required'),
  state: Yup.string().min(3,'State must 3 charecter').required('State is Required')
});

class AddNewDonor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null
    };
  }

  addDonor = async (values, actions) => {
    try {
      const response = await AdminServiceMethods.saveDonor(values);
      console.log(response.data);

      this.setState({ message: 'Donor added successfully.' });
      Swal.fire('Success', this.state.message, 'success');
      this.props.history.push('/adminDashboard');
    } catch (error) {
      console.error('Error:', error.response.data);
      Swal.fire('Error', error.response.data.message, 'error');
      this.props.history.push('/adminDashboard');
    }
  };

  render() {
    return (
        <div className="mx-5 mt-5">
                <Card>
      <Card.Body><div className="container overflow-hidden" style={{ minHeight: '50vh',backgroundColor:"aliceblue" }}>
        <div className="row mt-3">
          <div className="col-sm-8">
            <h2 className="text-muted offset-9">Add Donor</h2>
          </div>
          <div className="col-sm-4">
            <button
              className="btn btn-secondary text-uppercase offset-8"
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              Go Back
            </button>
          </div>
        </div>
        <Formik
          initialValues={{
            name: '',
            email: '',
            contactNumber: '',
            city: '',
            state: '',
            bloodGroup: ''
          }}
          validationSchema={donorValidationSchema}
          onSubmit={this.addDonor}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="form-group row my-3 justify-content-center">
                <label htmlFor="name" className="col-2 col-form-label">
                  Donor Name
                </label>
                <div className="col-5">
                  <Field
                    type="text"
                    id="name"
                    className={`form-control ${
                      touched.name && errors.name ? 'is-invalid' : ''
                    }`}
                    placeholder="Enter donor's name"
                    name="name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="form-group row my-3 justify-content-center">
                <label htmlFor="email" className="col-2 col-form-label">
                  Email
                </label>
                <div className="col-5">
                  <Field
                    type="email"
                    id="email"
                    className={`form-control ${
                      touched.email && errors.email ? 'is-invalid' : ''
                    }`}
                    placeholder="e.g. abc@xyz.com"
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="form-group row mt-3 justify-content-center">
                <label htmlFor="contactNumber" className="col-2 col-form-label">
                  Contact Number
                </label>
                <div className="col-5">
                  <Field
                    type="text"
                    id="contactNumber"
                    className={`form-control ${
                      touched.contactNumber && errors.contactNumber
                        ? 'is-invalid'
                        : ''
                    }`}
                    placeholder="Donor's contact number"
                    name="contactNumber"
                  />
                  <ErrorMessage
                    name="contactNumber"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="form-group row mt-3 justify-content-center">
                <label htmlFor="city" className="col-2 col-form-label">
                  City
                </label>
                <div className="col-5">
                  <Field
                    type="text"
                    id="city"
                    className={`form-control ${
                      touched.city && errors.city ? 'is-invalid' : ''
                    }`}
                    placeholder="Donor's city"
                    name="city"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="form-group row mt-3 justify-content-center">
                <label htmlFor="state" className="col-2 col-form-label">
                  State
                </label>
                <div className="col-5">
                  <Field
                    type="text"
                    id="state"
                    className={`form-control ${
                      touched.state && errors.state ? 'is-invalid' : ''
                    }`}
                    placeholder="Donor's State"
                    name="state"
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              
              {/* Repeat similar sections for other form fields */}
              
              <div className="form-group row mt-3 justify-content-center">
                <label htmlFor="bloodGroup" className="col-2 col-form-label">
                  Blood Group
                </label>
                <div className="col-5 d-flex justify-content-between">
                  <Field
                    as="select"
                    name="bloodGroup"
                    className={`form-control ${
                      touched.bloodGroup && errors.bloodGroup ? 'is-invalid' : ''
                    }`}
                    style={{ width: '7vw', height: '7vh' }}
                  >
                    <option value="" disabled>
                      --select--
                    </option>
                    <option value="A_POSITIVE">A+</option>
                    <option value="A_NEGATIVE">A-</option>
                    <option value="B_POSITIVE">B+</option>
                    <option value="B_NEGATIVE">B-</option>
                    <option value="O_POSITIVE">O+</option>
                    <option value="O_NEGATIVE">O-</option>
                    <option value="AB_POSITIVE">AB+</option>
                    <option value="AB_NEGATIVE">AB-</option>
                    {/* Other options */}
                  </Field>
                  <ErrorMessage
                    name="bloodGroup"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
 
              <div className="form-group row mt-3 justify-content-center">
                <div className="col-5 offset-2">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary text-uppercase mt-3"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div></Card.Body>
    </Card>
      
        </div>
        
    );
  }
}

export default AddNewDonor;


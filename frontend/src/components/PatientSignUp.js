// import React, { Component } from 'react';
// import PatientServiceMethods from '../service/PatientServiceMethods';

// class PatientSignUp extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             username: '',
//             firstName: '',
//             lastName: '',
//             email: '',
//             password: '',
//             dob: '',
//             gender: '',
//             bloodGroup: '',
//             mobileNumber: '',
//             area: '',
//             city: '',
//             state: '',
//             message: null
//         }
//         this.signUp = this.signUp.bind(this);
//     }

//     validatePassword() {
//         let password = document.getElementById("pwd").value;
//         var regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{5,}$/;;

//         if (regexPassword.test(password) === true) {
//             document.getElementById("passwordVr").innerHTML = "";
//             return true;
//         } else {
//             document.getElementById("passwordVr").innerHTML = "password must be alphanumeric and should contains at least a special character with length 5"
//         }

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
//         document.getElementById("passwordVr").innerHTML = "";
//         document.getElementById("emailVr").innerHTML = "";
//         document.getElementById("mobileNumberVr").innerHTML = "";

//     }

//     validateMobileNumber() {
//         let number = document.getElementById('mobileNumber').value;
//         if (/^\d{10}$/.test(number)) {
//             document.getElementById("mobileNumberVr").innerHTML = "";

//         } else {
//             document.getElementById("mobileNumberVr").innerHTML = "Phone number must be 10 digits.";

//             return false
//         }
//     }

//     signUp = (p) => {
//         p.preventDefault();
//         let patient =
//         {
//             username: this.state.username,
//             firstName: this.state.firstName,
//             lastName: this.state.lastName,
//             email: this.state.email,
//             password: this.state.password,
//             dob: this.state.dob,
//             gender: this.state.gender,
//             bloodGroup: this.state.bloodGroup,
//             mobileNumber: this.state.mobileNumber,
//             area: this.state.area,
//             city: this.state.city,
//             state: this.state.state
//         };
//         PatientServiceMethods.addPatient(patient)
//             .then(res => {
//                 console.log(res.data);
//                 this.setState({ message: 'User added successfully.' });
//                 console.log(this.state.message);
//                 alert(this.state.message);
//                 this.props.history.push('/');
//             })
//             .catch(error => {
//                 console.error("in err ", error.response.data);
//                 alert(error.response.data.message);
//             });
//     }

//     onChange = (p) =>
//         this.setState({ [p.target.name]: p.target.value });

//     handleBloodGroupChange = e => {
//         this.setState({ bloodGroup: e.target.value })
//     }

//     render() {
//         return (
//             <>
//                 <div className="container overflow-hidden mb-5" style={{ minHeight: "100vh" }}>
//                     <div className="row my-3">
//                         <div className="col-sm-8">
//                             <h2 className="text-muted offset-8">User Registration</h2>
//                         </div>
//                             <div className="col-sm-4">
//                                 <button className="btn btn-secondary text-uppercase offset-8" onClick={() => { this.props.history.push('./') }}>Go Back</button>
//                             </div>
//                     </div>
//                     <form className="mb-5">
//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="username" className="col-2 col-form-label">Username</label>
//                             <div className="col-5">
//                                 <input type="text" id="username" className="form-control" placeholder="Enter a unique username" name="username" value={this.state.username} onChange={this.onChange} required />
//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="firstName" className="col-2 col-form-label">First Name</label>
//                             <div className="col-5">
//                                 <input type="text" id="firstName" className="form-control" placeholder="Enter your first name" name="firstName" value={this.state.firstName} onChange={this.onChange} required />
//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="lastName" className="col-2 col-form-label">Last Name</label>
//                             <div className="col-5">
//                                 <input type="text" id="lastName" className="form-control" placeholder="Enter your last name" name="lastName" value={this.state.lastName} onChange={this.onChange} required />
//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="email" className="col-2 col-form-label">Email</label>
//                             <div className="col-5">
//                                 <input type="email" id="email" className="form-control" placeholder="e.g. abc@xyz.com" name="email" value={this.state.email} onChange={this.onChange} onChange={this.onChange} required onFocus={this.removeWarnings} onBlur={this.validateEmail} /><span style={{ color: 'red' }} id='emailVr'></span>

//                             </div>
//                         </div>

//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="dob" className="col-2 col-form-label">Date of Birth</label>
//                             <div className="col-5">
//                                 <input type="date" id="dob" className="form-control" name="dob" value={this.state.dob} onChange={this.onChange} required />
//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label htmlFor="pwd" className="col-2 col-form-label">Password</label>
//                             <div className="col-5">
//                                 <input type="password" id="pwd" className="form-control" placeholder="Enter Password" name="password" value={this.state.password} onChange={this.onChange} onBlur={this.validatePassword} onFocus={this.removeWarnings} required /><span style={{ color: 'red' }} id='passwordVr'></span>

//                             </div>
//                         </div>
//                         <div className="form-group row my-3 justify-content-center">
//                             <label className="col-2 col-form-label">Gender</label>
//                             <div className="col-5 d-flex justify-content-between">
//                                 <div><input type="radio" id="gender" name="gender" value="MALE" onChange={this.onChange} /> Male</div>
//                                 <div><input type="radio" id="gender" name="gender" value="FEMALE" onChange={this.onChange} /> Female</div>
//                                 <div><input type="radio" id="gender" name="gender" value="OTHER" onChange={this.onChange} /> Other</div>
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
//                             <label htmlFor="mobileNumber" className="col-2 col-form-label">Mobile</label>
//                             <div className="col-5">
//                                 <input type="text" id="mobileNumber" className="form-control" placeholder="Enter your mobile number" name="mobileNumber" value={this.state.mobileNumber} onChange={this.onChange} pattern="[0-9]{10}" onBlur={this.validateMobileNumber} onFocus={this.removeWarnings} required /><span id='mobileNumberVr' style={{ color: 'red' }}></span>

//                             </div>
//                         </div>

//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="area" className="col-2 col-form-label">Area</label>
//                             <div className="col-5">
//                                 <input type="text" id="area" className="form-control" placeholder="Enter a Area" name="area" value={this.state.area} onChange={this.onChange} required />
//                             </div>
//                         </div>

//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="city" className="col-2 col-form-label">City</label>
//                             <div className="col-5">
//                                 <input type="text" id="city" className="form-control" placeholder="Enter a city " name="city" value={this.state.city} onChange={this.onChange} required />
//                             </div>
//                         </div>

//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="state" className="col-2 col-form-label">State</label>
//                             <div className="col-5">
//                                 <input type="text" id="state" className="form-control" placeholder="Enter a state" name="state" value={this.state.state} onChange={this.onChange} required />
//                             </div>
//                         </div>
//                         <div className="form-group row justify-content-center">
//                             <div className="offset-9">
//                                 <button className="btn btn-lg btn-primary text-uppercase mt-3" onClick={this.signUp}>Sign Up</button>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//             </>
//         )
//     }
// }

// export default PatientSignUp

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PatientServiceMethods from '../service/PatientServiceMethods';
import Card from 'react-bootstrap/Card';

const validationSchema = Yup.object().shape({
  username: Yup.string().min(3,'Username must 3 charecter').max(15,'Username not more than 15 charecter').required('Username is required'),
  firstName: Yup.string().min(3,'Name must 3 charecter').max(15,'Name not more than 15 charecter').required('First Name is required'),
  lastName: Yup.string().min(3,'Last name must 3 charecter').max(15,'Last name not more than 15 charecter').required('Last Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{6,}$/, 'Password must be alphanumeric and should contain at least one special character with a minimum length of 6 characters')
    .required('Password is required'),
  dob: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
  bloodGroup: Yup.string().required('Blood Group is required'),
  mobileNumber: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits').required('Mobile Number is required'),
  area: Yup.string().min(3,'Area must 3 charecter').max(30,'Area not more than 30 charecter').required('Area is required'),
  city: Yup.string().min(3,'city name must 3 charecter').max(15,'city name not more than 15 charecter').required('City is required'),
  state: Yup.string().min(3,'State must 3 charecter').max(15,'state not more than 15 charecter').required('State is required'),
});

const initialValues = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  dob: '',
  gender: '',
  bloodGroup: '',
  mobileNumber: '',
  area: '',
  city: '',
  state: '',
};

const PatientSignUp = ({ history }) => {
  const handleSubmit = (values) => {
    PatientServiceMethods.addPatient(values)
      .then(() => {
        alert('User added successfully.');
        history.push('/');
      })
      .catch(error => {
        console.error("in err ", error);
        const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
        alert(message);
      });
  };

  return (
    <>
    <div className="mx-4 mt-4">
    <Card>
      <Card.Body><div className="container overflow-hidden mb-5" style={{ minHeight: "100vh",backgroundColor:"aliceblue" }}>
        <div className="row my-3">
          <div className="col-sm-8">
            <h2 className="text-muted offset-8">User Registration</h2>
          </div>
          <div className="col-sm-4">
            {/* <button className="btn btn-secondary text-uppercase offset-8" onClick={() => { this.props.history.goBack(); }}>Go Back</button> */}
          </div>
        </div>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          <Form className="mb-5">
            {/* Repeat similar sections for other form fields */}
            <div className="form-group row mt-3 justify-content-center">
              <label htmlFor="username" className="col-2 col-form-label">Username</label>
              <div className="col-5">
                <Field type="text" id="username" className="form-control" placeholder="Enter a unique username" name="username" />
                <ErrorMessage name="username" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="firstName" className="col-2 col-form-label">First Name</label>
              <div className="col-5">
                <Field type="text" id="firstName" className="form-control" placeholder="Enter your first name" name="firstName" />
                <ErrorMessage name="firstName" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="lastName" className="col-2 col-form-label">Last Name</label>
              <div className="col-5">
                <Field type="text" id="lastName" className="form-control" placeholder="Enter your last name" name="lastName" />
                <ErrorMessage name="lastName" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="email" className="col-2 col-form-label">Email</label>
              <div className="col-5">
                <Field type="email" id="email" className="form-control" placeholder="e.g. abc@xyz.com" name="email" />
                <ErrorMessage name="email" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="dob" className="col-2 col-form-label">Date of Birth</label>
              <div className="col-5">
                <Field type="date" id="dob" className="form-control" name="dob" />
                <ErrorMessage name="dob" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="pwd" className="col-2 col-form-label">Password</label>
              <div className="col-5">
                <Field type="password" id="pwd" className="form-control" placeholder="Enter Password" name="password" />
                <ErrorMessage name="password" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label className="col-2 col-form-label">Gender</label>
              <div className="col-5 d-flex justify-content-between">
                <div><Field type="radio" id="gender" name="gender" value="MALE" /> Male</div>
                <div><Field type="radio" id="gender" name="gender" value="FEMALE" /> Female</div>
                <div><Field type="radio" id="gender" name="gender" value="OTHER" /> Other</div>
              </div>
              <ErrorMessage name="gender" component="div" className="error-message text-danger" />
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label className="col-2 col-form-label">Blood Group</label>
              <div className="col-5 d-flex justify-content-between">
                <Field as="select" name="bloodGroup" className="form-control">
                  <option value="" disabled>--select--</option>
                  <option value="A_POSITIVE">A+</option>
                  <option value="A_NEGATIVE">A-</option>
                  <option value="B_POSITIVE">B+</option>
                  <option value="B_NEGATIVE">B-</option>
                  <option value="O_POSITIVE">O+</option>
                  <option value="O_NEGATIVE">O-</option>
                  <option value="AB_POSITIVE">AB+</option>
                  <option value="AB_NEGATIVE">AB-</option>
                </Field>
                
                <ErrorMessage name="bloodGroup" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="mobileNumber" className="col-2 col-form-label">Mobile</label>
              <div className="col-5">
                <Field type="text" id="mobileNumber" className="form-control" placeholder="Enter your mobile number" name="mobileNumber" />
                <ErrorMessage name="mobileNumber" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row my-3 justify-content-center">
              <label htmlFor="area" className="col-2 col-form-label">Area</label>
              <div className="col-5">
                <Field type="text" id="area" className="form-control" placeholder="Enter a Area" name="area" />
                <ErrorMessage name="area" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row mt-3 justify-content-center">
              <label htmlFor="city" className="col-2 col-form-label">City</label>
              <div className="col-5">
                <Field type="text" id="city" className="form-control" placeholder="Enter a city " name="city" />
                <ErrorMessage name="city" component="div" className="error-message text-danger" />
              </div>
            </div>
            <div className="form-group row mt-3 justify-content-center">
              <label htmlFor="state" className="col-2 col-form-label">State</label>
              <div className="col-5">
                <Field type="text" id="state" className="form-control" placeholder="Enter a state" name="state" />
                <ErrorMessage name="state" component="div" className="error-message text-danger" />
              </div>
            </div>
            {/* ... */}
            <div className="form-group row justify-content-center">
              <div className="offset-9">
                <button type="submit" className="btn btn-lg btn-primary text-uppercase mt-3">Sign Up</button>
              </div>
            </div>
          </Form>
        </Formik>
      </div></Card.Body>
    </Card>
    
    </div>
      
    </>
  );
};

export default PatientSignUp;

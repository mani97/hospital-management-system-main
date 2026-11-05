// import React, { Component } from 'react'
// import UserLoginAPI from '../service/UserLoginAPI';
// import { NavLink } from 'react-router-dom';

// import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

// class UserLogin extends Component {

//     constructor(props) {
//         super(props)

//         this.state = {
//             email: '',
//             password: '',
//             message: null
//         }

//         this.login = this.login.bind(this);
//         this.onChange = this.onChange.bind(this);
//     }

//     login = e => {
//         if(this.state.password == '') {
//             alert("Password cannot be null")
//             this.props.history.push("/userLogin")
//             return false;
//         }
//         e.preventDefault();
//         let user = {
//             email: this.state.email,
//             password: this.state.password,
//         };

//         UserLoginAPI.userLogin(user)
//             .then(response => {
//                 console.log(response.data);
//                 this.setState({ message: 'Login successful.' });
//                 console.log(this.state.message);
//                 if (response.data.userType === "patient") {
//                     sessionStorage.setItem("patient", JSON.stringify(response.data));
//                     this.props.history.push('/patientDashboard');
//                 }
//                 else if (response.data.userType === "doctor") {
//                     sessionStorage.setItem("doctor", JSON.stringify(response.data));
//                     this.props.history.push('/doctorDashboard');
//                 }
                
//                 else {
//                     sessionStorage.setItem("admin", JSON.stringify(response.data));
//                     this.props.history.push('/adminDashboard');
//                 }
//             })
//             .catch(error => {
//                 console.error("in err ", error.response.data);
//                 //err.response.data => DTO on the server side : ErrorResponse
//                 alert(error.response.data.message);
//                 this.props.history.push('/userLogin');
//             });

//     }

//     validateEmail() {
//         let email = document.getElementById("email").value;
//         let emailRegex = /\S+@\S+\.\S+/;
//         if(emailRegex.test(email) === true || email == '') {
//             return true;
//         }
//         else {
//             document.getElementById("emailVR").innerHTML = "Email format should be abc@xyz.com"
//             return false;
//         }
//     }

//     removeAlert() {
//         document.getElementById("emailVR").innerHTML = "";
      
//     }

//     onChange = e => this.setState({ [e.target.name]: e.target.value });

//     render() {
//         return (
//             <>

// <Container className="d-flex justify-content-center align-items-center mt-5">
//                 <Card style={{ width: '30rem' }}>
//                     <Card.Body className="text-center">
//                         <Card.Title className="mb-4">User Login</Card.Title>
//                         <Form>
//                             <Form.Group>
//                                 <Form.Control
//                                     type="email"
//                                     placeholder="Email"
//                                     name="email"
//                                     value={this.state.email}
//                                     onChange={this.onChange}
                                    
//                                     className='mb-4'
//                                 />
//                                 <span style={{ color: 'red' }} id="emailVR"></span>
//                             </Form.Group>
//                             <Form.Group>
//                                 <Form.Control
//                                     type="password"
//                                     placeholder="Password"
//                                     name="password"
//                                     value={this.state.password}
//                                     onChange={this.onChange}
//                                     className='mb-4'
//                                 />
//                             </Form.Group>
//                             <Row>
//                                 <Col xs={7}>
//                                     <Button variant="success" className="text-uppercase mb-3 offset-8" onClick={this.login}>
//                                         LOGIN
//                                     </Button>
//                                 </Col>
//                                 <Col xs={5} className="mt-3">
//                                     <NavLink className="text-light" to="/email-for-forgot-password">
//                                         <h6>Forgot Password?</h6>
//                                     </NavLink>
//                                 </Col>
//                             </Row>
//                         </Form>
//                         <span id="span"></span>
//                     </Card.Body>
//                 </Card>
//             </Container>

//             </>
//         )
//     }
// }

// export default UserLogin


import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import UserLoginAPI from '../service/UserLoginAPI';

class UserLogin extends Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
    }

    login(values) {
        if (values.password === '') {
            Swal.fire({
                icon: 'error',
                title: 'Password Error',
                text: 'Password cannot be empty',
            });
            return;
        }

        UserLoginAPI.userLogin(values)
            .then(response => {
                const userType = response.data.userType;
                sessionStorage.setItem(userType, JSON.stringify(response.data));

                let redirectPath = '';
                switch (userType) {
                    case 'patient':
                        redirectPath = '/patientDashboard';
                        break;
                    case 'doctor':
                        redirectPath = '/doctorDashboard';
                        break;
                    default:
                        redirectPath = '/adminDashboard';
                        break;
                }

                this.props.history.push(redirectPath);

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'You have successfully logged in.',
                });
            })
            .catch(error => {
                console.error("in err ", error.response.data);
                const errorMessage = error.response.data.message || 'An error occurred while logging in';
                Swal.fire({
                    icon: 'error',
                    title: 'Login Error',
                    text: errorMessage,
                });
            });
    }

    render() {
        return (
            <>
                <Container className="d-flex justify-content-center align-items-center mt-5">
                    <Card style={{ width: '35rem' }}>
                        <Card.Body className="text-center">
                            <Card.Title className="mb-4">Login Form</Card.Title>
                            <Formik
                                initialValues={{ email: '', password: '' }}
                                validationSchema={Yup.object().shape({
                                    email: Yup.string().email('Invalid email').required('Email is required'),
                                    password: Yup.string().required('Password is required'),
                                })}
                                onSubmit={(values, { setSubmitting }) => {
                                    this.login(values);
                                    setSubmitting(false);
                                }}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Control
                                                type="email"
                                                placeholder="Email"
                                                name="email"
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={touched.email && errors.email ? 'mb-4 is-invalid' : 'mb-4'}
                                            />
                                            <ErrorMessage name="email" component="div" className="text-danger" />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Control
                                                type="password"
                                                placeholder="Password"
                                                name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={touched.password && errors.password ? 'mb-4 is-invalid' : 'mb-4'}
                                            />
                                            <ErrorMessage name="password" component="div" className="text-danger" />
                                        </Form.Group>
                                        <Row>
                                            <Col xs={7}>
                                                <Button
                                                    type="submit"
                                                    variant="success"
                                                    className="text-uppercase mb-3 offset-8"
                                                    disabled={isSubmitting}
                                                >
                                                    LOGIN
                                                </Button>
                                            </Col>
                                            <Col xs={5} className="mt-1">
                                                <NavLink className="text-dark" to="/email-for-forgot-password">
                                                    <Button>Forgot Password?</Button>
                                                </NavLink>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Container>
            </>
        );
    }
}

export default UserLogin;

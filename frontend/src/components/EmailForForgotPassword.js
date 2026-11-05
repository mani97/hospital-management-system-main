import React, { Component } from 'react';
import UserLoginAPI from '../service/UserLoginAPI';
import ReactModuleLoader from 'react-module-loader';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
class EmailForForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            email: '',
            token: '',
            message: null
        }

        this.submit = this.submit.bind(this);
    }

    submit = e => {
        e.preventDefault();

        this.setState({ loading: true });

        //Faking API call here
        setTimeout(() => {
            this.setState({ loading: false });
        }, 1000);

        UserLoginAPI.generateToken(this.state.email)
            .then(response => {
                this.setState({
                    token: response.data,
                    message: 'Token received'
                });

                Swal.fire({
                    icon: 'success',
                    title: 'Token Sent',
                    text: 'Token has been sent to the registered email!',
                }).then(() => {
                    this.props.history.push({
                        pathname: '/enter-token',
                        state: {
                            email: this.state.email,
                            token: this.state.token
                        }
                    });
                });
            })
            .catch(error => {
                console.error('in err ', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Email',
                    text: 'Please enter a valid email address.',
                }).then(() => {
                    this.props.history.push('#');
                });
            })
            .finally(() => {
                this.setState({ loading: false });
            });
        // UserLoginAPI.generateToken(this.state.email)
        //     .then(response => {
        //         this.setState({
        //             token: response.data,
        //             message: "Token received"
        //         })
        //         alert("Token has been sent to registered email!!!")
        //         this.props.history.push({

        //             pathname: '/enter-token',
        //             state: {
        //                 email: this.state.email,
        //                 token: this.state.token
        //             }
        //         });
        //     })
        //     .catch(error => {
        //         console.error("in err ", error.response.data);
        //         alert("Invalid Email");
        //         this.props.history.push('#');
        //     })

    }

    validateEmail() {
        let email = document.getElementById("email1").value;
        let emailRegex = /\S+@\S+\.\S+/;
        if (emailRegex.test(email) === true || email == '') {
            return true;
        }
        else {
            document.getElementById("emailVR").innerHTML = "Email format should be abc@xyz.com"
            return false;
        }
    }

    removeAlert() {
        document.getElementById("emailVR").innerHTML = "";

    }

    onChange = e => this.setState({ email: e.target.value });

    render() {
        return (
            <>
                
                <div className="container mt-5 d-flex justify-content-center align-items-center vh-50">
                <Card style={{ width: '30vw', backgroundColor:"antiquewhite" }}>
                    <Card.Body>
                        <Card.Title className="text-center mt-3 mb-3">Forgot Password?</Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Control type="email" id="email1" placeholder="Enter Registered Email" name="email" value={this.state.email} onChange={this.onChange} onBlur={this.validateEmail} onFocus={this.removeAlert} required />
                                <span id="emailVR" style={{ color: 'red' }}></span>
                            </Form.Group>
                            <Button className="my-3 offset-5" onClick={this.submit} disabled={this.state.loading}>
                                {this.state.loading ? (
                                    <><i className="fas fa-spinner" style={{ marginRight: '5px' }} />Submitting</>
                                ) : (
                                    <>Submit</>
                                )}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            </>
        )
    }
}

export default EmailForForgotPassword
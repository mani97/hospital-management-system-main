import React, { Component } from 'react';
import UserLoginAPI from '../service/UserLoginAPI';
import Swal from 'sweetalert2';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
class ResetPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            password: '',
            confirmPassword: '',
            message: null
        }

        this.submit = this.submit.bind(this);
    }

    submit = e => {
        e.preventDefault();
        console.log(this.props.location.state.email);
        console.log(this.state.password);

        if (this.state.password === this.state.confirmPassword) {
            UserLoginAPI.resetPassword(this.props.location.state.email, this.state.password)
                .then(response => {
                    console.log(response.data);
                    this.setState({ message: 'Password changed successfully!!!' });

                    Swal.fire({
                        icon: 'success',
                        title: 'Password Changed',
                        text: this.state.message,
                    }).then(() => {
                        this.props.history.push('/userLogin');
                    });
                })
                .catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Same Password',
                        text: 'Password is same as the previous password.',
                    }).then(() => {
                        this.props.history.push('/userLogin');
                    });
                });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match. Please try again.',
            }).then(() => {
                this.props.history.push({
                    pathname: '/reset-password',
                    state: {
                        email: this.props.location.state.email
                    }
                });
            });
        }
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <>
        

<div className="container mt-5 d-flex justify-content-center align-items-center vh-50">
                <Card className="w-50" style={{backgroundColor:"bisque"}}>
                    <Card.Body>
                        <h2 className="text-center mt-3">Reset Password</h2>
                        <Form>
                            <Form.Group>
                                <Form.Control
                                    type="password"
                                    className="text-center mt-3"
                                    placeholder="New Password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="my-3">
                                <Form.Control
                                    type="password"
                                    className="text-center"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={this.state.confirmPassword}
                                    onChange={this.onChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" className="my-3 offset-5" onClick={this.submit}>
                                SUBMIT
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
            </>
        )
    }
}

export default ResetPassword

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./Home.css";
import img1 from "../assets/heart.png"
// import img2 from "../assets/1.jpg"
import { NavLink } from 'react-router-dom';
function Home() {
  return (
    <div>
      <main className="home">
        <section className="hero-section">
          <Container>
            <Row>
              <Col md={6} className="hero-text">
                <h1>Welcome to KM Clinic and Hospital</h1>
                <p>
                  This platform for booking medical consultations with specialist doctors in your city online. Patient can book an appointment by selecting any of the time slot given by doctor.
                </p>
              </Col>
              <div className="d-flex justify-content-start">
                <NavLink
                  className="btn btn-link btn-lg btn-success  button1 text-uppercase text-decoration-none mx-3"
                  to="/patient-sign-up"
                >
                  User Sign Up
                </NavLink>

                <NavLink
                  className="btn btn-link btn-lg btn-info button2 text-dark text-uppercase text-decoration-none mx-3"
                  to="/userLogin"
                >
                  Login
                </NavLink>
                <NavLink
                  className="btn btn-link btn-lg btn-success  button1 text-uppercase text-decoration-none mx-3"
                  to="/SignUp-new-doctor"
                >
                  Doctor Sign Up
                </NavLink>
              </div>


              {/* <Col md={6} className="hero-image">
                <img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
                  alt="Hero"
                  className="img-fluid"
                />
              </Col> */}
            </Row>
          </Container>
        </section>

        <section className="features-section">
          <Container>
            <Row>
              <Col md={4}>
                <div className="feature-item">
                  <i className="fas fa-heart"></i>
                  <h3>Save Lives</h3>
                  <p>
                    By donating blood, you can help save lives and support
                    medical treatments.
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-item">
                  <i className="fas fa-users"></i>
                  <h3>Community</h3>
                  <p>
                    Join our blood donation community and make a positive impact
                    in your community.
                  </p>
                </div>
              </Col>
              <Col md={4}>
                <div className="feature-item">
                  <i className="fas fa-medkit"></i>
                  <h3>Health Benefits</h3>
                  <p>
                    Regular blood donation has numerous health benefits for the
                    donors.
                  </p>
                </div>
              </Col>
              <img src={img1} className="img-fluid" />

            </Row>
          </Container>
        </section>
      </main>
    </div>
  );
}

export default Home;

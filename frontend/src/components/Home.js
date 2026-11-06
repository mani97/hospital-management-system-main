import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.css";
import img1 from "../assets/heart.png";
import { NavLink, useHistory } from 'react-router-dom';
import { getAuthUser, logoutUser } from '../service/AuthService';

function Home() {
  const history = useHistory();
  const [authUser, setAuthUser] = useState(getAuthUser());

  useEffect(() => {
    // Keep auth state synchronized on mount, storage changes, or login/logout events
    const updateAuth = () => setAuthUser(getAuthUser());
    updateAuth();

    window.addEventListener('storage', updateAuth);
    window.addEventListener('authChange', updateAuth);

    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('authChange', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser(history);
    setAuthUser(null);
  };

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
              <div className="d-flex justify-content-start align-items-center flex-wrap my-3">
                {/* Conditional rendering based on authentication state */}
                {authUser ? (
                  // Logged-in State: Show User Profile, Dashboard, and Logout
                  <div className="d-flex align-items-center flex-wrap">
                    <span className="btn btn-light text-dark disabled py-2 px-3 mx-2 fw-bold border">
                      <i className="fas fa-user-circle text-primary me-2 fa-lg"></i>
                      {authUser.name} <span className="badge bg-secondary ms-1 text-uppercase">{authUser.role}</span>
                    </span>

                    <NavLink
                      className="btn btn-primary btn-lg text-uppercase text-decoration-none mx-2 shadow-sm"
                      to={authUser.dashboard}
                    >
                      <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                    </NavLink>

                    <button
                      className="btn btn-danger btn-lg text-uppercase text-decoration-none mx-2 shadow-sm"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-1"></i> Logout
                    </button>
                  </div>
                ) : (
                  // Guest State: Show User Sign Up, Login, and Doctor Sign Up
                  <>
                    <NavLink
                      className="btn btn-link btn-lg btn-success button1 text-uppercase text-decoration-none mx-3"
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
                      className="btn btn-link btn-lg btn-success button1 text-uppercase text-decoration-none mx-3"
                      to="/SignUp-new-doctor"
                    >
                      Doctor Sign Up
                    </NavLink>
                  </>
                )}
              </div>
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
              <img src={img1} className="img-fluid" alt="Heart graphic" />
            </Row>
          </Container>
        </section>
      </main>
    </div>
  );
}

export default Home;

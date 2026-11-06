import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { getAuthUser, logoutUser } from '../service/AuthService';

export default function Header(props) {
    const location = useLocation();
    const history = useHistory();
    const [authUser, setAuthUser] = useState(getAuthUser());

    useEffect(() => {
        // Synchronize auth state on location change, storage change, or custom auth events
        const syncUser = () => setAuthUser(getAuthUser());
        syncUser();

        window.addEventListener('storage', syncUser);
        window.addEventListener('authChange', syncUser);

        return () => {
            window.removeEventListener('storage', syncUser);
            window.removeEventListener('authChange', syncUser);
        };
    }, [location]);

    const handleLogout = () => {
        logoutUser(history);
        setAuthUser(null);
    };

    const isAdmin = authUser?.role === 'admin';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div className="container">
                <div className="navbar-header">
                    <NavLink className="navbar-brand d-flex align-items-center" to="/">
                        <img
                            src="https://www.freepnglogos.com/uploads/medicine-logo-png-1.png"
                            style={{ width: "45px", height: "45px", marginRight: "10px" }}
                            alt="KM Clinic and Hospital"
                        />
                        <span className="fw-bold">KM CLINIC AND HOSPITAL</span>
                    </NavLink>
                </div>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className="nav-link" exact to="/">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About Us</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact Us</NavLink>
                        </li>

                        {/* Pharmacy & Inventory: visible ONLY after Admin Login */}
                        {isAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link text-warning fw-bold" to="/pharmacy">
                                    <i className="fas fa-pills me-1"></i> Pharmacy
                                </NavLink>
                            </li>
                        )}
                    </ul>

                    {/* Authentication state conditional rendering */}
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                        {authUser ? (
                            // Logged-in State: Show User Profile, Dashboard Link, and Logout
                            <>
                                <li className="nav-item me-2 my-1">
                                    <span className="nav-link text-light py-1">
                                        <i className="fas fa-user-circle text-info me-1"></i>
                                        <span className="fw-bold">{authUser.name}</span>
                                        <span className="badge bg-secondary ms-2 text-uppercase" style={{ fontSize: '0.7rem' }}>
                                            {authUser.role}
                                        </span>
                                    </span>
                                </li>
                                <li className="nav-item me-2 my-1">
                                    <NavLink
                                        className="btn btn-sm btn-outline-info text-info py-1 px-2"
                                        to={authUser.dashboard}
                                    >
                                        <i className="fas fa-tachometer-alt me-1"></i> Dashboard
                                    </NavLink>
                                </li>
                                <li className="nav-item my-1">
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-sm btn-danger text-white py-1 px-2"
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            // Logged-out State: Show Login link
                            <li className="nav-item">
                                <NavLink className="nav-link btn btn-outline-light btn-sm text-light px-3 py-1 my-1" to="/userLogin">
                                    <i className="fas fa-sign-in-alt me-1"></i> Login
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

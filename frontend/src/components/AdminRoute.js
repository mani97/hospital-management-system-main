import React from 'react';
import { Route } from 'react-router-dom';

/**
 * Route wrapper that restricts access exclusively to authenticated Administrators.
 * If not logged in as admin, displays a clear Access Denied notice with a direct link
 * to the Admin Login page and a back button.
 */
const AdminRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                let isAdmin = false;
                try {
                    const admin = JSON.parse(sessionStorage.getItem('admin'));
                    if (admin && (admin.userId || admin.userType === 'admin' || admin.email)) {
                        isAdmin = true;
                    }
                } catch (e) {
                    isAdmin = false;
                }

                if (!isAdmin) {
                    const isDoctor = !!sessionStorage.getItem('doctor');
                    const isPatient = !!sessionStorage.getItem('patient');
                    const fallbackPath = isDoctor ? '/doctorDashboard' : isPatient ? '/patientDashboard' : '/userLogin';

                    return (
                        <div className="container my-5 text-center" style={{ maxWidth: '600px' }}>
                            <div className="card shadow border-danger">
                                <div className="card-header bg-danger text-white">
                                    <h4 className="mb-0"><i className="fas fa-lock me-2"></i>Access Denied</h4>
                                </div>
                                <div className="card-body py-4">
                                    <i className="fas fa-shield-alt text-danger fa-4x mb-3"></i>
                                    <h5>Administrator Access Required</h5>
                                    <p className="text-muted">
                                        The Pharmacy and Medicine Inventory module is strictly restricted to hospital administrators.
                                        Other users cannot view or modify medicines, stock levels, or billing records.
                                    </p>
                                    <div className="mt-4">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => props.history.push('/userLogin')}
                                        >
                                            <i className="fas fa-sign-in-alt me-1"></i> Admin Login
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={() => props.history.push(fallbackPath)}
                                        >
                                            <i className="fas fa-arrow-left me-1"></i> Go Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return <Component {...props} />;
            }}
        />
    );
};

export default AdminRoute;


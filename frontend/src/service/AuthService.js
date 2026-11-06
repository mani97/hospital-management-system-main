/**
 * Centralized Authentication Service
 * Manages user session state, role detection, and logout across the application.
 */

export const getAuthUser = () => {
    try {
        const adminData = sessionStorage.getItem('admin');
        if (adminData) {
            const admin = JSON.parse(adminData);
            if (admin && (admin.userId || admin.userFirstName || admin.userType === 'admin')) {
                return {
                    role: 'admin',
                    name: admin.userFirstName || admin.name || 'Administrator',
                    dashboard: '/adminDashboard',
                    data: admin,
                };
            }
        }

        const doctorData = sessionStorage.getItem('doctor');
        if (doctorData) {
            const doctor = JSON.parse(doctorData);
            if (doctor && (doctor.userId || doctor.userFirstName || doctor.userType === 'doctor')) {
                const firstName = doctor.userFirstName || doctor.firstName || 'Doctor';
                return {
                    role: 'doctor',
                    name: firstName.startsWith('Dr.') ? firstName : `Dr. ${firstName}`,
                    dashboard: '/doctorDashboard',
                    data: doctor,
                };
            }
        }

        const patientData = sessionStorage.getItem('patient');
        if (patientData) {
            const patient = JSON.parse(patientData);
            if (patient && (patient.userId || patient.userFirstName || patient.userType === 'patient')) {
                return {
                    role: 'patient',
                    name: patient.userFirstName || patient.firstName || 'Patient',
                    dashboard: '/patientDashboard',
                    data: patient,
                };
            }
        }
    } catch (e) {
        console.error('Error parsing authenticated user session:', e);
    }
    return null;
};

export const logoutUser = (history = null) => {
    sessionStorage.removeItem('admin');
    sessionStorage.removeItem('doctor');
    sessionStorage.removeItem('patient');
    sessionStorage.removeItem('loginState');
    sessionStorage.clear();

    // Notify any active components about auth state change
    window.dispatchEvent(new Event('authChange'));
    window.dispatchEvent(new Event('storage'));

    if (history) {
        history.push('/');
    } else {
        window.location.href = '/';
    }
};


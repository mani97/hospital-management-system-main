// import React, { Component } from 'react';
// import AdminServiceMethods from '../service/AdminServiceMethods';

// class DonorList extends Component {
//     constructor(props) {
//         super(props)

//         this.state = {
//             donors: [],
//             message: null
//         }

//         this.loadDonorList = this.loadDonorList.bind(this);
//     }

//     componentDidMount() {
//         this.loadDonorList();
//     }

//     loadDonorList() {
//         AdminServiceMethods.fetchAllBloodDonors()
//             .then((resp) => {
//                 this.setState({
//                     donors: resp.data,
//                     message: "Donor list rendered successfully"
//                 })
//                 console.log(this.state.message);
//             });
//     }

//     render() {
//         return (
//             <>
//                 <div className="container my-4">
//                 <button className="btn btn-secondary offset-11" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
//                     {this.state.donors.length === 0 ? <h3>No donors in database</h3> :
//                         <div>
//                             <h3>Donor List</h3>
//                             <table className="table table-bordered">
//                                 <thead className="bg-dark text-light">
//                                     <tr>
//                                         <th className="visually-hidden">Id</th>
//                                         <th>Name</th>
//                                         <th>Email</th>
//                                         <th>City</th>
//                                         <th>Contact Number</th>
//                                         <th>Blood Group</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {
//                                         this.state.donors.map(
//                                             donor =>
//                                                 <tr key={donor.id}>
//                                                     <td className="visually-hidden">{donor.id}</td>
//                                                     <td>{donor.name}</td>
//                                                     <td>{donor.email}</td>
//                                                     <td>{donor.city}</td>
//                                                     <td>{donor.contactNumber}</td>
//                                                     <td>{donor.bloodGroup}</td>
//                                                 </tr>
//                                         )
//                                     }
//                                 </tbody>
//                             </table>
//                         </div>}
//                 </div>
//             </>
//         )
//     }
// }

// export default DonorList


import React, { Component } from 'react';
import AdminServiceMethods from '../service/AdminServiceMethods';

class DonorList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            donors: [],
            message: null,
            currentPage: 1,
            donorsPerPage: 5
        };

        this.loadDonorList = this.loadDonorList.bind(this);
    }

    componentDidMount() {
        this.loadDonorList();
    }

    loadDonorList() {
        AdminServiceMethods.fetchAllBloodDonors()
            .then((resp) => {
                this.setState({
                    donors: resp.data,
                    message: "Donor list rendered successfully"
                });
                console.log(this.state.message);
            });
    }

    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    };

    render() {
        const { donors, currentPage, donorsPerPage } = this.state;

        // Pagination logic
        const indexOfLastDonor = currentPage * donorsPerPage;
        const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
        const currentDonors = donors.slice(indexOfFirstDonor, indexOfLastDonor);

        const totalPages = Math.ceil(donors.length / donorsPerPage);
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

        return (
            <>
                <div className="container my-4">
                    <button className="btn btn-secondary offset-11" onClick={() => { this.props.history.push('/adminDashboard') }}>Go Back</button>
                    {donors.length === 0 ? <h3>No donors in the database</h3> :
                        <div>
                            <h3>Donor List</h3>
                            <table className="table table-bordered">
                            <thead className="bg-dark text-light">
                                     <tr>
                                         <th className="">Id</th>
                                         <th>Name</th>
                                         <th>Email</th>
                                         <th>City</th>
                                         <th>Contact Number</th>
                                         <th>Blood Group</th>
                                     </tr>
                                 </thead>
                                <tbody>
                                    {currentDonors.map(donor =>
                                        <tr key={donor.id}>
                                         <td className="">{donor.id}</td>
                                         <td>{donor.name}</td>
                                         <td>{donor.email}</td>
                                         <td>{donor.city}</td>
                                         <td>{donor.contactNumber}</td>
                                         <td>{donor.bloodGroup}</td>
                                     </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className="pagination justify-content-center">
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => this.handlePageChange(currentPage - 1)}>Previous</button>
                                    </li>
                                    {pageNumbers.map((number) => (
                                        <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => this.handlePageChange(number)}>
                                                {number}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => this.handlePageChange(currentPage + 1)}>Next</button>
                                    </li>
                                </ul>
                            </div>
                        </div>}
                </div>
            </>
        );
    }
}

export default DonorList;


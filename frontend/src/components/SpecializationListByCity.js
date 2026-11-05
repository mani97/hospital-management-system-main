// import React, { Component } from 'react';
// import { NavLink } from "react-router-dom";
// import AppointmentService from '../service/AppointmentService';
// import Card from 'react-bootstrap/Card';
// class SpecializationListByCity extends Component {

//     constructor(props) {
//         super(props)

//         this.state = {
//             specializations: [],
//             city: 'Pune',
//             message: null
//         }

//         this.search = this.search.bind(this);
//         this.searchFirst = this.searchFirst.bind(this);
//         this.onChange = this.onChange.bind(this);
//     }

//     componentDidMount() {
//         this.searchFirst();
//     }

//     searchFirst() {
//         AppointmentService.getSpecializationListByCity(this.state.city)
//             .then(response => {
//                 console.log(this.state.city);
//                 this.setState({ specializations: response.data });
//                 console.log(this.state.specializations);
//             })
//     }

//     search = e => {
//         e.preventDefault();

//         AppointmentService.getSpecializationListByCity(this.state.city)
//             .then(response => {
//                 console.log(this.state.city);
//                 this.setState({ specializations: response.data });
//                 console.log(this.state.specializations);
//             })
//     }

//     onChange = e => this.setState({ [e.target.name]: e.target.value });

//     render() {
//         return (
//             <>
//             <div className="mx-4 mt-4">
//             <Card>
//       <Card.Body>
//       <div className="container overflow-hidden">
//                     <div className="row my-3">
//                         <div className="col-sm-10">
//                             <h3 className="text-muted offset-6">Select Specialization</h3>
//                         </div>
//                         <div className="col-sm-2">
//                             <button className="btn btn-secondary text-uppercase offset-4" onClick={() => { this.props.history.push('./patientDashboard') }}>Go Back</button>
//                         </div>
//                     </div>
//                     <form>
//                         <div className="form-group row mt-3 justify-content-center">
//                             <label htmlFor="city" className="col-1 col-form-label" style={{fontWeight : "bold"}}>City : </label>
//                             <div className="col-5">
//                                 <input type="text" id="city" className="form-control" name="city" value={this.state.city} onChange={this.onChange} />
//                             </div>
//                         </div>
//                         <button className="btn btn-primary mt-3 offset-6" onClick={this.search}>Search</button>
//                     </form>

//                  {this.state.specializations.length===0?<h3>We will be in your city soon</h3>:   <table className="table my-3">
//                         <tbody>
//                             {
//                                 this.state.specializations.map(
//                                     (specialization, index) =>
//                                         <tr key={index}>
//                                             <td><ul><li>
//                                                 <NavLink className="btn btn-lg btn-outline-secondary text-decoration-none" to={{ pathname: '/doctor-list-patient', state: { city: this.state.city, specialization: specialization } }}>
//                                                     {specialization}
//                                                 </NavLink>
//                                             </li></ul></td>
//                                         </tr>
//                                 )
//                             }
//                         </tbody>
//                     </table>
// }
//                 </div>
//       </Card.Body>
//     </Card>
//             </div>
            
                
//             </>
//         )
//     }
// }

// export default SpecializationListByCity;

import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import AppointmentService from '../service/AppointmentService';
import Card from 'react-bootstrap/Card';
class SpecializationListByCity extends Component {

    constructor(props) {
        super(props)

        this.state = {
            specializations: [],
            city: 'Pune',
            message: null
        }

        this.search = this.search.bind(this);
        this.searchFirst = this.searchFirst.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.searchFirst();
    }

    searchFirst() {
        AppointmentService.getSpecializationListByCity(this.state.city)
            .then(response => {
                console.log(this.state.city);
                this.setState({ specializations: response.data });
                console.log(this.state.specializations);
            })
    }

    search = e => {
        e.preventDefault();

        AppointmentService.getSpecializationListByCity(this.state.city)
            .then(response => {
                console.log(this.state.city);
                this.setState({ specializations: response.data });
                console.log(this.state.specializations);
            })
    }

    onChange = e => this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <>
            <div className="mx-4 mt-4">
                <Card style={{backgroundColor:"aliceblue"}}>
                    <Card.Body>
                        <div className="container overflow-hidden">
                            <div className="row my-3">
                                <div className="col-md-6 offset-md-3 text-center">
                                    <h3 className="text-muted">Select Specialization</h3>
                                </div>
                                <div className="col-sm-4">
            <button
              className="btn btn-secondary text-uppercase "
              onClick={() => {
                this.props.history.goBack();
              }}
            >
              Go Back
            </button>
          </div>
                            </div>
                            <div className="row">
                                    
                                <div className="col-md-4 offset-md-4">
                                        
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="city" style={{ fontWeight: 'bold' }}>
                                                City:
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                className="form-control"
                                                name="city"
                                                value={this.state.city}
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="form-group text-center">
                                            <button className="btn btn-primary mt-3" onClick={this.search}>
                                                Search
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="row mt-3">
                                {this.state.specializations.length === 0 ? (
                                    <h3 className="text-center col-12">We will be in your city soon</h3>
                                ) : (
                                    this.state.specializations.map((specialization, index) => (
                                        <div className="col-md-4 mb-3" key={index}>
                                            <Card>
                                                <Card.Body className="text-center">
                                                    <NavLink
                                                        className="btn btn-lg btn-outline-secondary  text-decoration-none"
                                                        to={{
                                                            pathname: '/doctor-list-patient',
                                                            state: { city: this.state.city, specialization: specialization },
                                                        }}
                                                    >
                                                        {specialization}
                                                    </NavLink>
                                                </Card.Body>
                                            </Card>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
                
            </>
        )
    }
}

export default SpecializationListByCity;
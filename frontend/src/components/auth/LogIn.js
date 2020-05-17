import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { logIn } from '../../store/actions/authActions';
import '../templates/layout/Nav.css'

// const headerProps = {
//   icon: 'sign-in',
//   title: 'Log In'
// }

class LogIn extends Component {
  state = {
    email: '',
    password: ''
  }

  updateFields = (event) => {
    // grabs the id from one of the fields
    this.setState ({
      [event.target.id]: event.target.value
    })
  }

  handleClick = (event) => {
    // prevent default action from submitting - prevent to refresh the page
    // event.preventDefault();
    this.props.logIn(this.state);
  }

  renderForm() {
    const { authError, auth } = this.props
    if (auth.uid) return <Redirect to="/dashboard" />
    
    return (
      <div className="form h6 pt-2">
        <div className="row">
          <div className="col-4 pr-0">
            <div className="form-group">
              <input className='form-control' type='email' id='email' autoComplete='off' onChange={this.updateFields} required/>
              <label className='form-label-log'htmlFor='email'>
                <span className='content-name'>Email</span>
              </label>
            </div>
          </div>
          <div className="col-4 pr-0">
            <div className="form-group">
              <input className='form-control' type='password' id='password' autoComplete='off' onChange={this.updateFields} required/>
              <label className='form-label-log' htmlFor='password'>
                <span className='content-name'>Password</span>
              </label>
            </div>
          </div>
          <div className="col-3 form-group p-0">
            <div>
              {authError ? <p>{authError}</p> : null}
            </div>
            <Link to='/dashboard'>
              <button className="btn btn-primary" onClick={this.handleClick}>
                <i className="fa fa-sign-in mr-2" aria-hidden="true"></i>
              Log In
            </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (creds) => dispatch(logIn(creds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogIn);

import React from 'react';
import { connect } from 'react-redux';
import { verifyEmail } from '../../store/actions/authActions' 

import Main from '../templates/Main';

import '../templates/Main.css';
import '../templates/layout/Footer.css';

const headerProps = {
  icon: 'exclamation-triangle',
  title: 'Email not verified'
}

const VerifyEmail = (props) => {
  // const { auth } = props;

  // const handleClick = () => {
  //   if (!auth.emailVerified) {
  //     props.verifyEmail();
  //     alert("The link was sent with success.");
  //   } else {
  //     alert("The link was already sent. Please check your email inbox.");
  //   }
  // }

  return (
    <Main {...headerProps}>
      <div className='container bg-container'>
        <div className='container '>
          <i className="fa fa-exclamation-triangle" aria-hidden="true" />
          <div>Your email is not verified.</div>
          <div className='message'>To have full access on your account, you need to go to your email inbox and verify your email.</div>
          {/* <div className='button-container'>
            <button className='btn-subs mt-5 col-12 col-md-6' onClick={() => handleClick()}>Re-send verification email<span className='circle'></span></button>
          </div> */}
        </div>
      </div>
    </Main>
  )
}

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    verifyEmail: () => dispatch(verifyEmail())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
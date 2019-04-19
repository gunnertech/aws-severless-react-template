import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { withRouter, Redirect } from 'react-router'

class SignOut extends Component {
  state = {
    signedOut: false
  };

  componentDidMount() {
    new Promise(resolve => 
      this.setState({signedOut: true}, resolve)
    )
    .then(() => Auth.signOut())
  }

  render() {
    return (
      this.state.signedOut ? (
        <Redirect to="/"/>
      ) : (
        null
      )
    )
  }
}

export default withRouter(SignOut);
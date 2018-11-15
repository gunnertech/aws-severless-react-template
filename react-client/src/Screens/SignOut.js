import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { withRouter, Redirect } from 'react-router'

class SignOut extends Component {
  state = {
    signedOut: false
  };

  async componentDidMount() {
    try {
      await Auth.signOut();
    } catch(e) { 
      console.log("Error", e);
    }
    this.setState({signedOut: true});
  }

  render() {
    return (
      this.state.signedOut ? (
        <Redirect to="/splash"/>
      ) : (
        null
      )
    )
  }
}

export default withRouter(SignOut);
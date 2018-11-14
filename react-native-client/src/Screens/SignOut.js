import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

class DoSignOut extends Component {
  async componentDidMount() {
    try {
      await Auth.signOut();
    } catch(e) { 
      console.log("Error", e);
    }

    this.props.navigation.popToTop();

  }
  render = () => null
}


class SignOut extends Component {
  render() {
    return <DoSignOut navigation={this.props.navigation} />
  }
}

export default SignOut;
import { SignIn } from 'aws-amplify-react-native';

import {
  Auth,
  Cache
} from 'aws-amplify';



class MySignIn extends SignIn {
  async componentDidUpdate() {
      const signupInputs = await Cache.getItem('signupInputs');
      if(!!signupInputs && this.props.authState === 'signedUp') {
          Cache.removeItem('signupInputs');
          this.signIn()          
      }
      super.componentDidUpdate && super.componentDidUpdate();
  }

  signIn() {
    const { username, password } = this.state;
    Cache.getItem('signupInputs')
      .then(signupInputs => 
        Auth.signIn((username||(signupInputs||{}).username||"").toLowerCase(), password||(signupInputs||{}).password)
          .then(user => {
              const requireMFA = (user.Session !== null);
              if (user.challengeName === 'SMS_MFA') {
                  this.changeState('confirmSignIn', user);
              } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                  logger.debug('require new password', user.challengeParam);
                  this.changeState('requireNewPassword', user);
              } else {
                  this.checkContact(user);
              }
          })
          .catch(err => this.error(err))
      )
  }
}

export default MySignIn
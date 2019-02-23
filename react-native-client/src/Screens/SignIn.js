import { SignIn } from 'aws-amplify-react-native';

import {
  Auth,
} from 'aws-amplify';



class MySignIn extends SignIn {
  signIn() {
    const { username, password } = this.state;
    Auth.signIn((username||"").toLowerCase(), password)
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
        .catch(err => this.error(err));
  }
}

export default MySignIn
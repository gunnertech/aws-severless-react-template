import React from 'react';
import { I18n } from '@aws-amplify/core';

import { SignIn } from 'aws-amplify-react';

import {
  FederatedButtons,
} from 'aws-amplify-react';

import { Cache } from 'aws-amplify';

import {
  FormSection,
  Hint,
  FormField,
  Link,
  SectionFooterSecondaryContent,
  Button,
  SectionFooterPrimaryContent,
  InputLabel,
  Input,
  SectionHeader,
  SectionBody,
  SectionFooter
} from '../Overrides/AmplifyUI'


class MySignIn extends SignIn {
  async signIn(event) {
      if(this._signingIn) { return false; }
      this._signingIn = true;
    const signupInputs = Cache.getItem('signupInputs');
    if(!!signupInputs && this.props.authState === 'signedUp') {
        this.inputs = {...signupInputs, username: signupInputs.username || signupInputs.email};
        Cache.removeItem('signupInputs');
    }
    this.inputs.username = (this.inputs.username||"").toLowerCase()
    super.signIn(event);
    Cache.removeItem('signupInputs');
  }

  componentDidUpdate() {
      const signupInputs = Cache.getItem('signupInputs');
      if(!!signupInputs && this.props.authState === 'signedUp') {
          this.signIn({preventDefault: () => null})
        //   .then(() => setTimeout(() => window.location.reload(), 4000))
          
      }
      super.componentDidUpdate && super.componentDidUpdate();
  }

  showComponent(theme) {
    const { authState, federated, onStateChange, onAuthEvent } = this.props;
    // if (hide && hide.includes(SignIn)) { return null; }
    const hideSignUp = false; //!override.includes('SignUp') && hide.some(component => component === SignUp);
    const hideForgotPassword = false; //!override.includes('ForgotPassword') && hide.some(component => component === ForgotPassword);
    return (
        <FormSection theme={theme}>
            {
                !!Cache.getItem('signupInputs') &&
                <div style={{color: 'red'}}>Code confirmed! Please sign in.</div>
            }
            <SectionHeader theme={theme}>{I18n.get('Sign in to your account')}</SectionHeader>
            <SectionBody theme={theme}>
            <FederatedButtons
                        federated={federated}
                        theme={theme}
                        authState={authState}
                        onStateChange={onStateChange}
                        onAuthEvent={onAuthEvent}
                    />
                <FormField theme={theme}>
                    <InputLabel theme={theme}>{I18n.get('Username')} *</InputLabel>
                    <Input
                        autoFocus
                        placeholder={I18n.get('Enter your username')}
                        theme={theme}
                        key="username"
                        name="username"
                        onChange={this.handleInputChange}
                        value={(Cache.getItem('signupInputs')||{}).username || (Cache.getItem('signupInputs')||{}).email}
                    />
                </FormField>
                <FormField theme={theme}>
                    <InputLabel theme={theme}>{I18n.get('Password')} *</InputLabel>
                    <Input
                        placeholder={I18n.get('Enter your password')}
                        theme={theme}
                        key="password"
                        type="password"
                        name="password"
                        onChange={this.handleInputChange}
                        value={(Cache.getItem('signupInputs')||{}).password}
                    />
                    {
                        !hideForgotPassword && <Hint theme={theme}>
                            {I18n.get('Forget your password? ')}
                            <Link theme={theme} onClick={() => this.changeState('forgotPassword')}>
                                {I18n.get('Reset password')}
                            </Link>
                        </Hint>
                    }
                </FormField>

            </SectionBody>
            <SectionFooter theme={theme}>
                <SectionFooterPrimaryContent theme={theme}>
                    <Button theme={theme} onClick={this.signIn} disabled={this.state.loading}>
                        {I18n.get('Sign In')}
                    </Button>
                </SectionFooterPrimaryContent>
                {
                    !hideSignUp && <SectionFooterSecondaryContent theme={theme}>
                        {I18n.get('No account? ')}
                        <Link theme={theme} onClick={() => this.changeState('signUp')}>
                            {I18n.get('Create account')}
                        </Link>
                    </SectionFooterSecondaryContent>
                }
            </SectionFooter>
        </FormSection>
    );
  }
}

export default MySignIn
import React from 'react';

import { TouchableWithoutFeedback, ScrollView, View, Keyboard } from 'react-native'

import { SignUp } from 'aws-amplify-react-native';

import {
  I18n,
} from 'aws-amplify';

import {
  FormField,
  PhoneField,
  LinkCell,
  Header,
  ErrorRow,
  AmplifyButton
} from 'aws-amplify-react-native';


class MySignUp extends SignUp {
  showComponent(theme) {
    if (this.checkCustomSignUpFields()) {
      this.signUpFields = this.props.signUpConfig.signUpFields;
    }
    this.sortFields();
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView style={theme.section}>
              <Header theme={theme}>{I18n.get(this.header)}</Header>
              <View style={theme.sectionBody}>
              {
                  this.signUpFields.map((field) => {
                      return field.key !== 'phone_number' ?  (
                          <FormField
                              key = {field.key}
                              theme={theme}
                              type={field.type}
                              secureTextEntry={field.type === 'password' ? true: false}
                              onChangeText={(text) => {
                                  const stateObj = this.state;
                                  stateObj[field.key] = text;
                                  if(field.key === 'email') {
                                    stateObj['username'] = text;
                                  }
                                  this.setState(stateObj)
                                }
                              }
                              label={I18n.get(field.label)}
                              placeholder={I18n.get(field.placeholder)}
                              required={field.required}
                          />
                      ) : (
                          <PhoneField
                              theme={theme}
                              key = {field.key}
                              onChangeText={(text) => this.setState({ phone_number: text })}
                              label={I18n.get(field.label)}
                              placeholder={I18n.get(field.placeholder)}
                              keyboardType="phone-pad"
                              required={field.required}
                          />
                      )
                  })
              }
                  <AmplifyButton
                      text={I18n.get('Sign Up').toUpperCase()}
                      theme={theme}
                      onPress={this.signUp}
                      disabled={!this.state.email || !this.state.password || !this.state.name}
                  />
              </View>
              <View style={theme.sectionFooter}>
                  <LinkCell theme={theme} onPress={() => this.changeState('confirmSignUp')}>
                      {I18n.get('Confirm a Code')}
                  </LinkCell>
                  <LinkCell theme={theme} onPress={() => this.changeState('signIn')}>
                      {I18n.get('Sign In')}
                  </LinkCell>
              </View>
              <ErrorRow theme={theme}>{this.state.error}</ErrorRow>
          </ScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

export default MySignUp
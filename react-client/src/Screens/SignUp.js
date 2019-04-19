import React from 'react';
import { I18n } from '@aws-amplify/core';

import { SignUp } from 'aws-amplify-react';
import Auth from '@aws-amplify/auth';

import { Cache } from 'aws-amplify';

import {
  FormSection,
  SelectInput,
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

const countryDialCodes = [
  "+1",
  "+7",
  "+20",
  "+27",
  "+30",
  "+31",
  "+32",
  "+33",
  "+34",
  "+36",
  "+39",
  "+40",
  "+41",
  "+43",
  "+44",
  "+45",
  "+46",
  "+47",
  "+48",
  "+49",
  "+51",
  "+52",
  "+53",
  "+54",
  "+55",
  "+56",
  "+57",
  "+58",
  "+60",
  "+61",
  "+62",
  "+63",
  "+64",
  "+65",
  "+66",
  "+81",
  "+82",
  "+84",
  "+86",
  "+90",
  "+91",
  "+92",
  "+93",
  "+94",
  "+95",
  "+98",
  "+212",
  "+213",
  "+216",
  "+218",
  "+220",
  "+221",
  "+222",
  "+223",
  "+224",
  "+225",
  "+226",
  "+227",
  "+228",
  "+229",
  "+230",
  "+231",
  "+232",
  "+233",
  "+234",
  "+235",
  "+236",
  "+237",
  "+238",
  "+239",
  "+240",
  "+241",
  "+242",
  "+243",
  "+244",
  "+245",
  "+246",
  "+248",
  "+249",
  "+250",
  "+251",
  "+252",
  "+253",
  "+254",
  "+255",
  "+256",
  "+257",
  "+258",
  "+260",
  "+261",
  "+262",
  "+263",
  "+264",
  "+265",
  "+266",
  "+267",
  "+268",
  "+269",
  "+290",
  "+291",
  "+297",
  "+298",
  "+299",
  "+345",
  "+350",
  "+351",
  "+352",
  "+353",
  "+354",
  "+355",
  "+356",
  "+357",
  "+358",
  "+359",
  "+370",
  "+371",
  "+372",
  "+373",
  "+374",
  "+375",
  "+376",
  "+377",
  "+378",
  "+379",
  "+380",
  "+381",
  "+382",
  "+385",
  "+386",
  "+387",
  "+389",
  "+420",
  "+421",
  "+423",
  "+500",
  "+501",
  "+502",
  "+503",
  "+504",
  "+505",
  "+506",
  "+507",
  "+508",
  "+509",
  "+537",
  "+590",
  "+591",
  "+593",
  "+594",
  "+595",
  "+596",
  "+597",
  "+598",
  "+599",
  "+670",
  "+672",
  "+673",
  "+674",
  "+675",
  "+676",
  "+677",
  "+678",
  "+679",
  "+680",
  "+681",
  "+682",
  "+683",
  "+685",
  "+686",
  "+687",
  "+688",
  "+689",
  "+690",
  "+691",
  "+692",
  "+850",
  "+852",
  "+853",
  "+855",
  "+856",
  "+872",
  "+880",
  "+886",
  "+960",
  "+961",
  "+962",
  "+963",
  "+964",
  "+965",
  "+966",
  "+967",
  "+968",
  "+970",
  "+971",
  "+972",
  "+973",
  "+974",
  "+975",
  "+976",
  "+977",
  "+992",
  "+993",
  "+994",
  "+995",
  "+996",
  "+998",
];


class MySignUp extends SignUp {
    
  signUp() {
    const inviteInputs = Cache.getItem('inviteInputs') || {};
    this.inputs.username = (this.inputs.username||"").toLowerCase()
    // this.inputs.email = (this.inputs.email||inviteInputs.email||"").toLowerCase()
    this.inputs.name = (this.inputs.name||inviteInputs.name||"").toLowerCase()
    Cache.setItem('signupInputs', this.inputs);
    if (!this.inputs.dial_code) {
        this.inputs.dial_code = this.getDefaultDialCode();
    }
    const validation = this.validate();
    if (validation && validation.length > 0) {
      return this.error(`The following fields need to be filled out: ${validation.join(', ')}`);
    }
    if (!Auth || typeof Auth.signUp !== 'function') {
        throw new Error('No Auth module found, please ensure @aws-amplify/auth is imported');
    }

    let signup_info = {
        username: this.inputs.username || this.inputs.email,
        password: this.inputs.password,
        attributes: {
            
        }
    };

    const inputKeys = Object.keys(this.inputs);
    const inputVals = Object.values(this.inputs);

    inputKeys.forEach((key, index) => {
        if (!['username', 'password', 'checkedValue', 'dial_code'].includes(key)) {
          if (key !== 'phone_line_number' && key !== 'dial_code' && key !== 'error') {
            const newKey = `${this.needPrefix(key) ? 'custom:' : ''}${key}`;
            signup_info.attributes[newKey] = inputVals[index];
          } else if (inputVals[index]) {
              signup_info.attributes['phone_number'] = `${this.inputs.dial_code}${this.inputs.phone_line_number.replace(/[-()]/g, '')}`
          }
        }
    });

    Cache.removeItem('inviteInputs');

    Auth.signUp(signup_info).then((data) => {
        this.changeState('confirmSignUp', data.user.username)
    })
    .catch(err => this.error(err));
  }

  showComponent(theme) {
    // const { hide } = this.props;
    // if (hide && hide.includes(SignUp)) { return null; }
    if (this.checkCustomSignUpFields()) {
        this.signUpFields = this.props.signUpConfig.signUpFields;
    }
    this.sortFields();
    const inviteInputs = Cache.getItem('inviteInputs');
    return (
        <FormSection theme={theme}>
            <SectionHeader theme={theme}>{I18n.get(this.header)}</SectionHeader>
            <SectionBody theme={theme}>
                
                {
                    this.signUpFields.map((field) => {
                        return field.key !== 'phone_number' ? (
                            <FormField theme={theme} key={field.key}>
                            {
                                field.required ? 
                                <InputLabel theme={theme}>{I18n.get(field.label)} *</InputLabel> :
                                <InputLabel theme={theme}>{I18n.get(field.label)}</InputLabel>
                            }
                                <Input
                                    autoFocus={
                                        this.signUpFields.findIndex((f) => {
                                            return f.key === field.key
                                        }) === 0 ? true : false
                                    }
                                    placeholder={I18n.get(field.placeholder)}
                                    theme={theme}
                                    type={field.type}
                                    name={field.key}
                                    key={field.key}
                                    onChange={this.handleInputChange}
                                    disabled={!!(inviteInputs && inviteInputs[field.key])}
                                    value={inviteInputs ? (inviteInputs[field.key] || undefined) : undefined}
                                />
                                {field.key === 'password' && <div style={{color: 'red'}}>Must be at least 7 characters long with an upper and lower case letter, number and one special character (i.e. !$%^)</div>}
                            </FormField>
                        ) : (
                            <FormField theme={theme} key="phone_number">
                                {
                                    field.required ? 
                                    <InputLabel theme={theme}>{I18n.get(field.label)} *</InputLabel> :
                                    <InputLabel theme={theme}>{I18n.get(field.label)}</InputLabel>
                                }
                                <SelectInput theme={theme}>
                                    <select name="dial_code" defaultValue={this.getDefaultDialCode()} 
                                    onChange={this.handleInputChange}>
                                        {countryDialCodes.map(dialCode =>
                                            <option key={dialCode} value={dialCode}>
                                                {dialCode}
                                            </option>
                                        )}
                                    </select>
                                    <Input
                                        placeholder={I18n.get(field.placeholder)}
                                        theme={theme}
                                        type="tel"
                                        id="phone_line_number"
                                        key="phone_line_number"
                                        name="phone_line_number"
                                        onChange={this.handleInputChange}
                                    />
                                </SelectInput>
                            </FormField>
                        )
                    })
                }
            </SectionBody>
            <SectionFooter theme={theme}>
                <SectionFooterPrimaryContent theme={theme}>
                    <Button onClick={this.signUp} theme={theme}>
                        {I18n.get('Create Account')}
                    </Button>
                </SectionFooterPrimaryContent>
                <SectionFooterSecondaryContent theme={theme}>
                    {I18n.get('Have an account? ')}
                    <Link theme={theme} onClick={() => this.changeState('signIn')}>
                        {I18n.get('Sign in')}
                    </Link>
                </SectionFooterSecondaryContent>
            </SectionFooter>
        </FormSection>
    );
}
}

export default MySignUp
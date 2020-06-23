import React, { useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import AddToHomescreen from 'react-add-to-homescreen';
import { App } from "gunner-react/web"

import Router from "./Routes"


import { I18n } from 'aws-amplify';

import awsmobile from './aws-exports';
import Modal from './Components/Modal';
import useFindUser from "react-shared/Hooks/useFindUser"
import useCreateUser from "react-shared/Hooks/useCreateUser"


const authScreenLabels = {
  en: {
    "Username": "Email",
    "Enter your username": "Enter your email",
    'Sign Up': 'Create new account',
    'Sign Up Account': 'Create a new account',
    'Confirm Sign Up': 'Confirm Sign Up by entering the code that was sent to your email address'
  }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);


const AddToHomeScreenView = () => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  return (
    <>
      <Modal
        title="Install App"
        body={
          <video width="320" height="240" controls style={{width: '100%', height: 'auto'}} >
            <source src={require(`../src/assets/videos/add.mp4`)} type="video/mp4" />
          </video>
        }
        onClose={() => setShowHelpModal(false)}
        submitting={false}
        opened={!!showHelpModal}
        saveButton={false}
      />

      <AddToHomescreen title="Install SimpliSurvey" icon="" onAddToHomescreenClick={() => setShowHelpModal(true)} />
    </>
  )
}


export default () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = createMuiTheme({
    typography: {
      useNextVariants: true,
      // fontSize: 18,
      // subtitle1: {
      //   color: "#EF4035" 
      // }
    },
    overrides: {
      MuiSpeedDialAction: {
        staticTooltipLabel: {
          whiteSpace: "nowrap"
        }
      },
      MuiTypography: {
        h1: {
          fontSize: "2rem"
        },
        h3: {
          fontSize: "1.5rem"
        }
      },
      MuiSpeedDial: {
        directionUp: {
          position: 'absolute',
          bottom: 64,
          right: 16,
        }
      },
      MuiAppBar: {
        root: {
          zIndex: 1000
        }
      },
      MuiDrawer: {
        paper: {
          zIndex: 900
        }
      },
      MuiButton: {
        fullWidth: {
          marginTop: 16,
          marginBottom: 16
        }
      },
      MuiFormControl: {
        root: {
          marginTop: 16,
          marginBottom: 16
        }
      },
      MuiTabs: {
        indicator: {
          backgroundColor: "white"
        }
      }
    },
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: "#b78df9"
      },
      secondary: {
        main: "#b78df9"
      }
    }
  });

  return (
    <App 
      theme={theme} 
      useFindUser={useFindUser}
      useCreateUser={useCreateUser}
      sentryUrl={process.env.REACT_APP_sentry_url.replace("<sentry-url>","")} 
      amplifyConfig={awsmobile} 
      ga={process.env.REACT_APP_GA}
    >
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router />
        <AddToHomeScreenView />
      </MuiPickersUtilsProvider>
    </App>
  )

}

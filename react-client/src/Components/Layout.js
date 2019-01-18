import React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MainNavigation from '../Containers/MainNavigation';
import Container from './Container';
import withRoot from '../Hocs/withRoot';
import withNotifications from '../Hocs/withNotifications';



const styles = theme => ({
  '@global': {
    '.embed-youtube iframe': {
      'max-width': '100%'
    },
    'div[class*="Toast__toast"]': {
      zIndex: "2000"
    },
    '.Toast__toast___2YWKB': {
      zIndex: "2000"
    },
    'a': {
      'color': theme.palette.secondary.main,
      'text-decoration': 'none'
    },
    'li, p': {
      'color': 'rgba(0, 0, 0, 0.87)',
      'font-size': '1.125rem',
      'font-weight': 400,
      'font-family': '"Roboto", "Helvetica", "Arial", sans-serif',
      'line-height': '1.46429em'
    },
    'p > img': {
      maxWidth: "100%",
      height: "auto"
    },
    '*': {
      'font-family': '"Roboto", "Helvetica", "Arial", sans-serif'
    }, 
    'strong': {
      ...theme.typography.body1
    },
    'h3': {
      ...theme.typography.subheading1,
      color: theme.typography.h2.color
    }
  },
  [theme.breakpoints.up('md')]: {
    '@global': {
      '[class*="Toast__toast"]': {
        zIndex: "2000"
      },
      '.Toast__toast___2YWKB': {
        zIndex: "2000"
      },
      'body': {
        // 'overflowY': 'hidden'
      }
    },
  },
});



  


const Template = ({ navigate, location, data, children, showNav, notifications }) => console.log(notifications) ||
  <Container>
    <Helmet
      encodeSpecialCharacters={true}
      title="SimpliSurvey"
      meta={[
        { name: `description`, content: `TODO` },
        { name: `keywords`, content: `TODO` },
        { name: 'og:url', content: `TODO${location.pathname}` }
      ]}
      link={[
        { rel: "canonical", value: `TODO${location.pathname}`}
      ]}
    />
    {
      !showNav ? (
        children  
      ) : (
        <MainNavigation notifications={notifications} data={ data }>
          {children}
        </MainNavigation>
      )
    }
  </Container>
  

const TemplateWithStyles = withRoot(
  withRouter(
    withNotifications()(
      withStyles(styles)(Template)
    )
  )
);

export default TemplateWithStyles;
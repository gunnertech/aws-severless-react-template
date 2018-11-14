import React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import MainNavigation from '../Containers/MainNavigation';
import Container from './Container';
import withRoot from '../Hocs/withRoot';



const styles = theme => ({
  '@global': {
    '.embed-youtube iframe': {
      'max-width': '100%'
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
      ...theme.typography.body2
    },
    'h3': {
      ...theme.typography.subheading,
      color: theme.typography.display3.color
    }
  },
  [theme.breakpoints.up('md')]: {
    '@global': {
      'body': {
        // 'overflowY': 'hidden'
      }
    },
  },
});



  


const Template = ({ navigate, location, data, children }) => 
  <Container>
    <Helmet
      encodeSpecialCharacters={true}
      title="Gunner Technology"
      meta={[
        { name: `description`, content: `TODO` },
        { name: `keywords`, content: `TODO` },
        { name: 'og:url', content: `TODO${location.pathname}` }
      ]}
      link={[
        { rel: "canonical", value: `TODO${location.pathname}`}
      ]}
    />
    <MainNavigation data={ data }>
      {children}
    </MainNavigation>
  </Container>
  

const TemplateWithStyles = withRoot(
  withRouter(
    withStyles(styles)(Template)
  )
);

export default TemplateWithStyles;
import React from "react";
import { Helmet } from "react-helmet";
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import MainNavigation from '../MainNavigation';


  


const LayoutView = ({location, data, children, showNav, classes}) =>
  <>
    <CssBaseline />
    <Helmet
      encodeSpecialCharacters={true}
      title="<project-name>"
      meta={[
        { name: `description`, content: `<project-name>` },
        { name: `keywords`, content: `<project-name>` },
        { name: 'og:url', content: `${process.env.REACT_APP_base_url}${location.pathname}` }
      ]}
      link={[
        { rel: "canonical", value: `${process.env.REACT_APP_base_url}${location.pathname}`}
      ]}
    />
    <Container style={{paddingLeft: 0, paddingRight: 0}} fixed={false} maxWidth={false}>
      {
        !showNav ? (
          children  
        ) : (
          <MainNavigation data={ data }>
            {children}
          </MainNavigation>
        )
      }
    </Container>
  </>
  

export default withRouter(LayoutView);
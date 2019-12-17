import React from "react";
import { useLocation } from 'react-router-dom'

import useStyles from "./LayoutStyles";
import LayoutView from "./LayoutView"


const LayoutContainer = ({children, showNav}) => {
  const classes = useStyles();
  const location = useLocation();
  return (
    <LayoutView showNav={showNav} classes={classes} location={location}>
      {children}
    </LayoutView>
  )
}

export default LayoutContainer;
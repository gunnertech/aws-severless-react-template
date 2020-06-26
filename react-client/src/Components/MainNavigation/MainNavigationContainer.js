import React, { useState, useContext } from "react";

import useStyles from "./MainNavigationStyles";
import MainNavigationView from "./MainNavigationView"
import { CurrentUserContext } from "gunner-react";
import { AppBarContext } from "gunner-react/web";

const MainNavigationContainer = ({children}) => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);
  const appBar = useContext(AppBarContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MainNavigationView appBar={appBar} handleDrawerToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} currentUser={currentUser} classes={classes}>
      {children}
    </MainNavigationView>
  )
}

export default MainNavigationContainer;
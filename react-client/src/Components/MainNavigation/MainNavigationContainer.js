import React, { useState, useContext } from "react";

import useStyles from "./MainNavigationStyles";
import MainNavigationView from "./MainNavigationView"
import { CurrentUserContext } from "../../Contexts/CurrentUser";

const MainNavigationContainer = ({children}) => {
  const classes = useStyles();
  const currentUser = useContext(CurrentUserContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <MainNavigationView handleDrawerToggle={() => setMobileOpen(!mobileOpen)} mobileOpen={mobileOpen} currentUser={currentUser} classes={classes}>
      {children}
    </MainNavigationView>
  )
}

export default MainNavigationContainer;
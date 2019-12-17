import React from 'react';

const CurrentUserContext = React.createContext();

const CurrentUserProvider = ({children, currentUser}) => 
  <CurrentUserContext.Provider value={currentUser}>      
    {children}
  </CurrentUserContext.Provider>

export { CurrentUserContext, CurrentUserProvider };


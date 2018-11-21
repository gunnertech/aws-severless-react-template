import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import CurrentUserContext from '../Contexts/CurrentUser';

const withCurrentUser = () => {
  return WrappedComponent => {
    class AuthedComponent extends React.PureComponent {
      render() {
        return (
          <CurrentUserContext.Consumer>
            {({currentUser}) => console.log("CURRENT USER HERE", !!currentUser) || <WrappedComponent {...this.props} currentUser={currentUser} />}
          </CurrentUserContext.Consumer>
        );
      }
    }
  
    hoistNonReactStatics(AuthedComponent, WrappedComponent);
  
    return AuthedComponent;
  }
}

export default withCurrentUser;
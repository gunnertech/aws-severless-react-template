import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { CurrentUserConsumer } from '../Contexts/CurrentUser';

const withCurrentUser = () => {
  return WrappedComponent => {
    class CurrentUserComponent extends React.Component {
      render() {
        return (
          <CurrentUserConsumer>
            {({currentUser, refreshCurrentUser}) => <WrappedComponent {...this.props} currentUser={currentUser} refreshCurrentUser={refreshCurrentUser} />}
          </CurrentUserConsumer>
        );
      }
    }
  
    hoistNonReactStatics(CurrentUserComponent, WrappedComponent);
  
    return CurrentUserComponent;
  }
}

export default withCurrentUser;
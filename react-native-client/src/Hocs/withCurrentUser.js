import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { CurrentUserConsumer } from '../Contexts/CurrentUser';

const withCurrentUser = () => {
  return WrappedComponent => {
    class CurrentUserComponent extends React.PureComponent {
      render() {
        return (
          <CurrentUserConsumer>
            {({currentUser, setCurrentUser}) => <WrappedComponent {...this.props} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          </CurrentUserConsumer>
        );
      }
    }
  
    hoistNonReactStatics(CurrentUserComponent, WrappedComponent);
  
    return CurrentUserComponent;
  }
}

export default withCurrentUser;
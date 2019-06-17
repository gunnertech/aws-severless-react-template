import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { CurrentUserConsumer } from '../Contexts/CurrentUser';

const withCurrentUser = () => {
  return WrappedComponent => {
    class CurrentUserComponent extends React.Component {
      render() {
        return (
          <CurrentUserConsumer>
            {value => <WrappedComponent {...this.props} currentUser={value} />}
          </CurrentUserConsumer>
        );
      }
    }
  
    hoistNonReactStatics(CurrentUserComponent, WrappedComponent);
  
    return CurrentUserComponent;
  }
}

export default withCurrentUser;
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { NotificationsConsumer } from '../Contexts/Notifications';

const withNotifications = () => {
  return WrappedComponent => {
    class NotificationsComponent extends React.Component {
      render() {
        return (
          <NotificationsConsumer>
            {({notifications}) => <WrappedComponent {...this.props} notifications={notifications} />}
          </NotificationsConsumer>
        );
      }
    }
  
    hoistNonReactStatics(NotificationsComponent, WrappedComponent);
  
    return NotificationsComponent;
  }
}

export default withNotifications;
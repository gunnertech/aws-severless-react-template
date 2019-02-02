import React from 'react';

const Notifications = React.createContext({
  
});

export class NotificationsProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: this.props.notifications || []
    };
  }

  
  render() {
    return (
      <Notifications.Provider
        value={{
          notifications: this.props.notifications
        }}
      >      
        {this.props.children}
      </Notifications.Provider>
    );
  }
}

export const NotificationsConsumer = Notifications.Consumer;
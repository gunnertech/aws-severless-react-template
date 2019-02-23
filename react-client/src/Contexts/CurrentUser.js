import React from 'react';

const CurrentUser = React.createContext({
});

export class CurrentUserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: props.currentUser || null
    };
  }

  render() {
    const { currentUser, children } = this.props;
    return (
      <CurrentUser.Provider
        value={{
          currentUser: currentUser
        }}
      >      
        {children}
      </CurrentUser.Provider>
    );
  }
}

export const CurrentUserConsumer = CurrentUser.Consumer;
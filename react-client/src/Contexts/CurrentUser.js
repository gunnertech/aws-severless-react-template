import React from 'react';

const CurrentUser = React.createContext({
});

export class CurrentUserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser || null
    };
  }

  render() {
    return (
      <CurrentUser.Provider
        value={{
          currentUser: this.props.currentUser
        }}
      >      
        {this.props.children}
      </CurrentUser.Provider>
    );
  }
}

export const CurrentUserConsumer = CurrentUser.Consumer;
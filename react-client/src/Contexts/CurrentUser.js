import React from 'react';

const CurrentUser = React.createContext({
  setCurrentUser: currentUser => currentUser
});

export class CurrentUserProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: this.props.currentUser || null
    };
  }

  setCurrentUser = currentUser =>
    this.setState({
      currentUser
    });

  render() {
    return (
      <CurrentUser.Provider
        value={{
          setCurrentUser: this.setCurrentUser,
          currentUser: this.props.currentUser
        }}
      >      
        {this.props.children}
      </CurrentUser.Provider>
    );
  }
}

export const CurrentUserConsumer = CurrentUser.Consumer;
import React from 'react';

const CurrentUser = React.createContext({
  setCurrentUser: currentUser => currentUser
});

export class CurrentUserProvider extends React.PureComponent {
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
          currentUser: this.state.currentUser
        }}
      >      
        {this.props.children}
      </CurrentUser.Provider>
    );
  }
}

export const CurrentUserConsumer = CurrentUser.Consumer;
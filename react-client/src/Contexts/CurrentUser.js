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

<<<<<<< HEAD
=======

>>>>>>> cody
  render() {
    return (
      <CurrentUser.Provider
        value={{
<<<<<<< HEAD
          currentUser: this.props.currentUser
=======
          currentUser: this.props.currentUser,
          refreshCurrentUser: this.props.refreshCurrentUser
>>>>>>> cody
        }}
      >      
        {this.props.children}
      </CurrentUser.Provider>
    );
  }
}

export const CurrentUserConsumer = CurrentUser.Consumer;
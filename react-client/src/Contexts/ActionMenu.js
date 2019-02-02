import React, { Component } from 'react';

const ActionMenu = React.createContext({
  setActionMenu: element => element
});

export class ActionMenuProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      element: this.props.element || null
    };
  }

  setActionMenu = element => {
    this.setState({
      element
    });
  };

  render() {
    return (
      <ActionMenu.Provider
        value={{
          setActionMenu: this.setActionMenu,
          Element: this.state.element
        }}
      >      
        {this.props.children}
      </ActionMenu.Provider>
    );
  }
}

export const ActionMenuConsumer = ActionMenu.Consumer;
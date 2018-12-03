import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { ActionMenuConsumer } from '../Contexts/ActionMenu';

const withActionMenu = () => {
  return WrappedComponent => {
    class ActionMenuComponent extends React.Component {
      render() {
        return (
          <ActionMenuConsumer>
            {({setActionMenu}) => <WrappedComponent {...this.props} setActionMenu={setActionMenu} />}
          </ActionMenuConsumer>
        );
      }
    }
  
    hoistNonReactStatics(ActionMenuComponent, WrappedComponent);
  
    return ActionMenuComponent;
  }
}

export default withActionMenu;
import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { LayoutConsumer } from '../Contexts/Layout';

const withLayout = () => {
  return WrappedComponent => {
    class LayoutComponent extends React.Component {
      render() {
        return (
          <LayoutConsumer>
            {({showNav, hideNav}) => <WrappedComponent {...this.props} showNav={showNav} hideNav={hideNav} />}
          </LayoutConsumer>
        );
      }
    }
  
    hoistNonReactStatics(LayoutComponent, WrappedComponent);
  
    return LayoutComponent;
  }
}

export default withLayout;
import React from 'react';
import LayoutComponent from '../Components/Layout'

const Layout = React.createContext({
  showNav: () => null,
  hideNav: () => null
});

export class LayoutProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNav: this.props.showNav
    };
  }

  showNav = () => 
    this.setState({
      showNav: true
    });
  
  hideNav = () => 
    this.setState({
      showNav: false
    });

  render() {
    return (
      <Layout.Provider
        value={{
          showNav: this.showNav,
          hideNav: this.hideNav
        }}
      >
        <LayoutComponent showNav={this.state.showNav}>
          {this.props.children}
        </LayoutComponent>
      </Layout.Provider>
    );
  }
}

export const LayoutConsumer = Layout.Consumer;
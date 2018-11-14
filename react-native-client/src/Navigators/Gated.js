import React from 'react';
import { createStackNavigator, createDrawerNavigator, SafeAreaView } from 'react-navigation';
import { Drawer } from 'react-native-material-ui';
import { withAuthenticator } from 'aws-amplify-react-native';

// import AmplifyTheme from '../Styles/amplifyTheme'; theme={AmplifyTheme}
import Home from '../Screens/Home';


const screens = {
  Home: {
    screen: createStackNavigator({
      Home,
    })
  }
}

class DrawerComponent extends React.Component {
  state = {
    active: 'Home'
  }

  mapNavItem(item) {
    return (
      Object.assign(({
        "Home": { icon: 'home', value: 'Home' },
      }[item.key] || {}), {
        onPress: () => 
          this.setState({
            active: item.key
          }, () => this.props.navigation.navigate(item.key) )
        ,
        active: (this.state.active === item.key)
      })
    )
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Drawer>
          <Drawer.Section
            items={this.props.items.map(item => this.mapNavItem(item)).filter(item => !!item.value)}
          />
        </Drawer>
      </SafeAreaView>
      );
  }
}

class GatedComponent extends React.Component {
  render() {
    return (
      this.props.children
    )
  }
}

const DrawerNavigator = createDrawerNavigator(screens, {
  contentComponent: DrawerComponent,
  drawerWidth: 300,
  initialRouteName: 'Home'
});

const GatedComponentWithAuth = withAuthenticator(GatedComponent, false);

class GatedNavigator extends React.Component {
  static router = DrawerNavigator.router;

  render() {
    return (
      <GatedComponentWithAuth
        
      >
        <DrawerNavigator
          navigation={this.props.navigation}
        />
      </GatedComponentWithAuth>
    );
  }
}

export default GatedNavigator;
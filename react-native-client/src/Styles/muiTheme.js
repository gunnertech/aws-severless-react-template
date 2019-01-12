import React from 'react';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { StyleSheet } from 'react-native';

import { spacing, fonts } from './amplifyTheme';

const uiTheme = {
  palette: {
    primaryColor: "#b78df9", //COLOR.blue700,
    accentColor: COLOR.lightBlue300,
    canvasColor: COLOR.grey100
  },
  spacing: {
    ...spacing
  },
  fonts: {
    ...fonts
  },
  card: {
    container: {
      backgroundColor: COLOR.white
    }
  },
  toolbar: {
    container: {
      ...ifIphoneX({paddingTop: spacing.xl, height: (56 + spacing.xl)}, {paddingTop: spacing.md})
    }
  }
};

const withMuiTheme = styles => {
  return WrappedComponent => {
    class ThemedComponent extends React.PureComponent {
      render() {
        return (
          <ThemeContext.Consumer>
            {theme => <WrappedComponent {...this.props} classes={StyleSheet.create(styles(theme))} theme={theme} />}
          </ThemeContext.Consumer>
        );
      }
    }
  
    hoistNonReactStatics(ThemedComponent, WrappedComponent);
  
    return ThemedComponent;
  }
}

export default uiTheme;

export { withMuiTheme };
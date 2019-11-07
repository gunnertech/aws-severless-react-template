import React from 'react';
// import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { StyleSheet, Dimensions } from 'react-native';

import getElementsTheme from './elementsTheme';
import getAmplifyTheme from './amplifyTheme';

const oliveGreen = '#94A545';
const burgundy = '#8A2529';
const black = '#231f20';

const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('screen').height,
  screenWidth: Dimensions.get('screen').width
}


const fonts = {
  sm: 12,
  md: 18,
  lg: 24,
  primary: 'Cochin',
  bold: 'bold'
}

const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
}

const uiTheme = {
  palette: {
    primaryColor: "#b78df9", //COLOR.blue700,
    // accentColor: COLOR.lightBlue300,
    // canvasColor: COLOR.grey100
  },
  dimensions: {
    ...dimensions
  },
  spacing: {
    ...spacing
  },
  fonts: {
    ...fonts
  },
  card: {
    container: {
      // backgroundColor: COLOR.white
    }
  },
  toolbar: {
    container: {
      ...ifIphoneX({paddingTop: spacing.xl, height: (56 + spacing.xl)}, {paddingTop: spacing.md})
    }
  }
};

const combinedTheme = {
  ...uiTheme,
  ...getAmplifyTheme(getElementsTheme(uiTheme)),
}


export default combinedTheme;




// export default {
//   spacing,
//   typography,
//   iconSet: 'MaterialIcons',
//   fontFamily: 'Roboto',
//   palette: {
//     // main theme colors
//     primaryColor: blue500,
//     accentColor: red500,
//     // text color palette
//     primaryTextColor: Color(black)
//       .alpha(0.87)
//       .toString(),
//     secondaryTextColor: Color(black)
//       .alpha(0.54)
//       .toString(),
//     alternateTextColor: white,
//     // backgournds and borders
//     canvasColor: white,
//     borderColor: Color(black)
//       .alpha(0.12)
//       .toString(),
//     // https://material.google.com/style/color.html#color-text-background-colors
//     disabledColor: Color(black)
//       .alpha(0.38)
//       .toString(),
//     disabledTextColor: Color(black)
//       .alpha(0.26)
//       .toString(),
//     activeIcon: Color(black)
//       .alpha(0.54)
//       .toString(),
//     inactiveIcon: Color(black)
//       .alpha(0.38)
//       .toString(),
//     // pickerHeaderColor: cyan500,
//     // clockCircleColor: faintBlack,
//     // shadowColor: fullBlack,
//   },
// };
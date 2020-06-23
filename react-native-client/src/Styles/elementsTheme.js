const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
}

const grey1 = "#666666";
const grey3Light = "#86939e";

const getElementsTheme = ({navTheme, scheme}) => ({
  ...navTheme,
  colors: {
    ...navTheme.colors,
    primary: '#50b44d',
    // text: scheme === 'dark' ? 'white' : 'black',
    grey1,
    textMuted: scheme === 'dark' ? '#898989' : grey3Light,
  },
  spacing,
  Input: {
    inputStyle: {
      color: scheme === 'dark' ? 'white' : 'black',
    }
  },
  Text: {
    style: {
      color: !!navTheme.dark ? navTheme.colors.text : grey1,
    },
    h4Style: {
      color: !!navTheme.dark ? navTheme.colors.text : grey1,
      fontSize: 16
    },
    h3Style: {
      color: !!navTheme.dark ? navTheme.colors.text : grey1,
      fontSize: 20
    }
  },
  ListItem: {
    containerStyle: {
      backgroundColor: navTheme.colors.card,
      borderColor: navTheme.colors.border,
    }
  },
  Divider: {
    style: {
      backgroundColor: scheme === 'dark' ? '#898989' : '#e1e8ee',
    }
  },
  ButtonGroup: {
    innerBorderStyle: {
      color: navTheme.colors.border
    },
    containerStyle: {
      borderColor: navTheme.colors.border
    },
    buttonStyle: {
      backgroundColor: navTheme.colors.card
    }
  },
  Card: {
    containerStyle: {
      backgroundColor: navTheme.colors.card,
      borderColor: navTheme.colors.border,
    }
  },
  CheckBox: {
    textStyle: {
      color: navTheme.colors.text,
    },
    containerStyle: {
      backgroundColor: navTheme.colors.card,
      borderColor: navTheme.colors.border,
      marginLeft: 0,
      marginRight: 0
    }
  }
  // Header: {
  //   containerStyle:{
  //     backgroundColor: muiStyles.palette.headerBackgroundColor,
  //     justifyContent: 'space-around',
  //   }
  // }
})

export default getElementsTheme;

/// default elements theme
// export default {
//   primary: '#2089dc',
//   secondary: '#8F0CE8',
//   grey0: '#393e42',
//   grey1: '#43484d',
//   grey2: '#5e6977',
//   grey3: '#86939e',
//   grey4: '#bdc6cf',
//   grey5: '#e1e8ee',
//   greyOutline: '#bbb',
//   searchBg: '#303337',
//   success: '#52c41a',
//   error: '#ff190c',
//   warning: '#faad14',
//   disabled: 'hsl(208, 8%, 90%)',
//   // Darker color if hairlineWidth is not thin enough
//   divider: StyleSheet.hairlineWidth < 1 ? '#bcbbc1' : 'rgba(0, 0, 0, 0.12)',
//   platform: {
//     ios: {
//       primary: '#007aff',
//       secondary: '#5856d6',
//       success: '#4cd964',
//       error: '#ff3b30',
//       warning: '#ffcc00',
//     },
//     android: {
//       primary: '#2196f3',
//       secondary: '#9C27B0',
//       success: '#4caf50',
//       error: '#f44336',
//       warning: '#ffeb3b',
//     },
//   },
// };
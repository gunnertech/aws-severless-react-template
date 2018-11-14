import { StyleSheet, Dimensions } from 'react-native';

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

const colors  = {
  primary: '#2089dc',
  secondary: '#254B5A',
  tertiary: '#5DA6A7',
  error: 'red',
  white: 'white',
  transparent: 'rgba(0,0,0,0.75)',
  gray: '#e1e8ee',
  black: 'black',
  success: 'green',
  darkGray: 'gray'
}

const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('screen').height,
  screenWidth: Dimensions.get('screen').width
}

const baseStyles = {
    simpleContainer: {
      flex: 1,
      flexDirection: 'column',
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingTop: 20,
      width: '100%',
    },
    section: {
      flex: 1,
      width: '100%',
    },
    sectionHeader: {
    },
    sectionHeaderText: {
      width: '100%',
      padding: 10,
      textAlign: 'center',
      backgroundColor: '#007bff',
      color: '#ffffff',
      fontSize: 20,
      fontWeight: '500'
    },
    sectionFooter: {
      width: '100%',
      marginTop: 15,
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    sectionFooterLink: {
      fontSize: 14,
      color: '#007bff',
      alignItems: 'baseline',
      textAlign: 'center'
    },
    sectionBody: {
    },
    cell: {
      flex: 1,
      width: '50%'
    },
    errorRow: {
      flex: 1,
    },
    erroRowText: {
      margin: 8,
      marginTop: 16,
      color: 'red'
    },

    photo: {
      width: '100%'
    },
    album: {
      width: '100%'
    },

    a: {
    },
    button: {
      backgroundColor: '#2089dc'
    },

    input: {
      margin: 6,
      color: 'white'
    }
};
 

const createStyles = (overrides = {}) => StyleSheet.create({...baseStyles, ...overrides});
const AmplifyTheme = StyleSheet.create(baseStyles);

export default AmplifyTheme;

export {dimensions, createStyles, colors, fonts, spacing};

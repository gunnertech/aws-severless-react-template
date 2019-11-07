import { useContext } from 'react'
import { ThemeContext } from 'react-native-elements';

const makeStyles = func => {

  return () => {
    const { theme } = useContext(ThemeContext);
    return func(theme);
  }
}

export default makeStyles;
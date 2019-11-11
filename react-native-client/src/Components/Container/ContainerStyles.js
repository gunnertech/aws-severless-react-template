import { StyleSheet } from 'react-native'
import makeStyles from '../../Hooks/makeStyles';

export default useStyles = makeStyles(theme => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: theme.palette.canvasColor
  }
}));
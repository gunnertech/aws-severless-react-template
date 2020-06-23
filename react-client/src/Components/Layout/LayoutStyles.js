import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(theme => ({
  '@global': {
    html: {
      fontSize: theme.typography.htmlFontSize
    },
    'a': {
      'color': theme.palette.secondary.main,
      'text-decoration': 'none'
    },
    '.add-to-home-banner': {
      backgroundColor: "black !important"
    },
    // 'li, p': {
    //   'color': 'rgba(0, 0, 0, 0.87)',
    //   'font-size': '1.125rem',
    //   'font-weight': 400,
    //   'font-family': '"Roboto", "Helvetica", "Arial", sans-serif',
    //   'line-height': '1.46429em'
    // },
    '*': {
      fontSize: theme.typography.fontSize,
      color: theme.palette.text.primary
    }, 
    'strong': {
      ...theme.typography.body1,
      fontWeight: theme.typography.fontWeightBold
    },
    // 'h3': {
    //   ...theme.typography.subheading1,
    //   color: theme.typography.h2.color
    // }
  },
  container: {
    paddingLeft: 0,
    paddingRight: 0
  }
}));

import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 248;
const navStyle = 'vertical'; //vertical or horizontal;

export default makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  link: {
    color: theme.palette.secondary.main
  },
  appBar: {
    zIndex: `1400 !important`,
    position: 'fixed',
    [theme.breakpoints.up('md')]: {
      width: `100%`,
    },
  },
  logo: {
    height: '50px',
    width: 'auto',
    marginTop: `${theme.spacing(0.5)}px`,
    marginLeft: `${theme.spacing(1)}px`
  },
  logoLink: {
    flexGrow: 1
  },
  flex: {
    flex: 1,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: navStyle === 'horizontal' ? 0 : drawerWidth,
      position: 'fixed',
      overflowY: 'hidden',
      '&:hover': {
        overflowY: 'auto',
      },
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      marginLeft: navStyle === 'horizontal' ? 0 : drawerWidth,
    },
  },
  footer: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    margin: theme.spacing(-4),
    marginTop: theme.spacing(10),
    // marginBottom: theme.spacing(10),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.dark
  },
  footerText: {
    color: theme.palette.primary.contrastText
  },
  social: {
    alignItems: 'center', 
    padding: 0
  },
  socialItem: {
    listStyleType: 'none', 
    display: 'inline-block',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  testimonialWrapper: {
    marginBottom: theme.spacing(10)
  }
}));

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
// import Divider from '@material-ui/core/Divider';
import { ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';
// import { ListSubheader } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';

import AccountKeyIcon from 'mdi-material-ui/AccountKey'


import withCurrentUser from '../Hocs/withCurrentUser';
import { ActionMenuConsumer } from '../Contexts/ActionMenu';
import NotificationToast from '../Components/NotificationToast'


const navStyle = 'vertical'; //vertical or horizontal;

const drawerWidth = navStyle === 'horizontal' ? 0 : 248;


const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  link: {
    color: theme.palette.secondary.main
  },
  appBar: {
    zIndex: 1400,
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
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    // marginLeft: `-${theme.spacing(2)}px`,
    // marginRight: `${theme.spacing(3)}px`,
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
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
      marginLeft: drawerWidth
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
});

// const ExternalLink = ({to, children, className}) =>
//   <a href={to} className={className}>{children}</a>

class MainNavigation extends React.Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
    contactFormOpen: false
  };


  handleChange = (event, checked) =>
    this.setState({ auth: checked });

  handleMenu = event =>
    this.setState({ anchorEl: event.currentTarget });

  handleClose = () =>
    this.setState({ anchorEl: null });

  handleDrawerToggle = () =>
    this.setState({ mobileOpen: !this.state.mobileOpen });



  render() {
    const { classes, theme, currentUser } = this.props;
    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <List>
          <ListItem 
            component={Link} 
            to={`/`} 
            button  
            onClick={this.handleDrawerToggle}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText><Typography  className={classes.link}>Home</Typography></ListItemText>
          </ListItem>
          {
            !!currentUser ? (
              <ListItem 
                component={Link} 
                to={`/sign-out/`} 
                button  
                onClick={this.handleDrawerToggle}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText><Typography  className={classes.link}>Sign Out</Typography></ListItemText>
              </ListItem>
            ) : (
              <ListItem 
                component={Link} 
                to={`/home/`} 
                button  
                onClick={this.handleDrawerToggle}
              >
                <ListItemIcon>
                  <AccountKeyIcon />
                </ListItemIcon>
                <ListItemText><Typography  className={classes.link}>Sign In</Typography></ListItemText>
              </ListItem>
            )
          }
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Link className={classes.logoLink} to="/" >
              <img 
                src={require('../assets/images/nav-logo.png')}
                className={classes.logo}
                alt="Home"
              />
            </Link>
            {
              navStyle === 'horizontal' &&
              <>
                {
                  !currentUser && 
                  <Button component={Link} to="/home" color="inherit">Sign In</Button>
                }
                {
                  !!currentUser && 
                  <Button component={Link} to="/sign-out" color="inherit">Sign Out</Button>
                }
                
              </>
            }
            <ActionMenuConsumer>
              {({Element}) => Element ? Element : null}
            </ActionMenuConsumer>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        {
          navStyle === 'vertical' &&
          <Hidden smDown>
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        }
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.flex}>
            {(this.props.notifications||[]).map((notification, i) =>
              <NotificationToast message={notification.message} key={i} />
            )}
            {this.props.children}
          </div>
          <footer className={classes.footer}>
            {/*
            <ul className={classes.social}>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://facebook.com/gunnertechnology"><Facebook /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.periscope.tv/gunnertech"><Twitter /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://instagram.com/gunnertechnology"><Instagram /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://youtube.com/channel/UCjURDi2kurZOJFK1OY-QRHg"><Youtube /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/gunnertech"><GithubCircle /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://itunes.apple.com/us/podcast/gunner-technology/id1308255296?mt=2"><Itunes /></a>
              </li>
              <li className={classes.socialItem}>
                <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.linkedin.com/company/gunner-technology/"><Linkedin /></a>
              </li>
            </ul>
            */}

            <Typography variant="caption" paragraph className={classes.footerText}>
              © {(new Date()).getFullYear()} Model Search <a href="https://arnoldmodelsearch.com/">Arnold Competition</a>&nbsp;|&nbsp;<Link to={`/privacy-policy`}>Privacy Policy</Link>
            </Typography>
          </footer>
        </div>
      </div>
    );
  }
}

MainNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.element)
  ])
};

export default withCurrentUser()(
  withStyles(
    styles, 
    { withTheme: true }
  )(MainNavigation)
);

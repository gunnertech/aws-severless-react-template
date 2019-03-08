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
import Divider from '@material-ui/core/Divider';
import { ListItem, ListItemIcon, ListItemText, ListSubheader } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import AssessmentIcon from '@material-ui/icons/Assessment';

import AccountKeyIcon from 'mdi-material-ui/AccountKey'
import SettingsIcon from 'mdi-material-ui/Settings';
import CellphoneIcon from 'mdi-material-ui/Cellphone';
import AccountGroupIcon from 'mdi-material-ui/AccountGroup';

import withCurrentUser from '../Hocs/withCurrentUser';
import { ActionMenuConsumer } from '../Contexts/ActionMenu';
import NotificationToast from '../Components/NotificationToast'



const drawerWidth = 248;


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
    marginTop: `${theme.spacing.unit/2}px`,
    marginLeft: `${theme.spacing.unit}px`
  },
  flex: {
    flex: 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    marginLeft: `-${theme.spacing.unit*2}px`,
    marginRight: `${theme.spacing.unit*3}px`,
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
    padding: theme.spacing.unit * 3,
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
    padding: theme.spacing.unit,
    marginTop: theme.spacing.unit*10,
    marginBottom: theme.spacing.unit,
    textAlign: 'center'
  },
  social: {
    alignItems: 'center', 
    padding: 0
  },
  socialItem: {
    listStyleType: 'none', 
    display: 'inline-block',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  testimonialWrapper: {
    marginBottom: theme.spacing.unit*10
  }
});

const ExternalLink = ({to, children, className}) =>
  <a href={to} className={className}>{children}</a>

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
        <Divider />
        {
          !!currentUser && !!currentUser.organization &&
          <List subheader={
            <ListSubheader>{currentUser.organization.name}</ListSubheader>
          }>
            <ListItem 
              component={Link} 
              to={`/dashboard`} 
              button  
              onClick={this.handleDrawerToggle}
            >
              <ListItemIcon>
                <AssessmentIcon />
              </ListItemIcon>
              <ListItemText><Typography  className={classes.link}>Dashboard</Typography></ListItemText>
            </ListItem>
            <ListItem 
              component={Link} 
              to={`/users`} 
              button  
              onClick={this.handleDrawerToggle}
            >
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText><Typography  className={classes.link}>Users</Typography></ListItemText>
            </ListItem>
            <ListItem 
              component={Link} 
              to={`/campaigns`} 
              button  
              onClick={this.handleDrawerToggle}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText><Typography  className={classes.link}>Campaigns</Typography></ListItemText>
            </ListItem>
            <ListItem 
              component={Link} 
              to={`/contacts`} 
              button  
              onClick={this.handleDrawerToggle}
            >
              <ListItemIcon>
                <AccountGroupIcon />
              </ListItemIcon>
              <ListItemText><Typography  className={classes.link}>Contacts</Typography></ListItemText>
            </ListItem>
            <ListItem 
              component={Link} 
              to={`/settings`} 
              button  
              onClick={this.handleDrawerToggle}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText><Typography className={classes.link}>Settings</Typography></ListItemText>
            </ListItem>
            <Hidden mdUp>
              <ListItem 
                component={ExternalLink} 
                to={`https://t1ph.app.link/ve1T9CznQU`} 
                button  
                onClick={this.handleDrawerToggle}
              >
                <ListItemIcon>
                  <CellphoneIcon />
                </ListItemIcon>
                <ListItemText><Typography className={classes.link}>Open App</Typography></ListItemText>
              </ListItem>
            </Hidden>
          </List>
        }
        <Divider />
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
                to={`/dashboard/`} 
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
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/" className={classes.flex}>
              <img 
                src={require('../assets/images/logo.png')}
                className={classes.logo}
                alt="Home"
              />
              {
                !!process.env.REACT_APP_bucket.match(/staging/) &&
                <span style={{color: "white"}}>- S</span>
              }
            </Link>
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

            <Typography paragraph>
              © {(new Date()).getFullYear()} AZ Tech <br />
              <Link to={`/privacy-policy`}>Privacy Policy</Link>
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

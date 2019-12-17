import React from "react";
import { Link } from "react-router-dom";

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import { ListItem, ListItemIcon, ListItemText, Button } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import AccountKeyIcon from 'mdi-material-ui/AccountKey'


import { ActionMenuConsumer } from '../../Contexts/ActionMenu';

const navStyle = 'vertical'; //vertical or horizontal;

const DrawerContents = ({classes, handleDrawerToggle, currentUser}) =>
  <div>
    <div className={classes.toolbar} />
    <List>
      <ListItem 
        component={Link} 
        to={`/`} 
        button  
        onClick={handleDrawerToggle}
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
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText><Typography  className={classes.link}>Sign Out</Typography></ListItemText>
          </ListItem>
        ) : (
          <ListItem 
            component={Link} 
            to={`/sign-in/`} 
            button  
            onClick={handleDrawerToggle}
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



const MainNavigationView = ({classes, handleDrawerToggle, mobileOpen, children, currentUser}) => 
  <div className={classes.root}>
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Link className={classes.logoLink} to="/" >
          <img 
            src={require('../../assets/images/nav-logo.png')}
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
        // anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <DrawerContents currentUser={currentUser} classes={classes} />
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
          <DrawerContents currentUser={currentUser} classes={classes} />
        </Drawer>
      </Hidden>
    }
    <div className={classes.content}>
      <div className={classes.toolbar} />
      <div className={classes.flex}>
        {children}
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
          © {(new Date()).getFullYear()} <a href={process.env.REACT_APP_base_url}><project-name></a>&nbsp;|&nbsp;<Link to={`/privacy-policy`}>Privacy Policy</Link>
        </Typography>
      </footer>
    </div>
  </div>
  

export default MainNavigationView;
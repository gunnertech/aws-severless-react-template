import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Splash = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <p>Hi there!</p>
      <p>You're not logged in, so you're seeing our landing page.</p>
      <p>Pretty soon, we'll have graphics and maybe even a video that will explain what Fresh is and why you should sign up.</p>
      <p>But for now, take our word for it and <Link to={`/home`}>create an account</Link>.</p>
    </div>
  );
}

export default withStyles(styles)(Splash);
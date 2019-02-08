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
      I'm the public landing page that everyone can see
    </div>
  );
}

export default withStyles(styles)(Splash);
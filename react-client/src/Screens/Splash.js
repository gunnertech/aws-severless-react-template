import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Splash = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      I'm the splash page
    </div>
  );
}

export default withStyles(styles)(Splash);
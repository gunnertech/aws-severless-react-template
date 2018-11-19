import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Home = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      This is your dashboard
    </div>
  );
}

export default withStyles(styles)(Home);
import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Container = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
}

export default withStyles(styles)(Container);
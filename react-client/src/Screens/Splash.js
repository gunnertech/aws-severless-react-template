import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Splash = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography paragraph>Simplisurvey is a tool for interpreting real time customer satisfaction and analysis.</Typography>
      <Typography paragraph>It works by polling customers with a simple algorithm and presenting findings on an easy to use dashboard.</Typography>
      <Typography paragraph>If you were invited to join, follow the link and use the email and/or phone number your invite was sent to, otherwise, get started with your own free organization: <Link to={`/dashboard`}>Sign In</Link></Typography>
    </div>
  );
}

export default withStyles(styles)(Splash);
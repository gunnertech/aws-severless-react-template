import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const Splash = props => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Typography paragraph>Simplisurvey is a tool for interpreting real-time customer satisfaction and analysis.</Typography>
      <Typography paragraph>It works by polling customers with a simple algorithm and presenting findings on an easy-to-use dashboard.</Typography>
      <Typography paragraph>If you were invited to join, follow the link and use the email and/or phone number your invite was sent to, otherwise, get started with your own free organization: <Link to={`/dashboard`}>Sign In</Link></Typography>
      <Grid container className={classes.root} spacing={16} justify={'space-around'}>
        <Grid item xs={12} md={3} style={{marginTop: "48px"}}>
          <img src={require("../assets/images/send.png")} style={{maxWidth: "100%", height: "auto"}} />
        </Grid>
        <Grid item xs={12} md={3} style={{marginTop: "48px"}}>
          <img src={require("../assets/images/respond.png")} style={{maxWidth: "100%", height: "auto"}} />
        </Grid>
        <Grid item xs={12} md={3} style={{marginTop: "48px"}}>
          <img src={require("../assets/images/analyze.png")} style={{maxWidth: "100%", height: "auto"}} />
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Splash);
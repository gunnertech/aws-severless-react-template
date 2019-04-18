import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Container from '../Components/Container'

const styles = theme => ({
  
});

const Splash = props => {
  return (
    <Container>
      <Typography paragraph>Welcome. Doesn't look you have access, so why don't you create an account?</Typography>
    </Container>
  );
}

export default withStyles(styles)(Splash);
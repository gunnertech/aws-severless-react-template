import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withRouter } from 'react-router-dom';
import { withApollo, compose } from 'react-apollo';

import Container from '../Components/Container'

import withActionMenu from '../Hocs/withActionMenu'
import withCurrentUser from '../Hocs/withCurrentUser';

const styles = theme => ({
  
});

class Home extends React.Component {
  state = {};

  render() {
    const { currentUser } = this.props;
    return !currentUser ? null : (
      <Container>
        <div>
          <Typography paragraph>Welcome, {currentUser.name}!</Typography>
          <Typography paragraph>This is the start of a wonderful releationship.</Typography>
        </div>  
      </Container>
    )
  }
}


export default compose(
  withCurrentUser(),
  withMobileDialog(),
  withStyles(styles),
  withActionMenu()
)(withRouter(withApollo(Home))) 

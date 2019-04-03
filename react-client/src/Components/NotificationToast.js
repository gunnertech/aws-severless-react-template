import React from 'react'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  toast: {
    marginTop: theme.spacing.unit * 2, 
    padding: theme.spacing.unit * 2,
    color: 'white',
    backgroundColor: theme.palette.secondary.main
  }
});

class NotificationToast extends React.Component {
  constructor(props) {
    super();
    this.state = {
      visible: false
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({
      visible: true
    }), 2);

    setTimeout(() => this.setState({
      visible: false
    }), 3000);
  };

  render() {
    const { message, classes } = this.props;
    return <div className={classes.toast}>{message}</div>;
  }
}

export default withStyles(styles)(NotificationToast);
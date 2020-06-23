import React from 'react'

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import ReactGA from 'react-ga'

import withMobileDialog from '@material-ui/core/withMobileDialog';
import CloseIcon from '@material-ui/icons/Close';

import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  modal: {
    '& .indicator': {
      paddingTop: theme.spacing(1), 
      paddingBottom: theme.spacing(1), 
      display: 'flex', 
      flex: 1, 
      justifyContent: "center"
    },
    '& .logoWrapper': {
      textAlign: 'center',
      padding: theme.spacing(2, 6),
      marginBottom: theme.spacing(-7),
      '& img': {
        maxWidth: '100%',
        height: 'auto'
      },
      '&:after': {
        content: '""',
        height: 2,
        display: 'block',
        backgroundColor: theme.palette.background.default,
        margin: theme.spacing(3, -6)
      }
    },
    '& .closeWrapper': {
      position: "absolute",
      right: 0
    },
    '& .titleWrapper': {
      margin: theme.spacing(0, -3, 0, -3),
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      '& .alt': {
        color: theme.palette.secondary.main
      }
    }
  }
}));

const Modal = ({
  excludeHeader = true,
  preTitle,
  title,
  subTitle,
  body,
  onClose,
  submitting = false,
  fullScreen,
  opened = false,
  saveButton = {
    text: "Save",
    onClick: console.log,
    ButtonProps: {}
  },
  secondaryButton = null,
}) => {

  const classes = useStyles();

  // console.log(ReactDOMServer.renderToString(title).replace(/<[^>]+>/g, ''))

  !!opened && (
    typeof title === 'string' ? (
      ReactGA.modalview(`/${(title??"").toString().toLowerCase().replace(/[^\-A-Za-z0-9]/g, '-')}`)
    ) : (
      ReactGA.modalview(`/${(ReactDOMServer.renderToString(title)??"").toString().toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\-A-Za-z0-9]/g, '-')}`)
    )
  )
    

  return (
    <Dialog
      className={classes.modal}
      fullScreen={fullScreen}
      open={opened}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
{/*       
        !!excludeHeader &&
        <div className="logoWrapper">
          <img src={require("../../assets/css/logo-alt.png")} alt="logo" />
        </div>
       */}
      <div className="closeWrapper">
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      {
        (!!title || !!subTitle) &&
        <DialogTitle disableTypography>
          {
            !!preTitle &&
            preTitle
          }
          {
            !!title && 
            <div className="titleWrapper">
              <Typography variant="h4">{title}</Typography>
            </div>
          }
          {
              !!subTitle && 
              <div className="subTitleWrapper">
                <Typography variant="caption" component="h4">{subTitle}</Typography>
              </div>
            }
        </DialogTitle>
      }
      <DialogContent>
        {
          typeof body === 'string' ? (
            <DialogContentText>
              {body}
            </DialogContentText>
          ) : (
            body
          )
        }
      </DialogContent>
      <DialogActions>
        {
          submitting ? (
            <div className="indicator">
              <CircularProgress className={classes.progress} color="secondary" />
            </div>
          ) : (
            <>
              {
                !!saveButton &&
                <Button 
                  disabled={saveButton.disabled} 
                  variant={(saveButton.ButtonProps||{}).variant || 'contained'}
                  color={(saveButton.ButtonProps||{}).color || 'secondary'}
                  size={(saveButton.ButtonProps||{}).size || 'large'}
                  onClick={evt => [evt.stopPropagation(), evt.preventDefault(), saveButton.onClick()]}
                  {...saveButton.ButtonProps||{}}
                >
                  {saveButton.text}
                </Button>
              }
              {
                !!secondaryButton &&
                <Button 
                  disabled={secondaryButton.disabled} 
                  variant={(secondaryButton.ButtonProps||{}).variant || 'text'}
                  color={(secondaryButton.ButtonProps||{}).color || 'default'}
                  size={(secondaryButton.ButtonProps||{}).size || 'large'}
                  onClick={evt => [evt.stopPropagation(), evt.preventDefault(), secondaryButton.onClick()]}
                  {...secondaryButton.ButtonProps||{}}
                >
                  {secondaryButton.text}
                </Button>
              }
            </>
          )
        }
      </DialogActions>
    </Dialog>
  )
}

export default withMobileDialog()(Modal);
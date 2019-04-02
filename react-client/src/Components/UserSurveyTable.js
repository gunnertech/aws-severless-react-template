import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ResponseList from './ResponseList'

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing.unit * 6,
    marginTop: theme.spacing.unit * 5,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const UserSurveyTable = ({classes, users, selectedPrompt, surveys, onModalClose, onHeaderCellClick}) => 
  <Paper className={classes.root}>
    {
      !!selectedPrompt &&
      <ResponseList 
        prompt={selectedPrompt} 
        surveys={surveys} 
        open={!!selectedPrompt} 
        onClose={onModalClose} 
      />
    }
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell align="right">Responses</TableCell>
          {
            users[0].prompts.map(prompt => 
              <TableCell onClick={() => onHeaderCellClick(prompt)} key={prompt.id} align="right">{prompt.body}</TableCell>
            )
          }
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map(user =>
          <TableRow key={user.id}>
            <TableCell  component="th" scope="row">
              {user.name}
            </TableCell>
            <TableCell key={prompt.id} align="right">{user.responseCount}</TableCell>
            {
              user.prompts.map(prompt => 
                <TableCell key={prompt.id} align="right">{prompt.score}</TableCell>
              )
            }
          </TableRow>
        )}
      </TableBody>
    </Table>
  </Paper>

export default withStyles(styles)(UserSurveyTable);

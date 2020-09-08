/* global caches */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: () => {
    window.alert("A new version of this app is available.");
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
      .then(() => window.location.reload(true))
  }
});

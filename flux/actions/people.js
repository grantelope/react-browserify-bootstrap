'use strict';

import axios from 'axios';
import alt from '../alt';

class PeopleActions {
  query() {
    axios.get('/fixtures/people.json').
      then(response => {
        setTimeout(() => {
          this.actions.querySuccess(response.data);
        }, 1500);
      }).
      catch(err => {
        this.actions.queryFailure(err);
      });
    this.dispatch();
  }
  querySuccess(data) {
    this.dispatch(data);
  }
  queryFailure(err) {
    this.dispatch(err);
  }
}

export default alt.createActions(PeopleActions);

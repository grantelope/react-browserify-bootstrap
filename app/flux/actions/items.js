'use strict';

import axios from 'axios';
import alt from '../alt';

class ItemActions {
  query() {
    axios.get('/fixtures/items.json').
      then(response => {
        this.actions.querySuccess(response.data);
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

export default alt.createActions(ItemActions);

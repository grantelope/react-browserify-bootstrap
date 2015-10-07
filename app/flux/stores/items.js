'use strict';

import alt from '../alt';
import actions from '../actions/items';

class ItemStore {
  constructor() {
    this.err = null;
    this.items = [];
    this.loading = false;
    this.bindAction(actions.query, this.onQuery);
    this.bindAction(actions.querySuccess, this.onQuerySuccess);
    this.bindAction(actions.queryFailure, this.onQueryFailure);
  }
  onQuery() {
    this.loading = true;
  }
  onQuerySuccess(data) {
    this.loading = false;
    this.items = data;
  }
  onQueryFailure(err) {
    this.err = err;
  }

}

export default alt.createStore(ItemStore, 'ItemStore');

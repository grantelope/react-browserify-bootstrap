'use strict';

import alt from '../alt';
import actions from '../actions/people';

class PeopleStore {
  constructor() {
    this.err = null;
    this.people = [];
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
    this.people = data;
  }
  onQueryFailure(err) {
    this.err = err;
  }

}

export default alt.createStore(PeopleStore, 'PeopleStore');

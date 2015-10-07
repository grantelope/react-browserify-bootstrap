'use strict';

import alt from '../alt';
import actions from '../actions/route';

class RouteStore {
  constructor() {
    this.loading = false;
    this.error = false;
    this.stores = [];
    this.ctx = {};

    this.bindAction(actions.start, this.onStart);
    this.bindAction(actions.update, this.onUpdate);
    this.bindAction(actions.error, this.onError);
  }

  onStart(dispatched) {
    let {ctx, stores} = dispatched;

    this.stores = [];

    stores.forEach(store => {
      this.stores.push({
        name: store.displayName,
        loading: store.getState().loading
      });
    });

    this.loading = this.stores.length > 0 ? true : false;
    this.ctx = ctx;
  }

  onUpdate(dispatched) {
    let {stores} = dispatched;

    stores.forEach(updatedStore => {
      this.stores.find(store => {
        return store.name === updatedStore.displayName;
      }).loading = updatedStore.getState().loading;
    });

    this.loading = this.stores.filter(store => {
      return store.loading === true;
    }).length > 0 ? true : false;
  }

  onError(err) {
    this.loading = false;
    this.error = true;
    this.err = err;
  }

}

export default alt.createStore(RouteStore, 'RouteStore');

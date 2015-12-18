'use strict';

import alt from '../alt';

class RouteActions {

  start(actionObject) {
    this.dispatch(actionObject);
  }
  update(actionObject) {
    this.dispatch(actionObject);
  }
  error() {
    this.dispatch();
  }
}

export default alt.createActions(RouteActions);

'use strict';

import RouteActions from '../flux/actions/route';
import RouteStore from '../flux/stores/route';
import page from 'page';

let routes = [];
let currentPath = '';
let currentCanonicalPath = '';
let currentStores = [];

const Router = {};

RouteStore.listen(() => {
  if (!RouteStore.getState().loading) {
    routes.filter(route => {
      return route.route === currentPath;
    }).forEach(matchedRoute => {
      matchedRoute.callback();
    });
  }
});

function storeListener() {
  RouteActions.update.defer({ctx: currentCanonicalPath, path: currentPath, stores: currentStores});
}

function setListeners(stores, actions) {
  currentStores.forEach(store => store.unlisten(storeListener));
  stores.forEach(store => store.listen(storeListener));

  currentStores = stores;
  actions.forEach(action => action());
}

function createRoute(route, stores, actions, callback) {
  routes.push({route, stores, callback});

  page(route, ctx => {
    currentPath = route;
    currentCanonicalPath = ctx.canonicalPath;
    setListeners(stores, actions);
    RouteActions.start({route, stores});
  });
}

function start() {
  page('*', function () {
    page('/not-found');
  });

  page();
}

Object.assign(Router, {
  start: start,
  createRoute: createRoute
});

export default Router;

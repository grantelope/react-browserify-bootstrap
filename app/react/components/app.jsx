'use strict';

import React from 'react';
import Router from '../../libs/router';

import ItemStore from '../../flux/stores/items';
import ItemActions from '../../flux/actions/items';

import PeopleStore from '../../flux/stores/people';
import PeopleActions from '../../flux/actions/people';

import Home from './home';
import Dashboard from './dashboard';
import Preloader from './preloader';

const HomeComponent = Home.Component;
const DashboardComponent = Dashboard.Component;
// ^ ok, use that style so that we have the actions & stores exported like that

React.render(
  <Preloader />,
  document.getElementById('preloader')
);

Router.createRoute('/', Home.stores, [Home.actions], function () {
  React.render(
    <HomeComponent />,
    document.getElementById('interface')
  );
});

Router.createRoute('/thing', Dashboard.stores, [Dashboard.actions], function () {
  React.render(
    <DashboardComponent />,
    document.getElementById('interface')
  );
});
Router.start();

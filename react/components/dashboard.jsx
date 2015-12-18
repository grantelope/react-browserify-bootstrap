'use strict';

import React from 'react';
import Routed from './routed';
import Button from './button';
import Items from './items';

import ItemStore from '../../flux/stores/items';
import ItemActions from '../../flux/actions/items';

import PeopleStore from '../../flux/stores/people';
import PeopleActions from '../../flux/actions/people';

const stores = [PeopleStore, ItemStore];

function actions() {
  ItemActions.query();
  PeopleActions.query();
}

class Component extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div>DASHBOARD</div>;
  }
}

export default {Component, actions, stores};

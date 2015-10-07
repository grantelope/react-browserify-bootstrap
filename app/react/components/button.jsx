'use strict';

import React from 'react';
import ItemActions from '../../flux/actions/items';
import PeopleActions from '../../flux/actions/people';

export default class Button extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isAButton: true
    };
  }
  handleClick(str) {
    ItemActions.query();
    PeopleActions.query();

    return str;
  }
  render() {
    return <button onClick={this.handleClick.bind(null, 'thing')}>Get Items</button>;
  }
}

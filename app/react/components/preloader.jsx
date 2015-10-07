'use strict';

import React from 'react';
import RouteStore from '../../flux/stores/route';

export default class Preloader extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: RouteStore.getState().loading ? 'true': 'false'
    };
  }
  componentDidMount() {
    RouteStore.listen(this.onChange.bind(this));
  }
  componentWillUnmount() {
    RouteStore.unlisten(this.onChange.bind(this));
  }
  onChange() {
    this.setState({
      loading: RouteStore.getState().loading ? 'true': 'false'
    });
  }
  render() {
    return <div>loading: {this.state.loading}</div>;
  }
}

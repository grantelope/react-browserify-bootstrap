import React from 'react';
import ItemStore from '../../flux/stores/items';
import PeopleStore from '../../flux/stores/people';

export default class Items extends React.Component {
  constructor() {
    super();
    this.state = {
      itemLoading: ItemStore.getState().loading ? 'true' : 'false',
      peopleLoading: ItemStore.getState().loading ? 'true' : 'false',
      time: new Date().getTime()
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    ItemStore.listen(this.onChange);
    PeopleStore.listen(this.onChange);
  }
  componentWillUnmount() {
    ItemStore.unlisten(this.onChange);
    PeopleStore.unlisten(this.onChange);
  }
  onChange() {
    this.setState({
      itemLoading: ItemStore.getState().loading ? 'true' : 'false',
      peopleLoading: PeopleStore.getState().loading ? 'true' : 'false'
    });
  }
  render() {
    return <div>{ JSON.stringify(this.state) } {this.state.itemLoading}, {this.state.peopleLoading}</div>;
  }
}

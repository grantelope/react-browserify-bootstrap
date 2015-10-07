"use strict";

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import React from 'react/addons';
import Button from '../app/react/components/button.jsx';

//mocha test/**/*.spec.js --compilers jsx:babel/register,js:babel/register:babel/register --recursive -w

let expect = chai.expect;
let { TestUtils } = React.addons;

describe('button', function () { 

  it('button should have text', () => {

    let itemsClass = TestUtils.renderIntoDocument(<Button />),
      ButtonElem = React.findDOMNode(itemsClass),
      ButtonText = ButtonElem.innerHTML;
    
    expect(ButtonText).to.equal('Get Items');
  });

  it('clicks', () => {

    let stub = sinon.stub(Button.prototype, 'handleClick', () => {
      itemsClass.setState({
        isAButton: false
      });
    });

    let itemsClass = TestUtils.renderIntoDocument(<Button />),
      ButtonElem = React.findDOMNode(itemsClass);

    TestUtils.Simulate.click(ButtonElem);
    sinon.assert.called(stub);
    expect(itemsClass.state.isAButton).to.equal(false);

  });

});

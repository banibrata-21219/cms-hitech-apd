import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies

import { DocumentItem, ProgressDot, ProgressLine } from './DashboardStory';
import InstructionStory from './InstructionStory';
import FrozenTableStory from './FrozenTableStory';
import Btn from '../components/Btn';
import { DollarInput, Input, Textarea } from '../components/Inputs';

import '../styles/index.css';

const Yes = ({ children }) => children;
const No = ({ children }) => children;

const Conditional = ({ checked, children, noLabel, yesLabel, onChange }) => {
  const childList = Array.isArray(children) ? children : [children];

  const yes = childList.filter(c => c.type === Yes);
  const no = childList.filter(c => c.type === No);

  const id = Math.floor(Math.random() * 1000000);

  return (
    <Fragment>
      <div>
        <div>
          <input
            id={`conditional_yes_${id}`}
            type="radio"
            checked={checked}
            onChange={() => onChange(true)}
          />
          <label htmlFor={`conditional_yes_${id}`}>{yesLabel}</label>
        </div>
        {checked && !!yes.length && (
          <div className="ml3 border-left pl1">{yes[0]}</div>
        )}
      </div>
      <div>
        <div>
          <input
            id={`conditional_no_${id}`}
            type="radio"
            checked={!checked}
            onChange={() => onChange(false)}
          />
          <label htmlFor={`conditional_no_${id}`}>{noLabel}</label>
        </div>
        {!checked && !!no.length && (
          <div className="ml3 border-left pl1">{no[0]}</div>
        )}
      </div>
    </Fragment>
  );
};
Conditional.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  noLabel: PropTypes.string,
  yesLabel: PropTypes.string,
  onChange: PropTypes.func
};
Conditional.defaultProps = {
  checked: false,
  children: null,
  noLabel: 'No',
  yesLabel: 'Yes',
  onChange: () => {}
};

storiesOf('Conditional container', module).add('prototype', () => {
  class Prototype extends Component {
    state = { checked: true };

    change = checked => {
      this.setState({ checked });
    };

    render() {
      return (
        <Conditional checked={this.state.checked} onChange={this.change}>
          <Yes>Yay you said yes!</Yes>
          <No>
            <h2>You said no!</h2>
            Why&lsquo;d you do that?
            <Textarea />
          </No>
        </Conditional>
      );
    }
  }

  return <Prototype />;
});

storiesOf('Texty components', module).add('Instruction', () => (
  <InstructionStory />
));

storiesOf('Frozen-pane tables', module).add('example', () => (
  <FrozenTableStory />
));

storiesOf('Dashboard components', module)
  .add('Document', () => <DocumentItem />)
  .add('Progress dot', () => <ProgressDot />)
  .add('Progress line', () => <ProgressLine />);

const inputProps = { input: { name: 'Foo' }, meta: {}, label: 'Input Label' };

storiesOf('Inputs', module)
  .add('text input', () => <Input {...inputProps} />)
  .add('textarea input', () => <Textarea {...inputProps} />);

storiesOf('Buttons', module).add('various', () => (
  <div>
    normal:
    <Btn /> <Btn>Boom</Btn> <Btn extraCss="p3">More padding</Btn>{' '}
    <Btn onClick={() => alert('btn clicked!')}>Click me!</Btn>
    <hr />
    <Btn kind="outline" /> <Btn kind="outline" size="big" />
  </div>
));

storiesOf('Numeric inputs', module).add('Dollars', () => {
  class Dollar extends Component {
    state = { value: 0 };

    change = e => {
      console.log(e.target.value);
      this.setState({ value: e.target.value });
    };

    render() {
      return (
        <DollarInput
          hideLabel
          wrapperClass="m0"
          className="fake-spacer-input m0 input input-condensed mono right-align"
          label="fake-spacer-input"
          name="fake-spacer-input"
          value={this.state.value}
          onChange={this.change}
        />
      );
    }
  }

  return <Dollar />;
});

import React from 'react';
import { shallow } from 'enzyme';
import { Tabs } from '../tabs';

describe('Tabs Component', () => {
  it('should render a basic component', () => {
    const props = {
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { title: 'dolor', content: 'sit' }
      ]
    };

    const component = shallow(<Tabs {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle no tabs', () => {
    const props = {
      tabs: []
    };

    const component = shallow(<Tabs {...props} />);
    expect(component).toMatchSnapshot('no tabs');
  });
});

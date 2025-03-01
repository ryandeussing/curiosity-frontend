import React from 'react';
import { shallow } from 'enzyme';
import { ToolbarFieldGranularity, toolbarFieldOptions, useOnSelect } from '../toolbarFieldGranularity';
import { store } from '../../../redux/store';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('ToolbarFieldGranularity Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', () => {
    const props = {
      useProductGraphTallyQuery: () => ({ [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.WEEKLY })
    };
    const component = shallow(<ToolbarFieldGranularity {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export select options', () => {
    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating granularity through redux state with component', async () => {
    const props = {};

    const component = await mountHookComponent(<ToolbarFieldGranularity {...props} />);

    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch granularity, component');
  });

  it('should handle updating granularity through redux state with hook', () => {
    const options = {
      useProduct: () => ({ viewId: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);

    onSelect({ value: 'dolor sit' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch granularity, hook');
  });
});

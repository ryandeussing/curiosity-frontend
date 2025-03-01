import {
  context,
  useGetSubscriptionsInventory,
  useOnPageSubscriptions,
  useOnColumnSortSubscriptions
} from '../inventoryCardSubscriptionsContext';
import {
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SORT_TYPES
} from '../../../services/rhsm/rhsmConstants';

describe('InventoryCardSubscriptionsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should expect specific sort properties', () => {
    expect(SORT_TYPES).toMatchSnapshot('sort properties');
  });

  it('should handle a store response with useGetSubscriptionsInventory', async () => {
    const { result } = await shallowHook(
      () =>
        useGetSubscriptionsInventory({
          useProduct: () => ({ productId: 'lorem' })
        }),
      {
        state: {
          inventory: {
            subscriptionsInventory: {
              lorem: {
                fulfilled: true,
                data: [{ data: [{ lorem: 'ipsum' }, { dolor: 'sit' }], meta: {} }]
              }
            }
          }
        }
      }
    );

    expect(result).toMatchSnapshot('store response');
  });

  it('should handle variations in instances inventory API responses', async () => {
    const { result: errorResponse } = shallowHook(() =>
      useGetSubscriptionsInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsResponse: () => ({ error: true })
      })
    );

    expect(errorResponse).toMatchSnapshot('inventory, error');

    const { result: pendingResponse } = shallowHook(() =>
      useGetSubscriptionsInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsResponse: () => ({ pending: true })
      })
    );

    expect(pendingResponse).toMatchSnapshot('inventory, pending');

    const { result: cancelledResponse } = shallowHook(() =>
      useGetSubscriptionsInventory({
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsResponse: () => ({ cancelled: true })
      })
    );

    expect(cancelledResponse).toMatchSnapshot('inventory, cancelled');

    const mockFulfilledGetInventory = jest.fn();
    const { result: fulfilledResponse } = await mountHook(() =>
      useGetSubscriptionsInventory({
        getInventory: () => mockFulfilledGetInventory,
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsResponse: () => ({ fulfilled: true })
      })
    );

    expect(mockFulfilledGetInventory).toHaveBeenCalledTimes(1);
    expect(fulfilledResponse).toMatchSnapshot('inventory, fulfilled');

    const mockDisabledGetInventory = jest.fn();
    const { result: disabledResponse } = await mountHook(() =>
      useGetSubscriptionsInventory({
        isDisabled: true,
        getInventory: () => mockDisabledGetInventory,
        useProduct: () => ({ productId: 'lorem' }),
        useDispatch: () => {},
        useProductInventoryQuery: () => ({}),
        useSelectorsResponse: () => ({})
      })
    );

    expect(mockDisabledGetInventory).toHaveBeenCalledTimes(0);
    expect(disabledResponse).toMatchSnapshot('inventory, disabled');
  });

  it('should handle an onPage event', () => {
    const mockDispatch = jest.fn();
    const onPage = useOnPageSubscriptions({
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onPage({ offset: 1, perPage: 5 });
    expect(mockDispatch.mock.calls).toMatchSnapshot('onPage event, dispatch');
    mockDispatch.mockClear();
  });

  it('should handle an onColumnSort event', () => {
    const mockDispatch = jest.fn();
    const onColumnSort = useOnColumnSortSubscriptions({
      sortColumns: { LOREM_IPSUM_COLUMN_ONE: 'loremIpsumColumnOne' },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'lorem' })
    });

    onColumnSort(null, { direction: SORT_DIRECTION_TYPES.DESCENDING, id: 'loremIpsumColumnOne' });
    onColumnSort(null, { direction: SORT_DIRECTION_TYPES.ASCENDING, id: 'loremIpsumColumnOne' });

    expect(mockDispatch.mock.calls).toMatchSnapshot('onColumnSort event, dispatch');
    mockDispatch.mockClear();
  });
});

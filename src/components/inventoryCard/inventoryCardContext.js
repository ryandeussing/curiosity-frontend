import { useShallowCompareEffect } from 'react-use';
import _camelCase from 'lodash/camelCase';
import { SortByDirection } from '@patternfly/react-table';
import { reduxActions, reduxTypes, storeHooks } from '../../redux';
import { useProduct, useProductInventoryHostsQuery } from '../productView/productViewContext';
import {
  RHSM_API_QUERY_INVENTORY_HOSTS_SORT_TYPES as HOSTS_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES
} from '../../services/rhsm/rhsmConstants';
import { helpers } from '../../common';

/**
 * Combined Redux RHSM Actions, getHostsInventory, and inventory selector response.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.getInventory
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: (*|{}|*[]|{}), pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useGetHostsInventory = ({
  isDisabled = false,
  getInventory = reduxActions.rhsm.getHostsInventory,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductInventoryQuery();
  const dispatch = useAliasDispatch();
  const { cancelled, pending, data, ...response } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.hostsInventory?.[productId]
  );

  useShallowCompareEffect(() => {
    if (!isDisabled) {
      getInventory(productId, query)(dispatch);
    }
  }, [dispatch, isDisabled, productId, query]);

  return {
    ...response,
    pending: pending || cancelled || false,
    data: (data?.length === 1 && data[0]) || data || {}
  };
};

/**
 * Combined Redux RHSM Actions, getInstancesInventory, and inventory selector response.
 *
 * @param {object} options
 * @param {boolean} options.isDisabled
 * @param {Function} options.getInventory
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @param {Function} options.useProductInventoryQuery
 * @param {Function} options.useSelectorsResponse
 * @returns {{data: (*|{}|*[]|{}), pending: boolean, fulfilled: boolean, error: boolean}}
 */
const useGetInstancesInventory = ({
  isDisabled = false,
  getInventory = reduxActions.rhsm.getInstancesInventory,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct,
  useProductInventoryQuery: useAliasProductInventoryQuery = useProductInventoryHostsQuery,
  useSelectorsResponse: useAliasSelectorsResponse = storeHooks.reactRedux.useSelectorsResponse
} = {}) => {
  const { productId } = useAliasProduct();
  const query = useAliasProductInventoryQuery();
  const dispatch = useAliasDispatch();
  const { cancelled, pending, data, ...response } = useAliasSelectorsResponse(
    ({ inventory }) => inventory?.instancesInventory?.[productId]
  );

  useShallowCompareEffect(() => {
    if (!isDisabled) {
      getInventory(productId, query)(dispatch);
    }
  }, [dispatch, isDisabled, productId, query]);

  return {
    ...response,
    pending: pending || cancelled || false,
    data: (data?.length === 1 && data[0]) || data || {}
  };
};

/**
 * An onPage callback for instances inventory.
 *
 * @param {object} options
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnPageInstances = ({
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for instances inventory.
   *
   * @event onPage
   * @param {object} params
   * @param {number} params.offset
   * @param {number} params.perPage
   * @returns {void}
   */
  return ({ offset, perPage }) => {
    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.OFFSET],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.OFFSET]: offset
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.LIMIT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.LIMIT]: perPage
      }
    ]);
  };
};

/**
 * An onColumnSort callback for hosts inventory.
 *
 * @param {object} options
 * @param {object} options.sortColumns
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnColumnSortHosts = ({
  sortColumns = HOSTS_SORT_TYPES,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for hosts inventory.
   *
   * @event onColumnSort
   * @param {*} _data
   * @param {object} params
   * @param {string} params.direction
   * @param {string} params.id
   * @returns {void}
   */
  return (_data, { direction, id }) => {
    const updatedSortColumn = Object.values(sortColumns).find(value => value === id || _camelCase(value) === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
        console.warn(`Sorting can only be performed on select fields, confirm field ${id} is allowed.`);
      }
      return;
    }

    switch (direction) {
      case SortByDirection.desc:
        updatedDirection = SORT_DIRECTION_TYPES.DESCENDING;
        break;
      default:
        updatedDirection = SORT_DIRECTION_TYPES.ASCENDING;
        break;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };
};

/**
 * An onColumnSort callback for instances inventory.
 *
 * @param {object} options
 * @param {object} options.sortColumns
 * @param {Function} options.useDispatch
 * @param {Function} options.useProduct
 * @returns {Function}
 */
const useOnColumnSortInstances = ({
  sortColumns = SORT_TYPES,
  useDispatch: useAliasDispatch = storeHooks.reactRedux.useDispatch,
  useProduct: useAliasProduct = useProduct
} = {}) => {
  const { productId } = useAliasProduct();
  const dispatch = useAliasDispatch();

  /**
   * On event update state for instances inventory.
   *
   * @event onColumnSort
   * @param {*} _data
   * @param {object} params
   * @param {string} params.direction
   * @param {string} params.id
   * @returns {void}
   */
  return (_data, { direction, id }) => {
    const updatedSortColumn = Object.values(sortColumns).find(value => value === id || _camelCase(value) === id);
    let updatedDirection;

    if (!updatedSortColumn) {
      if (helpers.DEV_MODE || helpers.REVIEW_MODE) {
        console.warn(`Sorting can only be performed on select fields, confirm field ${id} is allowed.`);
      }
      return;
    }

    switch (direction) {
      case SortByDirection.desc:
        updatedDirection = SORT_DIRECTION_TYPES.DESCENDING;
        break;
      default:
        updatedDirection = SORT_DIRECTION_TYPES.ASCENDING;
        break;
    }

    dispatch([
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.DIRECTION],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.DIRECTION]: updatedDirection
      },
      {
        type: reduxTypes.query.SET_QUERY_RHSM_HOSTS_INVENTORY_TYPES[RHSM_API_QUERY_SET_TYPES.SORT],
        viewId: productId,
        [RHSM_API_QUERY_SET_TYPES.SORT]: updatedSortColumn
      }
    ]);
  };
};

const context = {
  useGetHostsInventory,
  useGetInstancesInventory,
  useOnPageInstances,
  useOnColumnSortHosts,
  useOnColumnSortInstances
};

export {
  context as default,
  context,
  useGetHostsInventory,
  useGetInstancesInventory,
  useOnPageInstances,
  useOnColumnSortHosts,
  useOnColumnSortInstances
};

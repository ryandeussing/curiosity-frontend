import { rhsmTypes } from '../types';
import { rhsmServices } from '../../services/rhsm/rhsmServices';
import { generateChartIds } from '../../components/graphCard/graphCardHelpers';

/**
 * Get a RHSM response from multiple Tally, or Capacity, IDs and metrics.
 *
 * @param {object|Array} idMetric An object, or an Array of objects, in the form of { id: PRODUCT_ID, metric: METRIC_ID, isCapacity: boolean }
 * @param {object} query
 * @param {object} options
 * @param {string} options.cancelId
 * @returns {Function}
 */
const getGraphMetrics =
  (idMetric = {}, query = {}, options = {}) =>
  dispatch => {
    const { cancelId = 'graphTally' } = options;
    const multiMetric = (Array.isArray(idMetric) && idMetric) || [idMetric];
    const multiDispatch = [];

    multiMetric.forEach(({ id, metric, isCapacity, query: metricQuery }) => {
      const methodService = isCapacity ? rhsmServices.getGraphCapacity : rhsmServices.getGraphTally;
      const methodType = isCapacity ? rhsmTypes.GET_GRAPH_CAPACITY_RHSM : rhsmTypes.GET_GRAPH_TALLY_RHSM;
      const methodCancelId = isCapacity ? 'graphCapacity' : cancelId;
      const generatedId = generateChartIds({ isCapacity, metric, productId: id, query: metricQuery });

      multiDispatch.push({
        type: methodType,
        payload: methodService(
          [id, metric],
          { ...query, ...metricQuery },
          {
            cancelId: `${methodCancelId}_${generatedId}`
          }
        ),
        meta: {
          id: generatedId,
          query: { ...query, ...metricQuery },
          notifications: {}
        }
      });
    });

    return Promise.all(dispatch(multiDispatch));
  };

/**
 * Get a hosts response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_HOSTS_INVENTORY_RHSM,
      payload: rhsmServices.getHostsInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a host's guest response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getHostsInventoryGuests =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_HOSTS_INVENTORY_GUESTS_RHSM,
      payload: rhsmServices.getHostsInventoryGuests(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get an instances response listing from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getInstancesInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_INSTANCES_INVENTORY_RHSM,
      payload: rhsmServices.getInstancesInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a RHSM response from message reporting.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getMessageReports =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_MESSAGE_REPORTS_RHSM,
      payload: rhsmServices.getGraphReports(id, query, { cancelId: 'messageReport' }),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

/**
 * Get a subscriptions response from RHSM subscriptions.
 *
 * @param {string} id
 * @param {object} query
 * @returns {Function}
 */
const getSubscriptionsInventory =
  (id = null, query = {}) =>
  dispatch =>
    dispatch({
      type: rhsmTypes.GET_SUBSCRIPTIONS_INVENTORY_RHSM,
      payload: rhsmServices.getSubscriptionsInventory(id, query),
      meta: {
        id,
        query,
        notifications: {}
      }
    });

const rhsmActions = {
  getGraphMetrics,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getMessageReports,
  getSubscriptionsInventory
};

export {
  rhsmActions as default,
  rhsmActions,
  getGraphMetrics,
  getHostsInventory,
  getHostsInventoryGuests,
  getInstancesInventory,
  getMessageReports,
  getSubscriptionsInventory
};

const GET_GRAPH_REPORT_CAPACITY_RHSM = 'GET_GRAPH_REPORT_CAPACITY_RHSM';
const GET_GRAPH_TALLY_RHSM = 'GET_GRAPH_TALLY_RHSM';
const GET_HOSTS_INVENTORY_RHSM = 'GET_HOSTS_INVENTORY_RHSM';
const GET_HOSTS_INVENTORY_GUESTS_RHSM = 'GET_HOSTS_INVENTORY_GUESTS_RHSM';
const GET_INSTANCES_INVENTORY_RHSM = 'GET_INSTANCES_INVENTORY_RHSM';
const GET_MESSAGE_REPORTS_RHSM = 'GET_MESSAGE_REPORTS_RHSM';
const GET_SUBSCRIPTIONS_INVENTORY_RHSM = 'GET_SUBSCRIPTIONS_INVENTORY_RHSM';

/**
 * RHSM API action, reducer types.
 *
 * @type {{GET_GRAPH_REPORT_CAPACITY_RHSM: string, GET_MESSAGE_REPORTS_RHSM: string, GET_HOSTS_INVENTORY_GUESTS_RHSM: string,
 *     GET_SUBSCRIPTIONS_INVENTORY_RHSM: string, GET_HOSTS_INVENTORY_RHSM: string, GET_INSTANCES_INVENTORY_RHSM: string,
 *     GET_GRAPH_TALLY_RHSM: string}}
 */
const rhsmTypes = {
  GET_GRAPH_REPORT_CAPACITY_RHSM,
  GET_GRAPH_TALLY_RHSM,
  GET_HOSTS_INVENTORY_RHSM,
  GET_HOSTS_INVENTORY_GUESTS_RHSM,
  GET_INSTANCES_INVENTORY_RHSM,
  GET_MESSAGE_REPORTS_RHSM,
  GET_SUBSCRIPTIONS_INVENTORY_RHSM
};

export {
  rhsmTypes as default,
  rhsmTypes,
  GET_GRAPH_REPORT_CAPACITY_RHSM,
  GET_GRAPH_TALLY_RHSM,
  GET_HOSTS_INVENTORY_RHSM,
  GET_HOSTS_INVENTORY_GUESTS_RHSM,
  GET_INSTANCES_INVENTORY_RHSM,
  GET_MESSAGE_REPORTS_RHSM,
  GET_SUBSCRIPTIONS_INVENTORY_RHSM
};

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'react-use';
import { TableVariant } from '@patternfly/react-table';
import { Bullseye, Card, CardActions, CardBody, CardFooter, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/TableToolbar';
import { useSession } from '../authentication/authenticationContext';
import {
  useProduct,
  useProductInventoryHostsConfig,
  useProductInventoryHostsQuery
} from '../productView/productViewContext';
import { helpers } from '../../common';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { MinHeight } from '../minHeight/minHeight';
import { InventoryGuests } from '../inventoryGuests/inventoryGuests';
import { inventoryCardHelpers } from './inventoryCardHelpers';
import Pagination from '../pagination/pagination';
import { ToolbarFieldDisplayName } from '../toolbar/toolbarFieldDisplayName';
import { paginationHelpers } from '../pagination/paginationHelpers';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { translate } from '../i18n/i18n';
import { useGetInstancesInventory, useOnPageInstances, useOnColumnSortInstances } from './inventoryCardContext';

/**
 * ToDo: Update table component and review the deep comparison use on data
 * The newer table wrapper should remove the need to use the deep comparison,
 * temporarily using to allow the move from the deprecated inventory.
 */
/**
 * Set up inventory cards. Expand filters with base settings.
 *
 * @param {object} props
 * @param {Node} props.cardActions
 * @param {boolean} props.isDisabled
 * @param {number} props.perPageDefault
 * @param {Function} props.t
 * @param {Function} props.useGetInventory
 * @param {Function} props.useOnPage
 * @param {Function} props.useOnColumnSort
 * @param {Function} props.useProduct
 * @param {Function} props.useProductInventoryConfig
 * @param {Function} props.useProductInventoryQuery
 * @param {Function} props.useSession
 * @fires onColumnSort
 * @fires onPage
 * @fires onUpdateInventoryData
 * @returns {Node}
 */
const InventoryCard = ({
  cardActions,
  isDisabled,
  perPageDefault,
  t,
  useGetInventory: useAliasGetInventory,
  useOnPage: useAliasOnPage,
  useOnColumnSort: useAliasOnColumnSort,
  useProduct: useAliasProduct,
  useProductInventoryConfig: useAliasProductInventoryConfig,
  useProductInventoryQuery: useAliasProductInventoryQuery,
  useSession: useAliasSession
}) => {
  const [updatedColumnsRows, setUpdatedColumnsRows] = useState({ columnHeaders: [], rows: [] });
  const sessionData = useAliasSession();
  const query = useAliasProductInventoryQuery();
  const onPage = useAliasOnPage();
  const onColumnSort = useAliasOnColumnSort();
  const { productId } = useAliasProduct();
  const { filters: filterInventoryData, settings } = useAliasProductInventoryConfig();
  const { error, fulfilled, pending, data = {} } = useAliasGetInventory({ isDisabled });
  const { data: listData = [], meta = {} } = data;

  useDeepCompareEffect(() => {
    let updatedColumnHeaders = [];
    let updatedRows = [];

    if (fulfilled && listData.length) {
      updatedRows = listData.map(({ ...cellData }) => {
        const { columnHeaders, cells } = inventoryCardHelpers.parseRowCellsListData({
          filters: inventoryCardHelpers.parseInventoryFilters({
            filters: filterInventoryData,
            onSort: onColumnSort,
            query
          }),
          cellData,
          meta,
          session: sessionData,
          productId
        });

        updatedColumnHeaders = columnHeaders;
        const subscriptionManagerId = cellData?.subscriptionManagerId;
        const numberOfGuests = cellData?.numberOfGuests;
        let isSubTable;

        // Is there a subTable, callback, or attempt to determine, return boolean
        if (typeof settings?.hasSubTable === 'function') {
          isSubTable = settings.hasSubTable({ ...cellData }, { ...sessionData });
        } else {
          isSubTable = numberOfGuests > 0 && subscriptionManagerId;
        }

        return {
          cells,
          expandedContent:
            (isSubTable && (
              <InventoryGuests
                key={`guests-${subscriptionManagerId}`}
                numberOfGuests={numberOfGuests}
                id={subscriptionManagerId}
              />
            )) ||
            undefined
        };
      });
    }

    setUpdatedColumnsRows(() => ({
      columnHeaders: updatedColumnHeaders,
      rows: updatedRows
    }));
  }, [filterInventoryData, fulfilled, listData]);

  if (isDisabled) {
    return (
      <Card className="curiosity-inventory-card__disabled">
        <CardBody>
          <Bullseye>{t('curiosity-inventory.tab', { context: 'disabled' })}</Bullseye>
        </CardBody>
      </Card>
    );
  }

  const itemCount = meta?.count;
  const updatedPerPage = query[RHSM_API_QUERY_SET_TYPES.LIMIT] || perPageDefault;
  const updatedOffset = query[RHSM_API_QUERY_SET_TYPES.OFFSET];
  const isLastPage = paginationHelpers.isLastPage(updatedOffset, updatedPerPage, itemCount);

  // Set an updated key to force refresh minHeight
  const minHeightContentRefreshKey =
    (fulfilled === true && itemCount < updatedPerPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (fulfilled === true && isLastPage && `bodyMinHeight-${updatedPerPage}-resize`) ||
    (error === true && `bodyMinHeight-${updatedPerPage}-resize`) ||
    `bodyMinHeight-${updatedPerPage}`;

  return (
    <Card className="curiosity-inventory-card">
      <MinHeight key="headerMinHeight" updateOnContent>
        <CardHeader className={(error && 'hidden') || ''} aria-hidden={error || false}>
          {cardActions}
          <CardActions className={(!itemCount && 'transparent') || ''} aria-hidden={!itemCount || false}>
            <Pagination
              isCompact
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={onPage}
              onPerPage={onPage}
              perPage={updatedPerPage}
            />
          </CardActions>
        </CardHeader>
      </MinHeight>
      <MinHeight key={minHeightContentRefreshKey} updateOnContent>
        <CardBody>
          <div className={(error && 'blur') || (pending && 'fadein') || ''}>
            {pending && (
              <Loader
                variant="table"
                tableProps={{
                  className: 'curiosity-inventory-list',
                  colCount: filterInventoryData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
                  colWidth:
                    (filterInventoryData?.length && filterInventoryData.map(({ cellWidth }) => cellWidth)) || [],
                  rowCount: listData?.length || updatedPerPage,
                  variant: TableVariant.compact
                }}
              />
            )}
            {!pending && (
              <Table
                borders
                variant={TableVariant.compact}
                className="curiosity-inventory-list"
                columnHeaders={updatedColumnsRows.columnHeaders}
                rows={updatedColumnsRows.rows}
              />
            )}
          </div>
        </CardBody>
      </MinHeight>
      <MinHeight key="footerMinHeight" updateOnContent>
        <CardFooter
          className={(error && 'hidden') || (!itemCount && 'transparent') || ''}
          aria-hidden={error || !itemCount || false}
        >
          <TableToolbar isFooter>
            <Pagination
              dropDirection="up"
              isDisabled={pending || error}
              itemCount={itemCount}
              offset={updatedOffset}
              onPage={onPage}
              onPerPage={onPage}
              perPage={updatedPerPage}
            />
          </TableToolbar>
        </CardFooter>
      </MinHeight>
    </Card>
  );
};

/**
 * Prop types.
 *
 * @type {{cardActions: React.ReactNode, useSession: Function, useOnPage: Function, useProduct: Function, t: Function,
 *     perPageDefault: number, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCard.propTypes = {
  cardActions: PropTypes.node,
  isDisabled: PropTypes.bool,
  perPageDefault: PropTypes.number,
  t: PropTypes.func,
  useGetInventory: PropTypes.func,
  useOnPage: PropTypes.func,
  useOnColumnSort: PropTypes.func,
  useProduct: PropTypes.func,
  useProductInventoryConfig: PropTypes.func,
  useProductInventoryQuery: PropTypes.func,
  useSession: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{cardActions: React.ReactNode, useSession: Function, useOnPage: Function, useProduct: Function, t: translate,
 *     perPageDefault: number, isDisabled: boolean, useProductInventoryConfig: Function, useGetInventory: Function,
 *     useOnColumnSort: Function, useProductInventoryQuery: Function}}
 */
InventoryCard.defaultProps = {
  cardActions: (
    <CardHeaderMain>
      <ToolbarFieldDisplayName />
    </CardHeaderMain>
  ),
  isDisabled: helpers.UI_DISABLED_TABLE_INSTANCES,
  perPageDefault: 10,
  t: translate,
  useGetInventory: useGetInstancesInventory,
  useOnPage: useOnPageInstances,
  useOnColumnSort: useOnColumnSortInstances,
  useProduct,
  useProductInventoryConfig: useProductInventoryHostsConfig,
  useProductInventoryQuery: useProductInventoryHostsQuery,
  useSession
};

export { InventoryCard as default, InventoryCard };

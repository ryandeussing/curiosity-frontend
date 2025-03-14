import React, { useMemo } from 'react';
import { ToolbarItem } from '@patternfly/react-core';
import { useProductQuery, useProductToolbarConfig } from '../productView/productViewContext';
import { RHSM_API_QUERY_SET_TYPES } from '../../services/rhsm/rhsmConstants';
import { useOnSelect as useSelectCategoryOnSelect, toolbarFieldOptions } from './toolbarFieldSelectCategory';
import { useOnSelect as useArchitectureOnSelect } from './toolbarFieldArchitecture';
import { useOnSelect as useBillingProviderOnSelect } from './toolbarFieldBillingProvider';
import { useOnSelect as useCategoryOnSelect } from './toolbarFieldCategory';
import { useOnSelect as useSlaOnSelect } from './toolbarFieldSla';
import { useOnSelect as useUsageOnSelect } from './toolbarFieldUsage';
import { useOnSelect as useVariantOnSelect } from './toolbarFieldVariant';
import { helpers } from '../../common/helpers';

/**
 * Clear a specific toolbar category using a select component's OnSelect hook.
 *
 * @param {object} options
 * @param {Function} options.useArchitectureOnSelect
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useCategoryOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @param {Function} options.useVariantOnSelect
 * @returns {Function}
 */
const useToolbarFieldClear = ({
  useArchitectureOnSelect: useAliasArchitectureOnSelect = useArchitectureOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useCategoryOnSelect: useAliasCategoryOnSelect = useCategoryOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect,
  useVariantOnSelect: useAliasVariantOnSelect = useVariantOnSelect
} = {}) => {
  const architectureOnSelect = useAliasArchitectureOnSelect();
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const categoryOnSelect = useAliasCategoryOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const variantOnSelect = useAliasVariantOnSelect();

  return field => {
    switch (field) {
      case RHSM_API_QUERY_SET_TYPES.ARCHITECTURE:
        architectureOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER:
        billingOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.CATEGORY:
        categoryOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.SLA:
        slaOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.USAGE:
        usageOnSelect();
        break;
      case RHSM_API_QUERY_SET_TYPES.VARIANT:
        variantOnSelect();
        break;
      default:
        break;
    }
  };
};

/**
 * Clear all available toolbar categories.
 *
 * @param {object} options
 * @param {Function} options.useProductQuery
 * @param {Function} options.useArchitectureOnSelect
 * @param {Function} options.useSelectCategoryOnSelect
 * @param {Function} options.useBillingProviderOnSelect
 * @param {Function} options.useCategoryOnSelect
 * @param {Function} options.useSlaOnSelect
 * @param {Function} options.useUsageOnSelect
 * @param {Function} options.useVariantOnSelect
 * @returns {Function}
 */
const useToolbarFieldClearAll = ({
  useProductQuery: useAliasProductQuery = useProductQuery,
  useArchitectureOnSelect: useAliasArchitectureOnSelect = useArchitectureOnSelect,
  useSelectCategoryOnSelect: useAliasSelectCategoryOnSelect = useSelectCategoryOnSelect,
  useBillingProviderOnSelect: useAliasBillingProviderOnSelect = useBillingProviderOnSelect,
  useCategoryOnSelect: useAliasCategoryOnSelect = useCategoryOnSelect,
  useSlaOnSelect: useAliasSlaOnSelect = useSlaOnSelect,
  useUsageOnSelect: useAliasUsageOnSelect = useUsageOnSelect,
  useVariantOnSelect: useAliasVariantOnSelect = useVariantOnSelect
} = {}) => {
  const {
    [RHSM_API_QUERY_SET_TYPES.ARCHITECTURE]: architecture,
    [RHSM_API_QUERY_SET_TYPES.BILLING_PROVIDER]: billingProvider,
    [RHSM_API_QUERY_SET_TYPES.CATEGORY]: category,
    [RHSM_API_QUERY_SET_TYPES.SLA]: sla,
    [RHSM_API_QUERY_SET_TYPES.USAGE]: usage,
    [RHSM_API_QUERY_SET_TYPES.VARIANT]: variant
  } = useAliasProductQuery();
  const architectureOnSelect = useAliasArchitectureOnSelect();
  const billingOnSelect = useAliasBillingProviderOnSelect();
  const categoryOnSelect = useAliasCategoryOnSelect();
  const slaOnSelect = useAliasSlaOnSelect();
  const usageOnSelect = useAliasUsageOnSelect();
  const selectCategoryOnSelect = useAliasSelectCategoryOnSelect();
  const variantOnSelect = useAliasVariantOnSelect();

  return hardFilterReset => {
    if (typeof architecture === 'string') {
      architectureOnSelect();
    }

    if (typeof billingProvider === 'string') {
      billingOnSelect();
    }

    if (typeof category === 'string') {
      categoryOnSelect();
    }

    if (typeof sla === 'string') {
      slaOnSelect();
    }

    if (typeof usage === 'string') {
      usageOnSelect();
    }

    if (typeof variant === 'string') {
      variantOnSelect();
    }

    if (hardFilterReset) {
      selectCategoryOnSelect();
    }
  };
};

/**
 * Return lists of item and secondary toolbar fields for display.
 *
 * @param {object} options
 * @param {Array} options.categoryOptions
 * @param {Function} options.useProductToolbarConfig
 * @returns {Array}
 */
const useToolbarFields = ({
  categoryOptions = toolbarFieldOptions,
  useProductToolbarConfig: useAliasProductToolbarConfig = useProductToolbarConfig
} = {}) => {
  const { filters = [] } = useAliasProductToolbarConfig();

  return useMemo(() => {
    const setFilter = ({ id, content, ...filterProps }) => {
      const option = categoryOptions.find(({ value: categoryOptionValue }) => id === categoryOptionValue);
      const { component: OptionComponent } = option || {};

      return (
        (OptionComponent && (
          <ToolbarItem key={`option-${id}`}>
            <OptionComponent isFilter={false} {...filterProps} />
          </ToolbarItem>
        )) || (
          <ToolbarItem key={id || helpers.generateId()}>
            {typeof content === 'function' ? content() : content}
          </ToolbarItem>
        ) ||
        null
      );
    };

    return {
      itemFields: filters.filter(({ isItem }) => isItem === true).map(setFilter),
      secondaryFields: filters.filter(({ isSecondary }) => isSecondary === true).map(setFilter)
    };
  }, [categoryOptions, filters]);
};

const context = {
  useToolbarFieldClear,
  useToolbarFieldClearAll,
  useToolbarFields
};

export { context as default, context, useToolbarFieldClear, useToolbarFieldClearAll, useToolbarFields };

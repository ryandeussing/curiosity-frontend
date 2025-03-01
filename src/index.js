/**
 * Used for standalone local run only.
 */
import './styles/standalone.scss';
import '@patternfly/react-core/dist/styles/base.css';
import('./bootstrap');
import { routerHelpers } from './components/router';

window.insights = {
  chrome: {
    appNavClick: ({ id, ...rest }) => {
      console.log(`Emulated appNavClick: ${JSON.stringify({ id, ...rest })}`);
      document.location.href = routerHelpers.pathJoin(
        document.location.pathname,
        routerHelpers.getRouteConfig({ id }).path
      );
    },
    auth: {
      getUser: () =>
        new Promise(resolve => {
          resolve({
            identity: {
              account_number: '0',
              type: 'User'
            }
          });
        })
    },
    getUserPermissions: () => [],
    hideGlobalFilter: Function.prototype,
    identifyApp: Function.prototype,
    init: Function.prototype,
    isBeta: Function.prototype,
    on: Function.prototype
  }
};

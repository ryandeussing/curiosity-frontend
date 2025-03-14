import platformServices from '../platformServices';

describe('PlatformServices', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e;
    }

    return response;
  };

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(platformServices)).toHaveLength(7);
  });

  it('should have specific methods', () => {
    expect(platformServices.getUser).toBeDefined();
    expect(platformServices.getUserPermissions).toBeDefined();
    expect(platformServices.hideGlobalFilter).toBeDefined();
    expect(platformServices.initializeChrome).toBeDefined();
    expect(platformServices.onNavigation).toBeDefined();
    expect(platformServices.setAppName).toBeDefined();
    expect(platformServices.setAppNav).toBeDefined();
  });

  /**
   *  timeout errors associated with this test sometimes stem from endpoint
   *  settings or missing globals, see "before" above, or the "setupTests" config
   */
  it('should return async for most methods and resolve successfully', async () => {
    const promises = Object.keys(platformServices).map(value => platformServices[value]());
    const response = await Promise.all(promises);

    expect(response.length).toEqual(Object.keys(platformServices).length);
  });

  it('should return a successful getUser', async () => {
    const { status, statusText, data, message } = await platformServices.getUser();

    expect({ status, statusText, data, message }).toMatchSnapshot('success authorized user');
  });

  it('should return a successful getUser with a specific response', async () => {
    window.insights.chrome.auth.getUser = jest.fn().mockImplementation(() => Promise.resolve('lorem ipsum'));
    const { status, statusText, data, message } = await platformServices.getUser();

    expect({ status, statusText, data, message }).toMatchSnapshot('specific success for authorized user');
  });

  it('should return a failed getUser', async () => {
    window.insights.chrome.auth.getUser = undefined;
    const { status, statusText, data, message } = await returnPromiseAsync(platformServices.getUser);

    expect({ status, statusText, data, message }).toMatchSnapshot('failed authorized user');
  });

  it('should return a failed getUserPermissions', async () => {
    window.insights.chrome.getUserPermissions = undefined;
    const { status, statusText, data, message } = await returnPromiseAsync(platformServices.getUserPermissions);

    expect({ status, statusText, data, message }).toMatchSnapshot('failed user permissions');
  });

  it('should return a failed hideGlobalFilter', async () => {
    window.insights.chrome.hideGlobalFilter = undefined;
    const response = await returnPromiseAsync(platformServices.hideGlobalFilter);

    expect(response).toMatchSnapshot('failed hideGlobalFilter');
  });

  it('should return a failed initializeChrome', async () => {
    window.insights.chrome.init = undefined;
    const response = await returnPromiseAsync(platformServices.initializeChrome);

    expect(response).toMatchSnapshot('failed initializeChrome');
  });

  it('should return a failed onNavigation', () => {
    window.insights.chrome.on = undefined;
    expect(platformServices.onNavigation).toThrow('{ on } = insights.chrome, insights.chrome.on is not a function');
  });

  it('should return a failed setAppName', async () => {
    window.insights.chrome.identifyApp = undefined;
    const { status, statusText, data, message } = await returnPromiseAsync(platformServices.setAppName);

    expect({ status, statusText, data, message }).toMatchSnapshot('failed setAppName');
  });

  it('should return a failed setAppNav', async () => {
    window.insights.chrome.appNavClick = undefined;
    const response = await returnPromiseAsync(platformServices.setAppNav);

    expect(response).toMatchSnapshot('failed setAppNav');
  });
});

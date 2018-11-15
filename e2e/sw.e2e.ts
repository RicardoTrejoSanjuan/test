import { browser, by, element } from 'protractor';

describe('Service worker page', () => {

  beforeAll( () => {
    browser.get('/sw');
  });

  it('should display the service worker page', () => {

    const titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Service worker example');

  });
});
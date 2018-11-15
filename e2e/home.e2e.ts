import { browser, by, element } from 'protractor';

describe('Home page', () => {

  beforeAll( () => {
    browser.get('/');
  });

  it('should display the homepage', () => {

    const titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('KS Welcome');

  });
});
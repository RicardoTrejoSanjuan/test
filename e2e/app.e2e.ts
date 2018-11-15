import { browser } from 'protractor';

describe('Application', () => {

  beforeEach(() => {
    browser.get('/');
  });

  it('should have a title', () => {
    const subject: any = browser.getTitle();
    expect(subject).toEqual('My MEAN Website');
  });
});

import { mount } from 'enzyme';

import { App } from './app';

describe('Landing App', () => {
  it('should feature the extension name', () => {
    const app = mount(<App />);

    expect(app.children().text()).toContain('Capture The Flag');
  });

  it('should offer to download extension', () => {
    const app = mount(<App />);

    expect(app.children().text()).toContain("Download It's free");
  });
});

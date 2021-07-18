import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { PopupContent } from '../../../view/components/popup_content';

export function render() {
  const ref = {
    popup: null as unknown as ReactWrapper,
  };

  beforeEach(() => {
    ref.popup = mount(<PopupContent />) as ReactWrapper;

    return act(async () => {
      await new Promise((resolve) => setTimeout(resolve));

      ref.popup.update();
    });
  });

  afterEach(() => {
    ref.popup.unmount();
    ref.popup = null as unknown as ReactWrapper;
  });

  return ref;
}

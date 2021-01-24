import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

export function popupDependencies(wrapper: ReactWrapper) {
  return act(async () => {
    await import('country-flag-emoji-json/json/flag-emojis-by-code.json');

    await new Promise((resolve) => setTimeout(resolve));

    wrapper.update();
  });
}

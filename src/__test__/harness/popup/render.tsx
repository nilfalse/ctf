import { ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';

export async function popupDependencies(wrapper: ReactWrapper) {
  await act(async () => {
    await import('country-flag-emoji-json/json/flag-emojis-by-code.json');

    await new Promise((resolve) => setTimeout(resolve));

    wrapper.update();
  });
}

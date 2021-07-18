import { render } from 'react-dom';

import * as debug from '../util/debug';
import { start } from '../view';
import { PopupContent } from '../view/components/popup_content';

debug.intro();

void start(() =>
  render(<PopupContent />, document.getElementById('react-root'))
);

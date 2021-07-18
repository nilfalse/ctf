import { render } from 'react-dom';

import * as debug from '../util/debug';
import { start } from '../view';
import { OptionsContent } from '../view/components/options_content';

debug.intro();

void start(() =>
  render(<OptionsContent />, document.getElementById('react-root'))
);

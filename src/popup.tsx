import { render } from 'react-dom';

import * as debug from './util/debug';
import { PopupContent } from './view/components/popup_content';

import './popup/index.css';

debug.intro();

render(<PopupContent />, document.getElementById('react-root'));

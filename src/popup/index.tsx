import { render } from 'react-dom';

import * as debug from '../debug';
import { PopupContent } from '../view/components/popup_content';

import './index.css';

debug.intro();

render(<PopupContent />, document.getElementById('react-root'));

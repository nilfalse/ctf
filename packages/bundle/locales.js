import path from 'path';
import url from 'url';

import { main } from 'cli/locales.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

main(__dirname, ...process.argv.slice(2));

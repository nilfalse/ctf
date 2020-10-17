#!/usr/bin/env node --unhandled-rejections=strict --experimental-json-modules
import path from 'path';
import url from 'url';

import { main } from './lib/locales.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

main(__dirname, process.argv.slice(2));

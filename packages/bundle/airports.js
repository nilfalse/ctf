import { main } from 'cli/airports.js';

main(process.argv.slice(2)).then(
  (output) => process.stdout.write(output),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);

import { Command } from 'commander';
import { createRequire } from 'module';

import { registerSeedCommand } from './commands/seed.js';
import { registerLeafCommand } from './commands/leaf.js';

const require = createRequire(import.meta.url);
const { version, description } = require('../package.json');

const program = new Command();

program.name('plantum')
    .description(description)
    .version(version);
    
registerSeedCommand(program);
registerLeafCommand(program);

program.parseAsync(process.argv);
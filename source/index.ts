import chalk from 'chalk';

import createTextFile from './createTextFile.js';
import gatherFiles from './gatherFiles.js';
import parseArguments from './parseArguments.js';
import Stats from './Stats.js';


const LABEL_TYPE      = '     Type ';
const LABEL_OUTPUT    = '   Output ';
const LABEL_DIRECTORY = 'Directory ';
const LABEL_INCLUDE   = '  Include ';
const LABEL_EXCLUDE   = '  Exclude ';

function main() {
    process.stdout.write("\u001b[2J\u001b[0;0H");
    const args = parseArguments(process.argv);

    console.log(args);

    // process.exit();

    console.log(chalk.underline('File Stats - Options'));

    console.log(`${chalk.bgCyanBright.black(LABEL_TYPE)} ${chalk.whiteBright(args.type)}`);
    console.log(`${chalk.bgCyanBright.black(LABEL_OUTPUT)} ${chalk.whiteBright(args.output)}`);

    if(args.include) {
        console.log(`${chalk.bgCyanBright.black(LABEL_INCLUDE)} ${chalk.whiteBright(args.include!.join(', '))}`);
    }

    if(args.exclude) {
        console.log(`${chalk.bgCyanBright.black(LABEL_EXCLUDE)} ${chalk.whiteBright(args.exclude!.join(', '))}`);
    }

    args.directory.forEach(dir => console.log(`${chalk.bgCyanBright.black(LABEL_DIRECTORY)} ${chalk.whiteBright(dir)}`));

    const entries = gatherFiles(args);

    console.log('Gathering stats');
    const stats = new Stats();

    entries.forEach(entry => stats.add(entry));

    console.log(`Writing file...`);
    createTextFile(entries, args, stats, args.output);
 }



main();
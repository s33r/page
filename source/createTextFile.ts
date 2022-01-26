import fs from 'fs';

import Entry from './Entry.js';
import { Arguments } from './parseArguments.js';
import Stats from './Stats.js';

const TAG_PADDING = 20;
const LINE_LENGTH = 100;

const LABEL_TYPE      = '     Type ';
const LABEL_OUTPUT    = '   Output ';
const LABEL_DIRECTORY = 'Directory ';
const LABEL_INCLUDE   = '  Include ';
const LABEL_EXCLUDE   = '  Exclude ';

function writeEntries(list: Entry[], lines: string[]) {

    for(let j = 0; j < list.length; j++) {
        const entry : Entry = list[j];

        lines.push(entry.toLine());
    }
}

function writeStats(stats: Stats, lines: string[]) {
    Object.keys(stats.tags)
        .forEach(tag => lines.push(`  [${tag.padStart(TAG_PADDING)}] ${stats.tags[tag]}`));
}

export default function createTextFile(list: Entry[], args: Arguments, stats: Stats, location: string) {
    const lines: string[] = [];

    lines.push(`#`.repeat(LINE_LENGTH));
    lines.push(`# File Report`);
    lines.push(`#`.repeat(LINE_LENGTH));

    lines.push(`      Files: ${list.length}`);
    lines.push(` Stat Files: ${args.stat}`);

    if(args.include) {
        lines.push(`    Include: ${args.include!.join(', ')}`);
    }

    if(args.exclude) {
        lines.push(`    Exclude: ${args.exclude!.join(', ')}`);
    }


    args.directory.forEach(dir => lines.push(`  Directory:  ${dir}`));

    lines.push('');
    lines.push(`-`.repeat(LINE_LENGTH));
    lines.push(`- Stats`);
    lines.push(`-`.repeat(LINE_LENGTH));
    writeStats(stats, lines);

    lines.push('');
    lines.push(`-`.repeat(LINE_LENGTH));
    lines.push(`- Entries`);
    lines.push(`-`.repeat(LINE_LENGTH));
    writeEntries(list, lines);


    fs.writeFileSync(location, lines.join('\n'));
}
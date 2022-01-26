import path from 'path';
import fs, { Dirent } from 'fs';

import Entry from './Entry.js';
import chalk from 'chalk';
import { EntryTags } from './EntryTags.js';
import { Arguments } from './parseArguments.js';

type TagMap = {
    [key: string]: boolean,
}

enum FilterMode {
    None = 'none',
    Exclude = ' exclude',
    Include = 'include',
}

function createTagMap(tags: string[]) : TagMap {
    const result : TagMap = {};

    for(let j = 0; j < tags.length; j++) {
        result[tags[j]] = true;
    }

    return result;
}

function collect(location : string, filter: TagMap, filterMode: FilterMode, stat: boolean, current: Entry[]) : Entry[] {

    let dir : Dirent[] = [];

    try {
        dir = fs.readdirSync(location, {
            withFileTypes: true,
        });
    } catch(error) {
        if(error instanceof Error) {
            console.log(error.message);
        } else if((error instanceof Object) && (error.toString)) {
            console.log(error.toString());
        } else {
            console.log(error);
        }
    }

    for(let index = 0; index < dir.length; index++) {
        const entry = dir[index];
        const fullPath = path.resolve(location, entry.name);

        if(entry.isFile())
        {
            const entry = new Entry(fullPath);

            if(filterMode == FilterMode.None) {
                current.push(entry);

                if(stat) {
                    entry.getStats();
                }
            } else if(filterMode == FilterMode.Include) {
                if(!!filter[entry.tag]) {
                    current.push(entry);

                    if(stat) {
                        entry.getStats();
                    }
                }
            } else if(filterMode == FilterMode.Exclude) {
                if(!filter[entry.tag]) {
                    current.push(entry);

                    if(stat) {
                        entry.getStats();
                    }
                }
            }
        }

        if(entry.isDirectory()) {
            collect(fullPath, filter, filterMode, stat, current);
        }
    }

    return current;
}



export default function gatherFiles(args: Arguments) : Entry[]{
    const result : Entry[] = [];

    let filterMode: FilterMode = FilterMode.None;
    let filterTags: TagMap = {};

    if(!!args.include) {
        filterMode = FilterMode.Include;
        filterTags = createTagMap(args.include);
    }

    if(!!args.exclude) {
        filterMode = FilterMode.Exclude;
        filterTags = createTagMap(args.exclude);
    }

    for(let j = 0; j < args.directory.length; j++) {

        console.log(chalk.underline('File Stats - Started'));
        console.log(chalk.bgCyanBright.black(`Location: ${args.directory[j]}`));

        const entries = collect(args.directory[j], filterTags, filterMode, args.stat, result);

        console.log(`Found: ${entries.length} Done!`);
    }

    return result;
}

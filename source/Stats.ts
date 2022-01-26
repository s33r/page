import Entry from './Entry.js';

export type TagEntry = {
    [key: string]: number
}


export default class Stats {

    private readonly _tags: TagEntry;
    private _length: number;

    public get length() : number {
        return this._length;
    }

    public add(entry: Entry) {
        if(!this._tags[entry.tag]) {
            this._tags[entry.tag] = 0;
        }

        this._tags[entry.tag]++;
        this._length++;
    }

    public get tags() : TagEntry {
        return Object.assign({}, this._tags);
    }



    constructor() {
        this._tags = {};
        this._length = 0;
    }
}
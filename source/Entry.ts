import fs, { Stats } from 'fs';
import path, { ParsedPath } from 'path';
import { EntryTags, getTag } from './EntryTags.js';

const TAG_PADDING = 20;




export default class Entry {
    private _error : Error | null = null;
    private _tag: string = EntryTags.None;
    private _stats: Stats | null = null;
    private _magnitude: number = 0;

    public readonly location: string;

    public readonly parsedPath: ParsedPath = {
        root: '',
        dir: '',
        base: '',
        ext: '',
        name: '',
    };

    public get hasStats(): boolean  {
        return !!this._stats;
    }

    public get stats() : Stats {
        return this._stats || new Stats();
    }

    public get hasError(): boolean {
        return !!this._error;
    }

    public get error() : Error {
        return this._error || new Error('No Error');
    }

    public get tag() {
        return this._tag;
    }

    public getStats() {
        if(this.hasError) {
            return;
        }

        try {
            this._stats = fs.statSync(this.location);

            this._magnitude = this._stats.size.toString().length;
        } catch(error) {
            let errorActual : Error;

            if(error instanceof Error) {
                errorActual = error;
            } else {
                errorActual = new Error(error + '');
            }
        }
    }

    toLine() : string{
        const flag = this.hasError ? '!' : ' ';
        const tag = `[${this.tag.padStart(TAG_PADDING)}]`;
        const mag = this._magnitude.toString().padStart(2, '0');
        const message = this.hasError ? this.error.message : this.location;

        return `${flag}${mag}${tag} ${message}`;


    }

    constructor(location: string, tag: string | null = null) {
        this.location = location;

        try {
            this.parsedPath = path.parse(this.location);
        } catch(error) {
            let errorActual : Error;

            if(error instanceof Error) {
                errorActual = error;
            } else {
                errorActual = new Error(error + '');
            }
        }

        if(!!tag) {
            this._tag = tag;
        } else {
            this._tag = getTag(this._tag)
        }

        this._tag = getTag(this.location);
    }
}
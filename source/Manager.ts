export default class Manager {
    public threads: number;

    constructor(threads = 4) {
        this.threads = threads;
    }
}
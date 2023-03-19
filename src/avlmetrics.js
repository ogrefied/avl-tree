export class Metrics {
    constructor() {
        this.counters = {}
    }

    initialize(counter, value = 0) {
        this.counters[counter] = value;
        return this.counters[counter];
    }
    
    increment(counter) {
        if (!this.counters[counter])
            this.counters[counter] = 0;
        this.counters[counter]++;
        return this.counters[counter];
    }
}

class Metrics {
    constructor() {
        this.counters = {}
    }

    increment(counter) {
        if (!this.counters[counter])
            this.counters[counter] = 0;
        this.counters[counter]++;
        return this.counters[counter];
    }
}

module.exports = Metrics;
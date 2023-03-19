import { Node } from './avlnode';
import {
    AvlTreeConstructionError,
    AvlTreeSearchValueEmptyError,
} from './avlerrors';
import { Metrics } from './avlmetrics';

export class Tree {
    constructor(asType = Node) {
        this.root = new asType();
    }

    add(payload) {
        const { newRootNode } = this.root.add(payload);
        if (newRootNode)
            this.root = newRootNode;
    }

    depth() {
        let metrics = new Metrics();
        metrics.initialize('depth');
        metrics.initialize('searchLeft');
        metrics.initialize('searchRight');
        return this.root.depth(metrics).counters;
    }

    find(value) {
        if (value == null)
            throw new AvlTreeSearchValueEmptyError();
        let metrics = new Metrics();
        return this.root.find(value, metrics);
    }

    toArray(options = { notation: "infix" }) {
        let out = [];
        this.root.toArray(out, options.notation);
        return out;
    }

    static fromArray(source) {
        if (!Array.isArray(source))
            throw new AvlTreeConstructionError();
        let tree = new Tree();
        source.forEach(element => tree.add(element));
        return tree;
    }

    metrics() {
        return this.root.getMetrics();
    }
}

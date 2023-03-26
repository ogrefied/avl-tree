import { Node } from './avlnode';
import {
    AvlTreeConstructionError,
    AvlTreeParameterTypeMismatchError,
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

    depth(callMetrics = null) {
        if (callMetrics != null && !(callMetrics instanceof Metrics))
            throw new AvlTreeParameterTypeMismatchError('Metrics', typeof callMetrics);
        let level = 0;
        return this.root.depth(level, callMetrics);
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

    toJson() {
        return this.root.toJson();
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

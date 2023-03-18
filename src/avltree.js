const Node = require('./avlnode');

class Tree {
    constructor(asType = Node) {
        this.root = new asType();
    }

    add(payload) {
        const { newRootNode } = this.root.add(payload);
        if (newRootNode)
            this.root = newRootNode;
    }

    toArray(options = { notation: "infix" }) {
        let out = [];
        this.root.toArray(out, options.notation);
        return out;
    }

    static fromArray(source) {
        if (!Array.isArray(source))
            throw new Error(`Cannot create tree from non-array source`);
        let tree = new Tree();
        source.forEach(element => tree.add(element));
        return tree;
    }

    metrics() {
        return this.root.getMetrics();
    }
}

module.exports = Tree;
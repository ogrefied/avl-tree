export class AvlTreeError {
    #message;
    constructor(message) {
        this.#message = message;
    }

    toString() {
        return this.#message;
    }
}

export class AvlTreeBalanceLeftOnEmptyNode extends AvlTreeError {
    constructor() {
        super(`Cannot left balance a null node`);
    }
}

export class AvlTreeBalanceRightOnEmptyNode extends AvlTreeError {
    constructor() {
        super(`Cannot right balance a null node`);
    }
}

export class AvlTreeConstructionError extends AvlTreeError {
    constructor() {
        super(`Cannot create tree from non-array source`);
    }
}

export class AvlTreeDuplicateKeyError extends AvlTreeError {
    constructor(key) {
        super(`Duplicate value "${key} cannot be inserted`);
    }
}

export class AvlTreeEmptyPayloadError extends AvlTreeError {
    constructor() {
        super(`Value error: Cannot insert null or undefined as a payload`);
    }
}

export class AvlTreeRotateLeftWithoutRightChild extends AvlTreeError {
    constructor(nodePayload) {
        super(`Rotation Error: Cannot rotate left without right-hand child at node: ${nodePayload}`);
    }
}

export class AvlTreeRotateRightWithoutLeftChild extends AvlTreeError {
    constructor(nodePayload) {
        super(`Rotation Error: Cannot rotate right without left-hand child at node: ${nodePayload}`);
    }
}

export class AvlTreeRotationOnEmptyNode extends AvlTreeError {
    constructor() {
        super(`Cannot rotate a null node`);
    }
}

export class AvlTreeTypeMismatchError extends AvlTreeError {
    constructor(insertedType, existingType) {
        super(`Type mismatch: Insertion value type ${insertedType} does not match existing type ${existingType}.`);
    }
}

import {
    AvlTreeBalanceLeftOnEmptyNodeError,
    AvlTreeBalanceRightOnEmptyNodeError,
    AvlTreeDuplicateKeyError,
    AvlTreeEmptyPayloadError,
    AvlTreeRotateLeftWithoutRightChildError,
    AvlTreeRotateRightWithoutLeftChildError,
    AvlTreeRotationOnEmptyNodeError,
    AvlTreeTypeMismatchError,
} from '../src/avlerrors';
import { Metrics } from './avlmetrics';

const LEFT_HIGH = 'LEFT_HIGH';
const BALANCED = 'BALANCED';
const RIGHT_HIGH = 'RIGHT_HIGH';

export class Node {
    constructor() {
        this.payload = null;
        this.left = null;
        this.right = null;
        this.balance = BALANCED;
        this.metrics = new Metrics();
    }

    getMetrics() {
        let mine = {...this.metrics.counters};
        const lm = this.left ? this.left.getMetrics() : {};
        const rm = this.right ? this.right.getMetrics() : {};
        Object.getOwnPropertyNames(lm).forEach(m => mine[m] ? mine[m] += lm[m] : mine[m] = lm[m]);
        Object.getOwnPropertyNames(rm).forEach(m => mine[m] ? mine[m] += rm[m] : mine[m] = rm[m]);
        return mine;
    }

    toArray(out, notation) {
        switch (notation) {
            case 'prefix':
                out.push(this.payload);
                this.left && this.left.toArray(out, notation);
                this.right && this.right.toArray(out, notation);
                break;
            case 'postfix':
                this.left && this.left.toArray(out, notation);
                this.right && this.right.toArray(out, notation);
                out.push(this.payload);
                break;
            case 'infix':
            default:
                this.left && this.left.toArray(out, notation);
                out.push(this.payload);
                this.right && this.right.toArray(out, notation);
                break;
        }
    }

    rotateLeft(oldRoot) {
        /* These error checks are probably unnecessary since class Node
         * is used exclusively by class Tree
         */
        /* istanbul ignore if */
        if (!oldRoot)
            throw new AvlTreeRotationOnEmptyNodeError();
        /* istanbul ignore if */
        if (!oldRoot.right)
            throw new AvlTreeRotateLeftWithoutRightChildError(oldRoot.payload);
        oldRoot.metrics.increment('rotateLeft');
        let newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        newRoot.left = oldRoot;
        return newRoot;
    }

    rotateRight(oldRoot) {
        oldRoot.metrics.increment('rotateRight');
        /* istanbul ignore if */
        if (!oldRoot)
            throw new AvlTreeRotationOnEmptyNodeError();
        /* istanbul ignore if */
        if (!oldRoot.left)
            throw new AvlTreeRotateRightWithoutLeftChildError(oldRoot.payload);
        let newRoot = oldRoot.left;
        oldRoot.left = newRoot.right;
        newRoot.right = oldRoot;
        return newRoot;
    }

    /**
     * rightBalance
     * @param {Object} atNode - the node which needs to be right balanced
     * 
     * In this case, a new node was added to the right subtree of atNode,
     * causing the tree to grow (in depth) beyond AVL constraints.  The
     * right side of atNode needs to be balanced.
     * 
     * Here, atNode is RIGHT_HIGH when the subtree grew by another level.
     * 
     * It's possible that the node location occupied by atNode will change
     * if a rotation is required.  In this case, a newRootNode value will
     * be returned.  This value should be checked and if present, update
     * the left or right link above this node, accordingly.
     */
    rightBalance(atNode) {
        atNode.metrics.increment('rightBalance');
        /* istanbul ignore if */
        if (!atNode)
            throw new AvlTreeBalanceRightOnEmptyNodeError();
        let atNodeRight = atNode.right;
        switch (atNodeRight.balance) {
            case RIGHT_HIGH:
                //This requires a left rotation.  After the rotation...
                atNode.balance = BALANCED;      //this node is balanced
                atNodeRight.balance = BALANCED; //as is new root node
                return { taller: false, newRootNode: this.rotateLeft(atNode) };
            /* istanbul ignore next */
            case BALANCED:
                throw new Error('Missed a balance operation. ' +
                    'This should never happen in a valid AVL Tree');
                break;
            case LEFT_HIGH:
                //This requires a double rotation
                let newRootNode = atNodeRight.left;
                switch (newRootNode.balance) {

                    case BALANCED:
                        atNode.balance = BALANCED;
                        atNodeRight.balance = BALANCED;
                        break;
                    case LEFT_HIGH:
                        atNode.balance = BALANCED;
                        atNodeRight.balance = RIGHT_HIGH;
                        break;
                    case RIGHT_HIGH:
                        atNode.balance = LEFT_HIGH;
                        atNodeRight.balance = BALANCED;
                        break;
                }
                newRootNode.balance = BALANCED;
                atNode.right = this.rotateRight(atNodeRight);
                return { taller: false, newRootNode: this.rotateLeft(atNode) };
        }
    }

    leftBalance(atNode) {
        atNode.metrics.increment('leftBalance');
        /* istanbul ignore if */
        if (!atNode)
            throw new AvlTreeBalanceLeftOnEmptyNodeError();
        // if (!atNode.left || !atNode.left.right)
        //     throw new Error('Cannot left balance this tree');
        let atNodeLeft = atNode.left;
        switch (atNodeLeft.balance) {
            case LEFT_HIGH:
                //This requires a right rotation.  After the rotation...
                atNode.balance = BALANCED;      //this node is balanced
                atNodeLeft.balance = BALANCED; //as is new root node
                return { taller: false, newRootNode: this.rotateRight(atNode) };
            /* istanbul ignore next */
            case BALANCED:
                throw new Error('Missed a balance operation. ' +
                    'This should never happen in a valid AVL Tree');
                break;
            case RIGHT_HIGH:
                //This requires a double rotation
                let newRootNode = atNodeLeft.right;
                switch (newRootNode.balance) {
                    case BALANCED:
                        atNode.balance = BALANCED;
                        atNodeLeft.balance = BALANCED;
                        break;
                    case LEFT_HIGH:
                        atNode.balance = RIGHT_HIGH;
                        atNodeLeft.balance = BALANCED;
                        break;
                    case RIGHT_HIGH:
                        atNode.balance = BALANCED;
                        atNodeLeft.balance = LEFT_HIGH;
                        break;
                }
                newRootNode.balance = BALANCED;
                atNode.left = this.rotateLeft(atNodeLeft);
                return { taller: false, newRootNode: this.rotateRight(atNode) };
        }
    }

    add(payload) {
        if (payload == null)
            throw new AvlTreeEmptyPayloadError();
        let thisTreeIsTaller = false;//whether this insertion grows the depth of this tree
        let subtreeIsTaller = false; //whether this insertion grows the depth of a subtree
        let newRootNode = null;      //if a rotation is required in a subtree
        if (!this.payload) {
            this.payload = payload;
            this.balance = BALANCED;
            this.metrics.increment('insertion');
            //Technically, the tree grew taller when adding this node to the tree.
            //For simplicity of coding, consider the tree to grow when we add the
            //payload to the empty node.  In this way, both new node adds, as well
            //as adds in a subtree can be handled in the same manner, namely via the
            //return value of the add() call.
            return { taller: true };
        }
        const existingType = typeof this.payload;
        const insertedType = typeof payload;
        if (insertedType !== existingType)
            throw new AvlTreeTypeMismatchError(insertedType, existingType);
        if (payload > this.payload) {   //add right
            if (!this.right)
                this.right = new Node();
            let taller;
            ({ taller, newRootNode } = this.right.add(payload));
            this.metrics.increment('add');
            if (newRootNode) {
                this.right = newRootNode;
                newRootNode = null;
            }
            subtreeIsTaller = taller;
            if (subtreeIsTaller) {
                //Just added a node to the right. If the tree grew taller then
                //the next step depends on the old balance state of the node.
                //If the old state was...
                switch (this.balance) {
                    case LEFT_HIGH:
                        //adding a node to the right makes this node balanced, and
                        //inform the parent call of add() that the tree did not grow
                        this.balance = BALANCED
                        thisTreeIsTaller = false;
                        break;
                    case BALANCED:
                        //adding a node to the right makes this node RIGHT_HIGH, and
                        //inform the parent call of add() that the tree did grow
                        this.balance = RIGHT_HIGH;
                        thisTreeIsTaller = true;
                        break;
                    case RIGHT_HIGH:
                        //AVL Tree violation; can only grow depth at most +1 on any
                        //given node.  This tree requires a rightBalance operation.
                        ({ taller, newRootNode } = this.rightBalance(this));
                        thisTreeIsTaller = taller;
                        break;
                }
            } else {
                thisTreeIsTaller = false;
            }
        } else if (payload < this.payload) {    //add left
            if (!this.left)
                this.left = new Node();
            let taller;
            ({ taller, newRootNode } = this.left.add(payload));
            this.metrics.increment('add');
            if (newRootNode) {
                this.left = newRootNode;
                newRootNode = null;
            }
            subtreeIsTaller = taller;
            if (subtreeIsTaller) {
                //Subtree is taller after adding a node on the left.  If the old
                //state was...
                switch (this.balance) {
                    case LEFT_HIGH:
                        //Need to rebalance to remain compliant with AVL Tree design
                        ({ taller, newRootNode } = this.leftBalance(this));
                        thisTreeIsTaller = taller;
                        break;
                    case BALANCED:
                        //Now this node is LH and the tree is taller
                        this.balance = LEFT_HIGH;
                        thisTreeIsTaller = true;
                        break;
                    case RIGHT_HIGH:
                        //Now the tree is balanced and the tree is not taller
                        this.balance = BALANCED;
                        thisTreeIsTaller = false;
                        break;
                }
            } else {
                thisTreeIsTaller = false;
            }
        } else {
            //add with equal key
            //add a resulting payload to this nodes list
            //for now just
            throw new AvlTreeDuplicateKeyError(payload);
        }
        return {
            taller: thisTreeIsTaller,
            newRootNode
        }
    }
}

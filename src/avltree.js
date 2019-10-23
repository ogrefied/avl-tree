const LEFT_HIGH = "LEFT_HIGH";
const BALANCED = "BALANCED";
const RIGHT_HIGH = "RIGHT_HIGH";

class Node {
    constructor() {
        this.payload = null;
        this.left = null;
        this.right = null;
    }

    rotateLeft(oldRoot) {
        if (!oldRoot)
            throw new Error('Cannot rotate a null node');
        if (!oldRoot.right)
            throw new Error('Cannot rotate left if node.right is null');
        let newRoot = oldRoot.right;
        oldRoot.right = newRoot.left;
        newRoot.left = oldRoot;
        return newRoot;
    }

    rotateRight(oldRoot) {
        if (!oldRoot)
            throw new Error('Cannot rotate a null node');
        if (!oldRoot.left)
            throw new Error('Cannot rotate right if node.left is null');
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
        if (!atNode)
            throw new Error('Cannot right balance a null node');
        // if (!atNode.right || !atNode.right.left)
        //     throw new Error('Cannot right balance this tree');
        let atNodeRight = atNode.right;
        switch (atNodeRight.balance) {
            case RIGHT_HIGH:
                //This requires a left rotation.  After the rotation...
                atNode.balance = BALANCED;      //this node is balanced
                atNodeRight.balance = BALANCED; //as is new root node
                return { taller: false, newRootNode: this.rotateLeft(atNode) };
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

    add(payload) {
        let thisTreeIsTaller = false;//whether this insertion grows the depth of this tree
        let subtreeIsTaller = false; //whether this insertion grows the depth of a subtree
        let newRootNode = null;      //if a rotation is required in a subtree
        if (!this.payload) {
            this.payload = payload;
            this.balance = BALANCED;
            //Technically, the tree grew taller when adding this node to the tree.
            //For simplicity of coding, consider the tree to grow when we add the
            //payload to the empty node.  In this way, both new node adds, as well
            //as adds in a subtree can be handled in the same manner, namely via the
            //return value of the add() call.
            return { taller: true };
        }
        if (payload > this.payload) {   //add right
            if (!this.right)
                this.right = new Node();
            let { taller } = this.right.add(payload);
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
            let { taller } = this.left.add(payload);
            subtreeIsTaller = taller;
            if (subtreeIsTaller) {
                //Subtree is taller after adding a node on the left.  If the old
                //state was...
                switch (this.balance) {
                    case LEFT_HIGH:
                        //Need to rebalance to remain compliant with AVL Tree design
                        ({ taller, newRootNode } = this.leftBalance(this));
                        if (newRootNode)
                            this.left = newRootNode;
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
            throw new Error('Adding multiple values with the same key not implemented.');
        }
        return {
            taller: thisTreeIsTaller,
            newRootNode
        }
    }

}

class Tree {
    constructor() {
        this.root = new Node();
    }

    add(payload) {
        const { newRootNode } = this.root.add(payload);
        if (newRootNode)
            this.root = newRootNode;
    }

}

module.exports = Tree;
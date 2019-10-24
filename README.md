# AVL Tree
This package implements a basic [AVL Tree](https://en.wikipedia.org/wiki/AVL_tree).  Basic means node payloads are scalar and comparable with built-in operators `<`, `<=`, `>`, `>=`.  The current implementation supports insert only.  There is no validation that inputs match previous types.

There is, however, tests for full code coverage and basic metrics for tree operations.

## Usage
``` javascript
const Tree = require('avl-tree');
let tree = new Tree();
tree.add('a');
tree.add('b');
tree.add('f');  // causes a left rotation
tree.add('c');
tree.add('d');  // causes a double rotation R balance
tree.toArray(); // outputs tree in 'infix' order, by default
tree.toArray({notation: 'postfix'}); // output in postfix order
tree.toArray({notation: 'prefix'});  // output in prefix order
```
## Statistics
Basic metrics are available.  Calling `tree.metrics()` return a JSON object with aggregated statistics for the entire tree:
  * add - Number of times a new value is added to any part of the tree.
  * insertion - Number of times a new value is added to the entire tree.  Should match the number of values added to the tree by `tree.add()`.
  * leftRotation / rightRotation - Number of times a left- or right-rotation took place.
  * leftBalance / rightBalance - Number of times the tree violated AVL constraints and required the left- or right side to be balanced.

I have plans to extend the general usefulness of this module and I welcome all suggestions!


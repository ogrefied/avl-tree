import { Tree } from '../src/avltree';
import { Metrics } from '../src/avlmetrics';
import {
    AvlTreeConstructionError,
    AvlTreeDuplicateKeyError,
    AvlTreeEmptyPayloadError,
    AvlTreeParameterTypeMismatchError,
    AvlTreeSearchValueEmptyError,
    AvlTreeTypeMismatchError,
} from '../src/avlerrors';

test('throw error on duplicate key', () => {
    let t = new Tree();
    t.add('a');
    expect(() => t.add('a')).toThrow(new AvlTreeDuplicateKeyError('a').toString());
});

describe('AVL Tree creation', () => {
    test('should create an empty tree on construction', () => {
        const tree = new Tree();
        expect(tree.root).toBeTruthy();
        expect(tree.root.payload).toBe(null);
        expect(tree.root.left).toBe(null);
        expect(tree.root.right).toBe(null);
        expect(tree.root.balance).toBe('BALANCED');
    });
    test('should return an empty tree when a source array is empty', () => {
        const tree = Tree.fromArray([]);
        expect(tree.root).toBeTruthy();
        expect(tree.root.payload).toBe(null);
        expect(tree.root.left).toBe(null);
        expect(tree.root.right).toBe(null);
        expect(tree.root.balance).toBe('BALANCED');
    });
    test('should return proper insertion order when created from an array', () => {
        const tree = Tree.fromArray(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
    });
    test('should throw an error when a source is not an array', () => {
        expect(() => Tree.fromArray('x')).toThrow(new AvlTreeConstructionError().toString());
        expect(() => Tree.fromArray(1)).toThrow(new AvlTreeConstructionError().toString());
        expect(() => Tree.fromArray(true)).toThrow(new AvlTreeConstructionError().toString());
        expect(() => Tree.fromArray({})).toThrow(new AvlTreeConstructionError().toString());
    });
});
describe('AVL Tree insertions', () => {
    test('should throw an error when a mismatched type is inserted', () => {
        const tree = new Tree();
        tree.add('a');
        expect(() => tree.add(1)).toThrow(new AvlTreeTypeMismatchError('number', 'string').toString());
        expect(() => tree.add({})).toThrow(new AvlTreeTypeMismatchError('object', 'string').toString());
    });
    test('should throw an error when a nullish value is inserted', () => {
        const tree = new Tree();
        expect(() => tree.add(null)).toThrow(new AvlTreeEmptyPayloadError().toString());
        expect(() => tree.add(undefined)).toThrow(new AvlTreeEmptyPayloadError().toString());
    });

    // SINGLE ROTATIONS
    test('should result in a left rotation when added in sequence order', () => {
        const tree = new Tree();
        tree.add('a');
        tree.add('b');
        tree.add('c');
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toBeUndefined();
        expect(metrics.addRight).toEqual(3); // 2 right a, 1 right of b
        expect(metrics.insertion).toEqual(3);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toEqual(1);
        expect(metrics.rotateRight).toBeUndefined();
        expect(metrics.leftBalance).toBeUndefined();
    });
    test('should result in a right rotation when added in reverse order', () => {
        const tree = new Tree();
        tree.add('c');
        tree.add('b');
        tree.add('a');
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(3); // 2 left of c, 1 left of b
        expect(metrics.addRight).toBeUndefined();
        expect(metrics.insertion).toEqual(3);
        expect(metrics.rotateLeft).toBeUndefined();
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });

    // DOUBLE ROTATIONS
    test('should right balance with a double rotation when the new root was left high after the insertion', () => {
        const tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('e');
        tree.add('d');
        tree.add('f');
        tree.add('c'); //double rotation; right balance
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(4);
        expect(metrics.addRight).toEqual(5);
        expect(metrics.insertion).toEqual(6);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toEqual(1);
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toBeUndefined();
    });
    test('should right balance with a double rotation when the new root was right high after the insertion', () => {
        const tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('e');
        tree.add('c');
        tree.add('f');
        tree.add('d'); //double rotation; right balance
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(3);
        expect(metrics.addRight).toEqual(6);
        expect(metrics.insertion).toEqual(6);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toEqual(1);
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toBeUndefined();
    });
    test('should right balance with a double rotation when the new root is balanced after the insertion', () => {
        const tree = new Tree();
        tree.add('a');
        tree.add('c');
        tree.add('b'); //rightBalance via double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(1);
        expect(metrics.addRight).toEqual(2);
        expect(metrics.insertion).toEqual(3);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toEqual(1);
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toBeUndefined();
    });
    test('should left balance with a double rotation when the new root is right high after the insertion', () => {
        const tree = new Tree();
        tree.add('e');
        tree.add('f');
        tree.add('b');
        tree.add('a');
        tree.add('c');
        tree.add('d'); //double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(5);
        expect(metrics.addRight).toEqual(4);
        expect(metrics.insertion).toEqual(6);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });
    test('should left balance with a double rotation when the new root is left high after the insertion', () => {
        const tree = new Tree();
        tree.add('e');
        tree.add('f');
        tree.add('b');
        tree.add('a');
        tree.add('d');
        tree.add('c'); //double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(6);
        expect(metrics.addRight).toEqual(3);
        expect(metrics.insertion).toEqual(6);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });
    test('should left balance with a double rotation when the new root is balanced after the insertion', () => {
        const tree = new Tree();
        tree.add('c');
        tree.add('a');
        tree.add('b'); //rightBalance via double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(2);
        expect(metrics.addRight).toEqual(1);
        expect(metrics.insertion).toEqual(3);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });
    test('should right balance with a double rotation on a non-root node', () => {
        const tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('c');
        tree.add('e');
        tree.add('d'); //double rotation under root.right
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'd', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'e', 'd', 'b']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(2);
        expect(metrics.addRight).toEqual(5);
        expect(metrics.insertion).toEqual(5);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toEqual(1);
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toBeUndefined();
    });
    test('should left balance with a double rotation on a non-root node', () => {
        const tree = new Tree();
        tree.add('d');
        tree.add('e');
        tree.add('c');
        tree.add('a');
        tree.add('b'); //double rotation under root.left
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'e', 'd']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(5);
        expect(metrics.addRight).toEqual(2);
        expect(metrics.insertion).toEqual(5);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });
});

describe('AVL Tree output to array', () => {
    test('should print in infix notation by default', () => {
        const tree = new Tree();
        tree.add('d');
        tree.add('e');
        tree.add('c');
        tree.add('a');
        tree.add('b'); //double rotation under root.left
        expect(tree.toArray()).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'e', 'd']);
        const metrics = tree.metrics();
        expect(metrics.addLeft).toEqual(5);
        expect(metrics.addRight).toEqual(2);
        expect(metrics.insertion).toEqual(5);
        expect(metrics.rotateLeft).toEqual(1);
        expect(metrics.rightBalance).toBeUndefined();
        expect(metrics.rotateRight).toEqual(1);
        expect(metrics.leftBalance).toEqual(1);
    });
});

describe('AVL Tree search', () => {
    test('should throw if the search value is null or undefined', () => {
        const tree = new Tree();
        tree.add('a');
        expect(() => tree.find(null)).toThrow(new AvlTreeSearchValueEmptyError().toString());
        expect(() => tree.find(undefined)).toThrow(new AvlTreeSearchValueEmptyError().toString());
    });
    test('should return a node that matches the search value exactly', () => {
        const tree = Tree.fromArray(['a', 'b', 'c', 'd', 'e', 'f']);
        const { node, metrics } = tree.find('c');
        expect(node.payload).toEqual('c');
        expect(metrics.searchLeft).toEqual(1);
        expect(metrics.searchRight).toEqual(1);
        expect(metrics.depth).toEqual(2);
    });
    test('should return null if the search term is not found', () => {
        const tree = Tree.fromArray(['a', 'c', 'e', 'g', 'i', 'k']);
        const { node: nodeM, metrics: metricsM } = tree.find('m');
        expect(nodeM).toEqual(null);
        expect(metricsM.searchLeft).toBeUndefined();
        expect(metricsM.searchRight).toEqual(3);
        expect(metricsM.depth).toEqual(3);
        const { node: nodeJ, metrics: metricsJ } = tree.find('j');
        expect(nodeJ).toEqual(null);
        expect(metricsJ.searchLeft).toEqual(1);
        expect(metricsJ.searchRight).toEqual(2);
        expect(metricsJ.depth).toEqual(3);
    });
});

describe('AVL Tree depth', () => {
    test('should be zero for a new tree', () => {
        const tree = new Tree();
        expect(tree.depth()).toEqual(0);
    });
    test('should be one for a tree with a single node', () => {
        const tree = Tree.fromArray(['a']);
        expect(tree.depth()).toEqual(1);
    });
    test('should report the number of left and right traversals if a Metrics object is provided', () => {
        const tree = Tree.fromArray(['m', 'i', 'p', 'o', 't']);
        const metrics = new Metrics();
        const depth = tree.depth(metrics);
        expect(depth).toEqual(3);
        expect(metrics.counters.searchLeft).toEqual(1);
        expect(metrics.counters.searchRight).toEqual(1);
    });
    test('should throw an error if a non-Metrics type is passed as a collector', () => {
        const tree = new Tree();
        expect(() => tree.depth(1)).toThrow(new AvlTreeParameterTypeMismatchError('Metrics', 'number').toString())
        expect(() => tree.depth({})).toThrow(new AvlTreeParameterTypeMismatchError('Metrics', 'object').toString())
    });
    test('should be two for a balanced tree with three nodes', () => {
        const tree = Tree.fromArray(['b', 'a', 'c']);
        const metrics = new Metrics();
        const depth = tree.depth(metrics);
        expect(depth).toEqual(2);
        expect(metrics.counters.searchLeft).toEqual(1);
        expect(metrics.counters.searchRight).toBeUndefined();
    });
    test('should only result in depth-1 searches when the tree is left high', () => {
        const tree = Tree.fromArray(['m', 'i', 'p', 'e', 'j']);
        const metrics = new Metrics();
        const depth = tree.depth(metrics);
        expect(depth).toEqual(3);
        expect(metrics.counters.searchLeft).toEqual(2);
        expect(metrics.counters.searchRight).toBeUndefined();
    });
    test('should only result in depth-1 searches when the tree is right high', () => {
        const tree = Tree.fromArray(['m', 'i', 'p', 'o', 't']);
        const metrics = new Metrics();
        const depth = tree.depth(metrics);
        expect(depth).toEqual(3);
        expect(metrics.counters.searchLeft).toEqual(1);
        expect(metrics.counters.searchRight).toEqual(1);
    });
});

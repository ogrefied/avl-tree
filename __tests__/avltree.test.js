import { Tree } from '../src/avltree';
import {
    AvlTreeConstructionError,
    AvlTreeDuplicateKeyError,
    AvlTreeEmptyPayloadError,
    AvlTreeTypeMismatchError,
} from '../src/avlerrors';

test('throw error on duplicate key', () => {
    let t = new Tree();
    t.add('a');
    expect(() => t.add('a')).toThrow(new AvlTreeDuplicateKeyError('a').toString());
});

describe('AVL Tree creation', () => {
    test('should create an empty tree on construction', () => {
        let tree = new Tree();
        expect(tree.root).toBeTruthy();
        expect(tree.root.payload).toBe(null);
        expect(tree.root.left).toBe(null);
        expect(tree.root.right).toBe(null);
        expect(tree.root.balance).toBe('BALANCED');
    });
    test('should return an empty tree when a source array is empty', () => {
        let tree = Tree.fromArray([]);
        expect(tree.root).toBeTruthy();
        expect(tree.root.payload).toBe(null);
        expect(tree.root.left).toBe(null);
        expect(tree.root.right).toBe(null);
        expect(tree.root.balance).toBe('BALANCED');
    });
    test('should return proper insertion order when created from an array', () => {
        let tree = Tree.fromArray(['a', 'b', 'c']);
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
        let tree = new Tree();
        tree.add('a');
        expect(() => tree.add(1)).toThrow(new AvlTreeTypeMismatchError('number', 'string').toString());
        expect(() => tree.add({})).toThrow(new AvlTreeTypeMismatchError('object', 'string').toString());
    });
    test('should throw an error when a nullish value is inserted', () => {
        let tree = new Tree();
        expect(() => tree.add(null)).toThrow(new AvlTreeEmptyPayloadError().toString());
        expect(() => tree.add(undefined)).toThrow(new AvlTreeEmptyPayloadError().toString());
    });

    // SINGLE ROTATIONS
    test('should result in a left rotation when added in sequence order', () => {
        let tree = new Tree();
        tree.add('a');
        tree.add('b');
        tree.add('c');
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        expect(tree.metrics().insertion).toEqual(3);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toEqual(1);
        expect(tree.metrics().rotateRight).toBeUndefined();
        expect(tree.metrics().leftBalance).toBeUndefined();
    });
    test('should result in a right rotation when added in reverse order', () => {
        let tree = new Tree();
        tree.add('c');
        tree.add('b');
        tree.add('a');
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        expect(tree.metrics().insertion).toEqual(3);
        expect(tree.metrics().rotateLeft).toBeUndefined();
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });

    // DOUBLE ROTATIONS
    test('should right balance with a double rotation when the new root was left high after the insertion', () => {
        let tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('e');
        tree.add('d');
        tree.add('f');
        tree.add('c'); //double rotation; right balance
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
        expect(tree.metrics().insertion).toEqual(6);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toEqual(1);
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toBeUndefined();
    });
    test('should right balance with a double rotation when the new root was right high after the insertion', () => {
        let tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('e');
        tree.add('c');
        tree.add('f');
        tree.add('d'); //double rotation; right balance
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
        expect(tree.metrics().insertion).toEqual(6);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toEqual(1);
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toBeUndefined();
    });
    test('should right balance with a double rotation when the new root is balanced after the insertion', () => {
        let tree = new Tree();
        tree.add('a');
        tree.add('c');
        tree.add('b'); //rightBalance via double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        expect(tree.metrics().insertion).toEqual(3);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toEqual(1);
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toBeUndefined();
    });
    test('should left balance with a double rotation when the new root is right high after the insertion', () => {
        let tree = new Tree();
        tree.add('e');
        tree.add('f');
        tree.add('b');
        tree.add('a');
        tree.add('c');
        tree.add('d'); //double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
        expect(tree.metrics().insertion).toEqual(6);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });
    test('should left balance with a double rotation when the new root is left high after the insertion', () => {
        let tree = new Tree();
        tree.add('e');
        tree.add('f');
        tree.add('b');
        tree.add('a');
        tree.add('d');
        tree.add('c'); //double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
        expect(tree.metrics().insertion).toEqual(6);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });
    test('should left balance with a double rotation when the new root is balanced after the insertion', () => {
        let tree = new Tree();
        tree.add('c');
        tree.add('a');
        tree.add('b'); //rightBalance via double rotation
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'c']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b']);
        expect(tree.metrics().insertion).toEqual(3);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });
    test('should right balance with a double rotation on a non-root node', () => {
        let tree = new Tree();
        tree.add('b');
        tree.add('a');
        tree.add('c');
        tree.add('e');
        tree.add('d'); //double rotation under root.right
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['b', 'a', 'd', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'e', 'd', 'b']);
        expect(tree.metrics().insertion).toEqual(5);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toEqual(1);
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toBeUndefined();
    });
    test('should left balance with a double rotation on a non-root node', () => {
        let tree = new Tree();
        tree.add('d');
        tree.add('e');
        tree.add('c');
        tree.add('a');
        tree.add('b'); //double rotation under root.left
        expect(tree.toArray({ notation: 'infix' })).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'e', 'd']);
        expect(tree.metrics().insertion).toEqual(5);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });
});

describe('AVL Tree output to array', () => {
    test('should print in infix notation by default', () => {
        let tree = new Tree();
        tree.add('d');
        tree.add('e');
        tree.add('c');
        tree.add('a');
        tree.add('b'); //double rotation under root.left
        expect(tree.toArray()).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
        expect(tree.toArray({ notation: 'prefix' })).toStrictEqual(['d', 'b', 'a', 'c', 'e']);
        expect(tree.toArray({ notation: 'postfix' })).toStrictEqual(['a', 'c', 'b', 'e', 'd']);
        expect(tree.metrics().insertion).toEqual(5);
        expect(tree.metrics().rotateLeft).toEqual(1);
        expect(tree.metrics().rightBalance).toBeUndefined();
        expect(tree.metrics().rotateRight).toEqual(1);
        expect(tree.metrics().leftBalance).toEqual(1);
    });
});

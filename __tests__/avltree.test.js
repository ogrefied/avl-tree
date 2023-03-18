const Tree = require('../src/avltree');

test('throw error on duplicate key', () => {
    let t = new Tree();
    t.add('a');
    expect(() => t.add('a')).toThrow('Adding multiple values with the same key not implemented.');
});

/* CREATION
 */
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
        expect(() => Tree.fromArray('x')).toThrow('Cannot create tree from non-array source');
        expect(() => Tree.fromArray(1)).toThrow('Cannot create tree from non-array source');
        expect(() => Tree.fromArray(true)).toThrow('Cannot create tree from non-array source');
        expect(() => Tree.fromArray({})).toThrow('Cannot create tree from non-array source');
    });
});

/* SINGLE ROTATIONS
 * ----------------
 */
test('it should rotate left', () => {
    let t = new Tree();
    t.add('a');
    t.add('b');
    t.add('c');
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['b', 'a', 'c']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b']);
});

test('it should rotate right', () => {
    let t = new Tree();
    t.add('c');
    t.add('b');
    t.add('a');
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['b', 'a', 'c']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b']);
});

/* DOUBLE ROTATIONS
 * ----------------
 */
test('R balance, double rotation, left high new root', () => {
    let t = new Tree();
    t.add('b');
    t.add('a');
    t.add('e');
    t.add('d');
    t.add('f');
    t.add('c'); //double rotation; right balance
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
});

/** in this test case, the node causing double rotation is right high */
test('R balance, double rotation, right high new root', () => {
    let t = new Tree();
    t.add('b');
    t.add('a');
    t.add('e');
    t.add('c');
    t.add('f');
    t.add('d'); //double rotation; right balance
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
});

test('R balance, double rotation, balanced new root', () => {
    let t = new Tree();
    t.add('a');
    t.add('c');
    t.add('b'); //rightBalance via double rotation
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['b', 'a', 'c']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b']);
});

test('L balance, double rotation, right high new root', () => {
    let t = new Tree();
    t.add('e');
    t.add('f');
    t.add('b');
    t.add('a');
    t.add('c');
    t.add('d'); //double rotation
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['c', 'b', 'a', 'e', 'd', 'f']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'b', 'd', 'f', 'e', 'c']);
});

test('L balance, double rotation, left high new root', () => {
    let t = new Tree();
    t.add('e');
    t.add('f');
    t.add('b');
    t.add('a');
    t.add('d');
    t.add('c'); //double rotation
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['d', 'b', 'a', 'c', 'e', 'f']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b', 'f', 'e', 'd']);
});

test('L balance, double rotation, balanced new root', () => {
    let t = new Tree();
    t.add('c');
    t.add('a');
    t.add('b'); //rightBalance via double rotation
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['b', 'a', 'c']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b']);
});

test('should be 3 inserts, 3 adds, and right balance with double rotation', () => {
    let t = new Tree();
    t.add('a');
    t.add('c');
    t.add('b'); //rightBalance via double rotation
    let m = t.metrics();
    expect(m.insertion).toEqual(3);
    expect(m.add).toEqual(3);
    expect(m.rightBalance).toEqual(1);
    expect(m.leftBalance).toBeUndefined();
    expect(m.rotateLeft).toEqual(1);
    expect(m.rotateRight).toEqual(1);
});

test('double rotation at non-root node on right', () => {
    let t = new Tree();
    t.add('b');
    t.add('a');
    t.add('c');
    t.add('e');
    t.add('d'); //double rotation under root.right
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['b', 'a', 'd', 'c', 'e']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'e', 'd', 'b']);
});

test('double rotation at non-root node on left', () => {
    let t = new Tree();
    t.add('d');
    t.add('e');
    t.add('c');
    t.add('a');
    t.add('b'); //double rotation under root.left
    let ainfix = t.toArray();
    expect(ainfix).toStrictEqual(['a', 'b', 'c', 'd', 'e']);
    let aprefix = t.toArray({ notation: 'prefix' });
    expect(aprefix).toStrictEqual(['d', 'b', 'a', 'c', 'e']);
    let apostfix = t.toArray({ notation: 'postfix' });
    expect(apostfix).toStrictEqual(['a', 'c', 'b', 'e', 'd']);
});
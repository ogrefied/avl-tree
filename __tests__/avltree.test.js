const Tree = require('../src/avltree');

test('throw error on duplicate key', () => {
    let t = new Tree();
    t.add('a');
    expect(() => t.add('a')).toThrow('Adding multiple values with the same key not implemented.');
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
test('right balance when left high', () => {
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
test('right balance when right high', () => {
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

test('left balance when right high', () => {
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

test('left balance when left high', () => {
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
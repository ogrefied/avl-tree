const Tree = require('./src/avltree');

let t = new Tree();
t.add('k');
t.add('m');
t.add('u');
t.add('t');
t.add('v');
t.add('p');
console.log('infix:');
t.print();
console.log('prefix:');
t.print({ notation: "prefix" });
console.log('postfix:');
t.print({ notation: "postfix" });
const Tree = require('./src/avltree');

let t = new Tree();
t.add('k');
t.add('m');
t.add('u');
console.log(`${JSON.stringify(t, null, 4)}`);
const { cat, exp, expIf, expMap, fix, func, tag, render } = require('./index');

const config = func(['data'], cat(
	fix(`HELLO
	WORLD`),
	exp('data.test'),
	exp('data["test"]'),
	exp('data[\'test\']'),
	expIf('data.test', fix('true'), fix('false')),
	expMap('data.array', ['item'], exp('item.title'), ' + '),
	fix('`QUOTE`'),
	fix('\'QUOTE\''),
	fix('"QUOTE"'),
	tag(fix('a'), fix('href="#"'), fix('link')),
	tag(fix('br'))
));
console.log('\nconfig', JSON.stringify(config, null, 2));

console.log('\nES6');
console.log(render(config, { type: 'es6' }));

console.log('\nES5 - SINGLE QUOTE');
console.log(render(config, { type: 'es5', quote: '\'' }));

console.log('\nES5 - DOUBLE QUOTE');
console.log(render(config, { type: 'es5', quote: '"' }));

const fs = require('fs');

const { cat, exp, expIf, expMap, fix, func, tag, render } = require('../index');

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

(() => {
	console.log('\nEXAMPLE 1 - HELLO WORLD');
	const value = func(
		['name'],
		cat(
			fix('Hello '),
			exp('name'),
			fix('!')
		)
	);
	console.log(JSON.stringify({ value: render(value) }, null, '\t'));
})();

(() => {
	console.log('\nEXAMPLE 2 - HTML');
	const value = func(
		['name'],
		tag(
			fix('p'),
			null,
			cat(
				fix('Hello '),
				exp('name'),
				fix('!')
			)
		)
	);
	console.log(JSON.stringify({ value: render(value) }, null, '\t'));
})();

(() => {
	console.log('\nEXAMPLE 3 - DEFAULT VALUE');
	const value = func(
		['name'],
		tag(
			fix('p'),
			null,
			cat(
				fix('Hello '),
				expIf('name == null',
					fix('World'),
					exp('name')
				),
				fix('!')
			)
		)
	);
	console.log(JSON.stringify({ value: render(value) }, null, '\t'));
})();

(() => {
	console.log('\nEXAMPLE 4 - LOOP');
	const value = func(
		['names'],
		tag(
			fix('p'),
			null,
			cat(
				fix('Hello '),
				expIf('names == null || names.length === 0',
					fix('World'),
					expIf('names.length === 1',
						exp('names[0]'),
						cat(
							expMap('names.slice(0, name.length - 1)', ['name'], exp('name'), ', '),
							fix(' and '),
							exp('names[names.length - 1]')
						)
					),
				),
				fix('!')
			)
		)
	);
	console.log(JSON.stringify({ value: render(value) }, null, '\t'));
})();

(() => {
	console.log('\nEXAMPLE 5 - BACKWARD COMPATIBLE WITH DOUBLE QUOTE');
	const value = func(
		['names'],
		tag(
			fix('p'),
			null,
			cat(
				fix('Hello '),
				expIf('names == null || names.length === 0',
					fix('World'),
					expIf('names.length === 1',
						exp('names[0]'),
						cat(
							expMap('names.slice(0, name.length - 1)', ['name'], exp('name'), ', '),
							fix(' and '),
							exp('names[names.length - 1]')
						)
					),
				),
				fix('!')
			)
		)
	);
	console.log(JSON.stringify({ value: render(value, { type: 'es5', quote: '"' }) }, null, '\t'));
})();

(() => {
	const value = func(
		['names'],
		tag(
			fix('p'),
			null,
			cat(
				fix('Hello '),
				expIf('names == null || names.length === 0',
					fix('World'),
					expIf('names.length === 1',
						exp('names[0]'),
						cat(
							expMap('names.slice(0, names.length - 1)', ['name'], exp('name'), ', '),
							fix(' and '),
							exp('names[names.length - 1]')
						)
					),
				),
				fix('!')
			)
		)
	);

	fs.writeFile('tsfm.js',`module.exports = ${render(value, { type: 'es5', quote: '"' })}`, (error) => {
		if (error) {
			throw error;
		}
	});
})();

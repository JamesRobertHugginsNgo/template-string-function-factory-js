/**
 * ...
 * @typedef {Object} FixConfig
 * @property {string} type
 * @property {string} value
 */

/**
 * ...
 * @typedef {Object} ExpConfig
 * @property {string} type
 * @property {string} value
 */

/**
 * ...
 * @typedef {Object} ExpIfConfig
 * @property {string} type
 * @property {string} condition
 * @property {Config} trueValue
 * @property {Config} falseValue
 */

/**
 * ...
 * @typedef {Object} ExpMapConfig
 * @property {string} type
 * @property {string} array
 * @property {string[]} args
 * @property {Config} value
 * @property {string} joinString
 */

/**
 * ...
 * @typedef {Object} CatConfig
 * @property {string} type
 * @property {Config[]} values
 */

/**
 * ...
 * @typedef {Object} TagConfig
 * @property {string} type
 * @property {Object} name
 * @property {Object} attributes
 * @property {Object} body
 */

/**
 * ...
 * @typedef {Object} FuncConfig
 * @property {string} type
 * @property {string[]} args
 * @property {Config} value
 */

/**
 * ...
 * @typedef {(FixConfig|ExpConfig|ExpIfConfig|ExpMapConfig|CatConfig|TagConfig|FuncConfig)} Config
 */

/**
 * Represents a fix string.
 * @param {string} value
 * @returns {FixConfig}
 */
function fix(value) {
	return { type: 'fix', value };
}

/**
 * Represents an expression.
 * @param {string} value
 * @returns {ExpConfig}
 */
 function exp(value) {
	return { type: 'exp', value };
}

/**
 * Represents an "if" expression.
 * @param {string} condition
 * @param {Config} trueValue
 * @param {Config} falseValue
 * @returns {ExpIfConfig}
 */
 function expIf(condition, trueValue, falseValue) {
	return { type: 'expIf', condition, trueValue, falseValue };
}

/**
 * Represents a "Array.map" expression.
 * @param {string} array
 * @param {string[]} args
 * @param {Config} value
 * @param {string} joinString
 * @returns {ExpMapConfig}
 */
function expMap(array, args, value, joinString) {
	return { type: 'expMap', array, args, value, joinString };
}

/**
 * Concatinate configurations.
 * @param  {...Config} values
 * @returns {CatConfig}
 */
function cat(...values) {
	return { type: 'cat', values };
}

/**
 * Represents an HTML tag.
 * @param {Config} name
 * @param {Config} attributes
 * @param {Config} body
 * @returns {TagConfig}
 */
function tag(name, attributes, body) {
	return { type: 'tag', name, attributes, body };
}

/**
 * Represents a function for rendering.
 * @param {string[]} args
 * @param {Config} value
 * @returns {FuncConfig}
 */
function func(args, value) {
	return { type: 'func', args, value };
}

/**
 * ...
 * @typedef {Object} RenderOptions
 * @property {string} type
 * @property {string} quote
 */

/**
 * Renders representations.
 * @param {Config} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
function render(config, options = {}) {
	const { type: esType = 'es6', quote = (esType === 'es6') ? '`' : '\'' } = options;

	const { type: configType } = config;
	if (render[configType]) {
		return render[configType](config, { type: esType, quote });
	}

	return '';
}

/**
 * ...
 * @param {FixConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['fix'] = function ({ value }, { quote } = {}) {

	/* eslint-disable no-control-regex */
	value = String(value)
		.replace(new RegExp(quote, 'g'), `\\${quote}`)
		.replace(new RegExp('(?:\r\n|\r|\n)', 'g'), '\\n')
		.replace(new RegExp('(?:\t)', 'g'), '\\t');
	/* eslint-enable no-control-regex */

	return `${quote}${value}${quote}`;
};

/**
 * ...
 * @param {ExpConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['exp'] = function ({ value }, { type } = {}) {
	if (type === 'es6') {
		return `\`\${${value}}\``;
	}

	return `(${value})`;
};

/**
 * ...
 * @param {ExpIfConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['expIf'] = function ({ condition, trueValue, falseValue }, { type, quote } = {}) {
	const value = `${condition} ? ${render(trueValue, { type, quote })} : ${render(falseValue, { type, quote })}`

	if (type === 'es6') {
		return `\`\${${value}}\``;
	}

	return `(${value})`;
};

/**
 * ...
 * @param {ExpMapConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['expMap'] = function ({ array, args, value, joinString }, { type, quote } = {}) {
	let values = [];

	values.push(`(${array}).map(`);

	if (type === 'es6') {
		values.push(`(`);
	} else {
		values.push(`function(`);
	}

	values.push(args.join(', '));

	if (type === 'es6') {
		values.push(`) => `);
	} else {
		values.push(`) { return `);
	}

	values.push(render(value, { type, quote }));

	if (type === 'es6') {
		// Do nothing.
	} else {
		values.push(`; }`);
	}

	values.push(`).join('${joinString}')`);

	values = values.join('');

	if (type === 'es6') {
		values = `\`\${${values}}\``;
	} else {
		values = `(${values})`;
	}

	return values;
};

/**
 * ...
 * @param {CatConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['cat'] = function ({ values }, { type, quote } = {}) {
	return values
		.filter((value) => value != null)
		.map((value) => render(value, { type, quote }))
		.join(' + ')
		.replace(new RegExp(`${quote} \\+ ${quote}`, 'g'), '');
};

/**
 * ...
 * @param {TagConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['tag'] = function ({ name, attributes, body }, { type, quote } = {}) {
	const values = [];
	values.push(fix('<'), name);
	if (attributes != null) {
		values.push(fix(' '), attributes);
	}
	values.push(fix('>'));
	if (body != null) {
		values.push(body, fix('</'), name, fix('>'));
	}

	return render(cat(...values), { type, quote });
};

/**
 * ...
 * @param {FuncConfig} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
render['func'] = function ({ args, value }, { type, quote } = {}) {
	const values = [];

	if (type === 'es6') {
		// Do nothing.
	} else {
		values.push('function');
	}

	values.push('(');
	const length = args.length;
	for (let index = 0; index < length; index++) {
		const argument = args[index];
		values.push(argument);
	}
	values.push(')');

	if (type === 'es6') {
		values.push(' => ');
	} else {
		values.push(' { return ');
	}
	if (value != null) {
		values.push(render(value, { type, quote }));
	}
	if (type === 'es6') {
		// Do nothing.
	} else {
		values.push('; }');
	}

	return values.join('');
};

module.exports = { cat, exp, expIf, expMap, fix, func, tag, render };

/**
 * Represents a fix string.
 * @param {string} value
 * @returns {Object}
 */
function fix(value) {
	return { type: 'fix', value };
}

/**
 * Represents an expression.
 * @param {string} value
 * @returns {Object}
 */
function exp(value) {
	return { type: 'exp', value };
}

/**
 * Represents an "if" expression.
 * @param {string} condition
 * @param {Object} trueValue
 * @param {Object} falseValue
 * @returns {Object}
 */
function expIf(condition, trueValue, falseValue) {
	return { type: 'expIf', condition, trueValue, falseValue };
}

/**
 * Represents a "Array.map" expression.
 * @param {string} array
 * @param {string[]} arguments
 * @param {Object} value
 * @param {string} joinString
 * @returns {Object}
 */
function expMap(array, arguments, value, joinString) {
	return { type: 'expMap', array, arguments, value, joinString };
}

/**
 * Concatinate.
 * @param {...Object} values
 * @returns {Object}
 */
function cat(...values) {
	return { type: 'cat', values };
}

/**
 * Represents an HTML tag.
 * @param {Object} name
 * @param {Object} attributes
 * @param {Object} body
 * @returns {Object}
 */
function tag(name, attributes, body) {
	return { type: 'tag', name, attributes, body };
}

/**
 * Returns a string of a function returning the value.
 * @param {string[]} arguments
 * @param {Object} value
 * @returns {Object}
 */
function func(arguments, value) {
	return { type: 'func', arguments, value };
}

/**
 * Renders representations.
 * @param {Object} config
 * @param {Object} options
 * @param {string} options.type
 * @param {string} options.quote
 * @returns
 */

function render(config = {}, { type: esType = 'es6', quote } = {}) {
	if (!quote) {
		if (esType === 'es6') {
			quote = '`';
		} else {
			quote = '\'';
		}
	}

	const { type: configType } = config;
	if (render[configType]) {
		return render[configType](config, { type: esType, quote });
	}

	return '';
}

render['fix'] = function ({ value } = {}, { quote } = {}) {
	value = String(value)
		.replace(new RegExp(quote, 'g'), `\\${quote}`)
		.replace(new RegExp('(?:\r\n|\r|\n)', 'g'), '\\n')
		.replace(new RegExp('(?:\t)', 'g'), '\\t');

	return `${quote}${value}${quote}`;
};

render['exp'] = function ({ value } = {}, { type, quote } = {}) {
	if (type === 'es6') {
		return `\`\${${value}}\``;
	}

	return `(${value})`;
};

render['expIf'] = function ({ condition, trueValue, falseValue = fix('') } = {}, { type, quote } = {}) {
	const value = `${condition} ? ${render(trueValue, { type, quote })} : ${render(falseValue, { type, quote })}`

	if (type === 'es6') {
		return `\`\${${value}}\``;
	}

	return `(${value})`;
};

render['expMap'] = function ({ array, arguments = [], value, joinString = '' } = {}, { type, quote } = {}) {
	let values = [];

	values.push(`(${array}).map(`);

	if (type === 'es6') {
		values.push(`(`);
	} else {
		values.push(`function(`);
	}

	values.push(arguments.join(', '));

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

render['cat'] = function ({ values } = {}, { type, quote } = {}) {
	return values
		.filter((value) => value != null)
		.map((value) => render(value, { type, quote }))
		.join(' + ')
		.replace(new RegExp(`${quote} \\+ ${quote}`, 'g'), '');
};

render['tag'] = function ({ name, attributes, body } = {}, { type, quote } = {}) {
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

render['func'] = function ({ arguments = [], value } = {}, { type, quote } = {}) {
	const values = [];

	if (type === 'es6') {
		// Do nothing.
	} else {
		values.push('function');
	}

	values.push('(');
	const length = arguments.length;
	for (let index = 0; index < length; index++) {
		const argument = arguments[index];
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

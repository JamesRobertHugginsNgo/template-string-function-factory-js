# Reference

## Functions

### fix(value)
``` JavaScript
/**
 * Represents a fix string.
 * @param {string} value
 * @returns {FixConfig}
 */
```

### exp(value)
``` JavaScript
/**
 * Represents an expression.
 * @param {string} value
 * @returns {ExpConfig}
 */
```

### expIf(condition, trueValue, falseValue)
``` JavaScript
/**
 * Represents an "if" expression.
 * @param {string} condition
 * @param {Config} trueValue
 * @param {Config} falseValue
 * @returns {ExpIfConfig}
 */
```

### expMap(array, args, value, joinString)
``` JavaScript
/**
 * Represents a "Array.map" expression.
 * @param {string} array
 * @param {string[]} args
 * @param {Config} value
 * @param {string} joinString
 * @returns {ExpMapConfig}
 */
```

### cat(...values)
``` JavaScript
/**
 * Concatinate configurations.
 * @param  {...Config} values
 * @returns {CatConfig}
 */
```

### tag(name, attributes, body)
``` JavaScript
/**
 * Represents an HTML tag.
 * @param {Config} name
 * @param {Config} attributes
 * @param {Config} body
 * @returns {TagConfig}
 */
```

### func(args, value)
``` JavaScript
/**
 * Represents a function for rendering.
 * @param {string[]} args
 * @param {Config} value
 * @returns {FuncConfig}
 */
```

### render(config, options = {})
``` JavaScript
/**
 * Renders representations.
 * @param {Config} config
 * @param {RenderOptions} [options={}]
 * @returns {string}
 */
```

## Type Definitions

### FixConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} FixConfig
 * @property {string} type
 * @property {string} value
 */
```

### ExpConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} ExpConfig
 * @property {string} type
 * @property {string} value
 */
```

### ExpIfConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} ExpIfConfig
 * @property {string} type
 * @property {string} condition
 * @property {Config} trueValue
 * @property {Config} falseValue
 */
```

### ExpMapConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} ExpMapConfig
 * @property {string} type
 * @property {string} array
 * @property {string[]} args
 * @property {Config} value
 * @property {string} joinString
 */
```

### CatConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} CatConfig
 * @property {string} type
 * @property {Config[]} values
 */
```

### TagConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} TagConfig
 * @property {string} type
 * @property {Object} name
 * @property {Object} attributes
 * @property {Object} body
 */
```

### FuncConfig
``` JavaScript
/**
 * ...
 * @typedef {Object} FuncConfig
 * @property {string} type
 * @property {string[]} args
 * @property {Config} value
 */
```

### Config
``` JavaScript
/**
 * ...
 * @typedef {(FixConfig|ExpConfig|ExpIfConfig|ExpMapConfig|CatConfig|TagConfig|FuncConfig)} Config
 */
```

### RenderOptions
``` JavaScript
/**
 * ...
 * @typedef {Object} RenderOptions
 * @property {string} type
 * @property {string} quote
 */
```
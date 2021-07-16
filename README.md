# Template String Function Factory JS

A dev tool to help generate template strings formatted for ES5 and ES6.

Instead of creating the template string directly, the tool accepts a maintainable configuration object and renders its free of unnecessary spacing and syntax errors.

## Example

A simple hello world example.

``` JavaScript
var name = 'World';
console.log(`<p>Hello ${name}!</p>`);
```

Here it is as a reusable function.

```JavaScript
const func = (name) => {
	return `<p>Hello ${name}!</p>`;
}
console.log(func('World'));
```

We can generate a configuration object for the tool with the following code

```JavaScript
const { cat, exp, fix, func, tag } = require('./index');
const configuration = func(
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
```

Here is the configuration object

```JSON
{
  "type": "func",
  "arguments": [
    "name"
  ],
  "value": {
    "type": "tag",
    "name": {
      "type": "fix",
      "value": "p"
    },
    "attributes": null,
    "body": {
      "type": "cat",
      "values": [
        {
          "type": "fix",
          "value": "Hello "
        },
        {
          "type": "exp",
          "value": "name"
        },
        {
          "type": "fix",
          "value": "!"
        }
      ]
    }
  }
}
```

We can render this configuration object with the following

```JavaScript
const { render } = require('./index');
const stringFunc = render(configuration);
console.log(stringFunc);
```

Here is the string result as displayed on the terminal.

```JavaScript
(name) => `<p>Hello ${name}!</p>`
```

We can copy this directly from the terminal and paste it in our code, or save it as a file with a `module.exports` prefix and import the template string function as needed.

```JavaScript
const fs = require('fs');
fs.writeFile(
  'template-string-function.js',
  `module.exports = ${stringFunc};`,
  (err) => {}
);
```

```JavaScript
const tsf = require('./template-string-function.js');
console.log(tsf('World'));
```
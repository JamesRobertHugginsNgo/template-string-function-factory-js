# Implementations

## Implementation 1: Template String Function Module

### NodeJS

``` JavaScript
const { cat, exp, expIf, expMap, fix, func, tag, render } = require('./index');

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

  fs.writeFile('test-tsfm.js',`module.exports = ${render(value, { type: 'es5', quote: '"' })}`, (error) => {
    if (error) {
      throw error;
    }
  });
})();
```

### test-tsfm.js

``` JavaScript
module.exports = function(names) { return "<p>Hello " + (names == null || names.length === 0 ? "World" : (names.length === 1 ? (names[0]) : ((names.slice(0, names.length - 1)).map(function(name) { return (name); }).join(', ')) + " and " + (names[names.length - 1]))) + "!</p>"; }
```

### test-tsfm-import.js

``` JavaScript
const test = require('./test-tsfm');
console.log(test(['Tom', 'Dick', 'Stanly']));
```

### Output

``` HTML
<p>Hello Tom, Dick and Stanly!</p>
```

## Implementation 2: Script, Output, Copy and Paste

An alternative is to create the script, run the code, then copy the output and paste it on your code.

Enjoy!
# Examples

## Example 1: Hello World

### NodeJS

``` JavaScript
const { cat, exp, fix, func, render } = require('./index');

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
```

### Result

```
EXAMPLE 1 - HELLO WORLD
{
  "value": "(name) => `Hello ${name}!`"
}
```

## Example 2: HTML

### NodeJS

``` JavaScript
const { cat, exp, fix, func, tag, render } = require('./index');

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
```

### Result

```
EXAMPLE 2 - HTML
{
  "value": "(name) => `<p>Hello ${name}!</p>`"
}
```

## Example 3: Default Value

### NodeJS

``` JavaScript
const { cat, exp, expIf, fix, func, tag, render } = require('./index');

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
```

### Result

```
EXAMPLE 3 - DEFAULT VALUE
{
  "value": "(name) => `<p>Hello ${name == null ? `World` : `${name}`}!</p>`"
}
```

## Example 4: Loop

### NodeJS

``` JavaScript
const { cat, exp, expIf, expMap, fix, func, tag, render } = require('./index');

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
          )
        ),
        fix('!')
      )
    )
  );
  console.log(JSON.stringify({ value: render(value) }, null, '\t'));
})();
```

### Result

```
EXAMPLE 4 - LOOP
{
  "value": "(names) => `<p>Hello ${names == null || names.length === 0 ? `World` : `${names.length === 1 ? `${names[0]}` : `${(names.slice(0, name.length - 1)).map((name) => `${name}`).join(', ')} and ${names[names.length - 1]}`}`}!</p>`"
}
```

## Example 5: Backward Compatible with Double Qoute

### NodeJS

``` JavaScript
const { cat, exp, expIf, expMap, fix, func, tag, render } = require('./index');

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
```

### Result

```
EXAMPLE 5 - BACKWARD COMPATIBLE WITH DOUBLE QUOTE
{
  "value": "function(names) { return \"<p>Hello \" + (names == null || names.length === 0 ? \"World\" : (names.length === 1 ? (names[0]) : ((names.slice(0, name.length - 1)).map(function(name) { return (name); }).join(', ')) + \" and \" + (names[names.length - 1]))) + \"!</p>\"; }"
}
```
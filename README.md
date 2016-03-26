# Word Counter

> JavaScript word counter.

- [Homepage](http://fengyuanchen.github.io/wordcounter)



## Main

```
dist/
├── wordcounter.js      (6 KB)
└── wordcounter.min.js  (3 KB)
```



## Getting started

### Quick start

Three quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/wordcounter/archive/master.zip).
- Clone the repository: `git clone https://github.com/fengyuanchen/wordcounter.git`.
- Install with [NPM](http://npmjs.org): `npm install wordcounter`.


### Usage

#### Browser

```html
<script src="/path/to/wordcounter.js"></script>
```

```js
var wordcounter = new WordCounter(options);

wordcounter.count(source, function (result, logs) {
  console.log(result); // Array
  console.log(logs); // String
});
```


#### NodeJS

```js
var fs = require('fs');
var WordCounter = require('wordcounter');
var wordcounter = new WordCounter(options);

fs.readFile('/path/to/source.txt', function(err, data) {
  if (err) {
    throw err;
  }

  data = wordcounter.count(data.toString());

  fs.writeFile('/path/to/result.json', JSON.stringify(data), function (err) {
    if (err) {
      throw err;
    }

    console.log('Done, without errors.');
  });
});
```



## Options

### mincount

- Type: `Number`
- Default: `1`

Min word count. If a word's count is less than this number, then it will be ignored.


### minlength

- Type: `Number`
- Default: `1`

Min word length. If a word's length is less than this number, then it will be ignored.


### report

- Type: `Boolean`
- Default: `true`

Reports counting result in console.


### ignore

- Type: `Array`
- Default: `[]`
- Example: `['this', 'return', 'function']`

Ignores words.

### ignorecase

- Type: `Boolean`
- Default: `false`

Ignores words' cases, treating them as lower case.

## Methods

### setup(options)

Params | Type | Description
------ | ---- | -----------
options | `Object` | Custom options

Changes the default options.


### count(source[, callback]])

Params | Type | Description
------ | ---- | -----------
source | `String` | The source text for counting,
callback | `Function` | For example: `function (result, logs) {}`

Counts words from the source text, returns a words array.



## Example

```js
var source = 'foo fubar fubar bar quux QuUx quux norf norf';
var wordcounter = new WordCounter({
      mincount: 2,
      minlength: 4,
      ignore: ['norf'],
      ignorecase: true
    });

wordcounter.count(source, function (result, logs) {
  console.log(result);
  /*
  [{
    word: 'quux',
    count: 3
  }, {
    word: 'fubar',
    count: 2
  }]
  */

  console.log(logs);
  /*
  1> quux: 3
  2> fubar: 2
  */
});
```



## Browser support

- Chrome (latest 2)
- Firefox (latest 2)
- Internet Explorer 8+
- Opera (latest 2)
- Safari (latest 2)



## License

[MIT](http://opensource.org/licenses/MIT) © [Fengyuan Chen](http://chenfengyuan.com)

# [Word Counter](https://github.com/fengyuanchen/wordcounter)

JavaScript word counter.

- [Demo](https://fengyuanchen.github.io/wordcounter)


# Getting started

## Quick start

Three quick start options are available:

- [Download the latest release](https://github.com/fengyuanchen/wordcounter/archive/master.zip).
- Clone the repository: `git clone https://github.com/fengyuanchen/wordcounter.git`.
- Install with [NPM](http://npmjs.org): `npm install wordcounter`.


## Usage

### Browser

```html
<script src="/path/to/wordcounter.js"></script>
```

```javascript
var wordcounter = new WordCounter(options);

wordcounter.count(source, function (result, logs) {
  console.log(result); // Array
  console.log(logs); // String
});
```


### NodeJS

```javascript
var fs = require('fs'),
    WordCounter = require('wordcounter'),
    wordcounter = new WordCounter(options);

fs.readFile('/path/to/source.txt', function(err, data) {
  if (err) {
    throw err;
  }

  data = data.toString();
  data = wordcounter.count(data);
  data = JSON.stringify(data);

  fs.writeFile('/path/to/result.json', data, function (err) {
    if (err) {
      throw err;
    }

    console.log('Done, without errors.');
  });
});
```


## Options

#### mincount

- Type: `Number`
- Default: `1`

Min word count. If a word's count less than this number, then it will be ignored.


#### minlength

- Type: `Number`
- Default: `1`

Min word length. If a word's length less than this number, then it will be ignored.


#### report

- Type: `Boolean`
- Default: `true`

Reports counting result in console.


#### ignore

- Type: `Array`
- Default: `[]`
- Example: `['this', 'return', 'function']`

Ingores words.


## Methods

#### setup(options)

Params | Type | Description
------ | ---- | -----------
options | `Object` | Custom options

Changes the default options.


#### count(source[, callback]])

Params | Type | Description
------ | ---- | -----------
source | `String` | The source text for counting,
callback | `Function` | For example: `function (result, logs) {}`

Counts words from the source text, returns a words array.


## Example

```js
var wordcounter = new WordCounter({
      mincount: 2,
      minlength: 4,
      ignore: ['norf']
    });

wordcounter.count('foo fubar fubar bar quux quux quux norf norf', function (result, logs) {
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


## Browser Support

- Chrome 36+
- Firefox 31+
- Internet Explorer 8+
- Opera 21+
- Safari 5.1+


## [License](https://github.com/fengyuanchen/wordcounter/blob/master/LICENSE.md)

Released under the [MIT](http://opensource.org/licenses/mit-license.html) license.

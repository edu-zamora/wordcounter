(function () {

  'use strict';

  var WordCounter = require('../src/wordcounter');

  /*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
      test.expect(numAssertions)
      test.done()
    Test assertions:
      test.ok(value, [message])
      test.equal(actual, expected, [message])
      test.notEqual(actual, expected, [message])
      test.deepEqual(actual, expected, [message])
      test.notDeepEqual(actual, expected, [message])
      test.strictEqual(actual, expected, [message])
      test.notStrictEqual(actual, expected, [message])
      test.throws(block, [error], [message])
      test.doesNotThrow(block, [error], [message])
      test.ifError(value)
  */

  // Test options
  // -----------------------------------------------------------------------------

  exports.options = {
    mincount: function (test) {
      var wordcounter = new WordCounter({
            mincount: 2
          });

      test.expect(1);

      test.deepEqual(
        wordcounter.count('foo bar baz foo'),
        [{
          word: 'foo',
          count: 2
        }],
        'Must matchs "foo" only.'
      );

      test.done();
    },

    minlength: function (test) {
      var wordcounter = new WordCounter({
            minlength: 4
          });

      test.expect(1);

      test.deepEqual(
        wordcounter.count('foo bar baz quux norf'),
        [{
          word: 'norf',
          count: 1
        }, {
          word: 'quux',
          count: 1
        }],
        'Must matchs "quux" and "norf".'
      );

      test.done();
    },

    ignore: function (test) {
      var wordcounter = new WordCounter({
            ignore: [
              'foo',
              'baz'
            ]
          });

      test.expect(1);

      test.deepEqual(
        wordcounter.count('foo bar baz'),
        [{
          word: 'bar',
          count: 1
        }],
        'Must matchs "bar" only.'
      );

      test.done();
    }
  }

  // Test methods
  // -----------------------------------------------------------------------------

  exports.methods = {
    setup: function (test) {
      var wordcounter = new WordCounter({
            mincount: 2,
            minlength: 3,
            ignore: [
              'foo',
              'bar',
              'baz'
            ]
          }),
          defaults = wordcounter.defaults;

      test.expect(3);

      test.ok(defaults.mincount === 2, 'The "mincount" option must be 2.');
      test.ok(defaults.minlength === 3, 'The "minlength" option must be 3.');
      test.deepEqual(defaults.ignore, ['foo', 'bar', 'baz'], 'The "ignore" option must be `[\'foo\', \'bar\', \'baz\']`.');

      test.done();
    },

    count: function (test) {
      var wordcounter = new WordCounter();

      test.expect(1);

      test.deepEqual(
        wordcounter.count('^foo+bar*baz$'),
        [{
          word: 'bar',
          count: 1
        }, {
          word: 'baz',
          count: 1
        }, {
          word: 'foo',
          count: 1
        }],
        'Must matchs "foo", "bar" and "baz".'
      );

      test.done();
    }
  }

})();

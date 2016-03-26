'use strict';

var WordCounter = require('../src/wordcounter');
var assert = require('assert');


// Options
// -----------------------------------------------------------------------------

describe('options', function () {
  describe('mincount', function () {
    var wordcounter = new WordCounter({
          mincount: 2
        });

    it('should match "foo" only', function () {
      assert.deepEqual(wordcounter.count('foo bar baz foo'), [{
        word: 'foo',
        count: 2
      }]);
    });
  });

  describe('minlength', function () {
    var wordcounter = new WordCounter({
          minlength: 4
        });

    it('should match "quux" and "norf"', function () {
      assert.deepEqual(wordcounter.count('foo bar baz quux norf'), [{
        word: 'norf',
        count: 1
      }, {
        word: 'quux',
        count: 1
      }]);
    });
  });

  describe('ignore', function () {
    var wordcounter = new WordCounter({
          ignore: [
            'foo',
            'baz'
          ]
        });

    it('should match "bar" only', function () {
      assert.deepEqual(wordcounter.count('foo bar baz'), [{
        word: 'bar',
        count: 1
      }]);
    });
  });

  describe('ignorecase', function () {
    var wordcounter = new WordCounter({
      ignorecase: true
    });

    it('should match "Foo" as "foo"', function () {
      assert.deepEqual(wordcounter.count('foo Foo'), [{
        word: 'foo',
        count: 2
      }]);
    });
  });
});


// Methods
// -----------------------------------------------------------------------------

describe('methods', function () {
  describe('setup', function () {
    var wordcounter = new WordCounter({
          mincount: 2
        });

    it('should equal to 2', function () {
      assert.equal(2, wordcounter.options.mincount);
    });
  });

  describe('count', function () {
    var wordcounter = new WordCounter({
          count: 4
        });

    it('should match "foo", "bar" and "baz"', function () {
      assert.deepEqual(wordcounter.count('^foo+bar*baz$'),
      [{
        word: 'bar',
        count: 1
      }, {
        word: 'baz',
        count: 1
      }, {
        word: 'foo',
        count: 1
      }]);
    });
  });
});


// Others
// -----------------------------------------------------------------------------

describe('others', function () {
  describe('diacritics', function () {
    var wordcounter = new WordCounter();

    it('should match "chén", "fèng" and "yuán"', function () {
      assert.deepEqual(wordcounter.count('chén fèng yuán'),
      [{
        word: 'chén',
        count: 1
      }, {
        word: 'fèng',
        count: 1
      }, {
        word: 'yuán',
        count: 1
      }]);
    });
  });
});

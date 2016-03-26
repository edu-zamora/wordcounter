/*!
 * Word Counter v@VERSION
 * https://github.com/fengyuanchen/wordcounter
 *
 * Copyright (c) 2014-@YEAR Fengyuan Chen
 * Released under the MIT license
 *
 * Date: @DATE
 */

(function (global, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(global, true);
  } else {
    factory(global);
  }
})(typeof window !== 'undefined' ? window : this, function (window, noGlobal) {

  'use strict';


  // Variables
  // ---------------------------------------------------------------------------

  // RegExps (\u00E0-\u00FC -> àáâãäåæçèéêëìíîïðñòóôõö÷øùúûü)
  var REGEXP_WORDS = /[\w\u00E0-\u00FC]+(-[\w\u00E0-\u00FC]+)*/g;

  // Others
  var EMPTY_OBJECT = {};
  var toString = EMPTY_OBJECT.toString;


  // Utilities
  // ---------------------------------------------------------------------------

  function typeOf(obj) {
    return toString.call(obj).slice(8, -1).toLowerCase();
  }

  function isNumber(num) {
    return typeof num === 'number' && !isNaN(num);
  }

  function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  function isFunction(fn) {
    return typeOf(fn) === 'function';
  }

  function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : typeOf(arr) === 'array';
  }

  function toArray(obj, offset) {
    var args = [];

    if (Array.from) {
      return Array.from(obj).slice(offset || 0);
    }

    // This is necessary for IE8
    if (isNumber(offset)) {
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  function inArray(value, arr) {
    var index = -1;

    if (arr.indexOf) {
      return arr.indexOf(value);
    } else {
      each(arr, function (n, i) {
        if (n === value) {
          index = i;
          return false;
        }
      });
    }

    return index;
  }

  function each(obj, callback) {
    var length;
    var i;

    if (obj && isFunction(callback)) {
      if (isArray(obj) || isNumber(obj.length)/* array-like */) {
        for (i = 0, length = obj.length; i < length; i++) {
          if (callback.call(obj, obj[i], i, obj) === false) {
            break;
          }
        }
      } else if (isObject(obj)) {
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (callback.call(obj, obj[i], i, obj) === false) {
              break;
            }
          }
        }
      }
    }

    return obj;
  }

  function extend(obj) {
    var args;

    if (arguments.length > 1) {
      args = toArray(arguments);

      if (Object.assign) {
        return Object.assign.apply(Object, args);
      }

      args.shift();

      each(args, function (arg) {
        each(arg, function (prop, i) {
          obj[i] = prop;
        });
      });
    }

    return obj;
  }


  // Constructor
  // ---------------------------------------------------------------------------

  function WordCounter (options) {
    this.options = extend({}, WordCounter.DEFAULTS);
    this.setup(options);
    this.source = '';
    this.result = null;
  }


  // Prototype
  // ---------------------------------------------------------------------------

  WordCounter.prototype = {
    constructor: WordCounter,

    setup: function (options) {
      if (isObject(options)) {
        extend(this.options, options);
      }
    },

    count: function (source, callback) {
      var options = this.options;
      var result = [];
      var caches = [];
      var words;

      if (typeof source !== 'string') {
        throw new Error('First argument must be a string');
      }

      this.source = source;

      // Match words
      words = source.match(REGEXP_WORDS);

      if (words) {

        // Count words
        each(words, function (word) {
          var existed;
          word = options.ignorecase ? word.toLowerCase() : word;

          if (word.length < options.minlength || inArray(word, options.ignore) > -1) {
            return;
          }

          each(caches, function (cache) {
            if (cache.word === word) {
              existed = true;
              cache.count += 1;
              return false;
            }
          });

          if (!existed) {
            caches.push({
              word: word,
              count: 1
            });
          }
        });

        // Filter words
        each(caches, function (cache) {
          if (cache.count >= options.mincount) {
            result.push(cache);
          }
        });

        // Sort words
        result = result.sort(function (a, b) {

          // Sort by count
          var order = b.count - a.count;

          // Sort by word
          if (order === 0) {
            order = [a.word, b.word].sort().shift() === a.word ? -1 : 1;
          }

          return order;
        });
      }

      this.result = result;
      this.logs = this.format(result);

      if (options.report && typeof console !== 'undefined') {
        console.log(this.logs);
      }

      if (isFunction(callback)) {
        callback.call(this, result, this.logs);
      }

      return result;
    },

    format: function (words) {
      var total = words.length.toString().length;
      var lines = [];

      each(words, function (n, i) {
        var line = ++i;
        var spaces = [];
        var count = total - line.toString().length;

        while (count-- > 0) {
          spaces.push(' ');
        }

        lines.push(spaces.join('') + line + '> ' + n.word + ': ' + n.count);
      });

      return lines.join('\n');
    }
  };


  // Default
  // ---------------------------------------------------------------------------

  WordCounter.DEFAULTS = {
    mincount: 1,
    minlength: 1,
    report: true,
    ignore: [],
    ignorecase: false
  };


  // Export
  // ---------------------------------------------------------------------------

  if (typeof define === 'function' && define.amd) {
    define('wordcounter', [], function () {
      return WordCounter;
    });
  }

  if (!noGlobal) {
    window.WordCounter = WordCounter;
  }

  return WordCounter;

});

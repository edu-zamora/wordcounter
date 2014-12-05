/*!
 * Word Counter v@VERSION
 * https://github.com/fengyuanchen/wordcounter
 *
 * Copyright 2014 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: @DATE
 */

(function () {

  'use strict';

  var console = typeof console !== 'undefined' ? console : { log: function () {} },
      WordCounter = function (options) {
        this.defaults = util.extend({}, WordCounter.DEFAULTS, options);
        this.source = '';
        this.result = null;
      },

      array = [],
      slice = array.slice,
      indexOf = array.indexOf,
      toString = {}.toString,
      util;

  WordCounter.DEFAULTS = {
    mincount: 1,
    minlength: 1,
    report: true,
    ignore: []
  };

  WordCounter.prototype = {
    constructor: WordCounter,

    setup: function (options) {
      if (typeof options === 'object') {
        util.extend(this.defaults, options);
      }
    },

    count: function (source, callback) {
      var defaults = this.defaults,
          result = [],
          caches = [],
          words;

      if (typeof source !== 'string') {
        throw new Error('first argument must be a string');
      }

      this.source = source;

      // Match
      words = source.match(/\b\w+(-\w+)*\b/g);

      if (words) {

        // Count
        util.each(words, function (word) {
          var existed;

          if (word.length < defaults.minlength || util.inArray(word, defaults.ignore) !== -1) {
            return;
          }

          util.each(caches, function (cache) {
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

        // Filter
        util.each(caches, function (cache) {
          if (cache.count >= defaults.mincount) {
            result.push(cache);
          }
        });

        // Sort
        result = result.sort(function (a, b) {
          var order = b.count - a.count; // Sort by count

          if (order === 0) {
            order = [a.word, b.word].sort().shift() === a.word ? -1 : 1; // Sort by word
          }

          return order;
        });
      }

      this.result = result;
      this.logs = this.format(result);

      if (defaults.report) {
        console.log(this.logs);
      }

      if (typeof callback === 'function') {
        callback.call(this, result, this.logs);
      }

      return result;
    },

    format: function (words) {
      var total = words.length.toString().length,
          lines = [];

      util.each(words, function (n, i) {
        var line = ++i,
            spaces = [],
            count = total - line.toString().length;

        while (count-- > 0) {
          spaces.push(' ');
        }

        lines.push(spaces.join('') + line + '> ' + n.word + ': ' + n.count);
      });

      return lines.join('\n');
    }
  };


  // Utilities
  // ---------------------------------------------------------------------------

  util = {
    isArray: Array.isArray || function (arr) {
      return toString.call(arr) === '[object Array]';
    },

    toArray: function (obj, start, end) {
      var args = [];

      if (typeof start === 'number') {
        args.push(start);

        if (typeof end === 'number') {
          args.push(end);
        }
      }

      return slice.apply(obj, args);
    },

    inArray: function (elem, arr, start) {
      var length,
          i;

      if (util.isArray(arr)) {
        if (indexOf) {
          return indexOf.call(arr, elem, start);
        }

        length = arr.length;
        i = start ? (start < 0 ? Math.max(0, length + start) : start) : 0;

        for (; i < length; i++) {
          if (arr[i] === elem) {
            return i;
          }
        }
      }

      return -1;
    },

    each: function (obj, callback) {
      var length,
          i;

      if (typeof callback === 'function') {
        if (util.isArray(obj)) {
          for (i = 0, length = obj.length; i < length; i++) {
            if (callback.call(obj, obj[i], i) === false) {
              break;
            }
          }
        } else if (typeof obj === 'object') {
          for (i in obj) {
            if (obj.hasOwnProperty(i)) {
              if (callback.call(obj, obj[i], i) === false) {
                break;
              }
            }
          }
        }
      }

      return obj;
    },

    extend: function (obj) {
      var args = util.toArray(arguments);

      if (args.length > 1) {
        args.shift();
      } else {
        obj = this;
      }

      util.each(args, function (arg) {
        util.each(arg, function (prop, i) {
          obj[i] = prop;
        });
      });

      return obj;
    },

    proxy: function (fn, context) {
      var args = util.toArray(arguments, 2);

      return function () {
        return fn.apply(context, args.concat(util.toArray(arguments)));
      };
    }
  };


  // Extend prototype
  // ---------------------------------------------------------------------------

  util.extend(WordCounter.prototype, util);


  // Export
  // ---------------------------------------------------------------------------

  if (typeof window !== 'undefined') {
    window.WordCounter = WordCounter;
  }

  if (typeof define === 'function' && define.amd) {
    define('htmlcomb', [], function () {
      return WordCounter;
    });
  }

  if (typeof module === 'object') {
    module.exports = WordCounter;
  }

})();

$(function () {

  'use strict';

  var $source = $('#source');
  var $result = $('#result');
  var wordcounter = new WordCounter();

  function count () {
    wordcounter.count($source.val(), function (result, logs) {
      $result.val(logs);
    });
  }

  $source.on('keyup change', count);

  $('.container').on('click', '[data-toggle]', function (e) {
    var $this = $(this);
    var $parent = $this.parent();
    var toggle = $this.data('toggle');

    if ($parent.hasClass('active')) {
      return;
    }

    e.preventDefault();

    $parent.addClass('active').siblings().removeClass('active');

    switch (toggle) {
      case 'reset':
        $source.val('');
        $result.val('');
        break;

      case 'code':
        $.get('js/wordcounter.js').done(function (text) {
          $source.val(text);
          count();
        });
        break;

      case 'example':
        $.get('http://code.jquery.com/jquery-2.1.4.js').done(function (text) {
          $source.val(text);
          count();
        });
        break;
    }

  });
});

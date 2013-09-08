if (! window.console) {
    (function() {
      var names = ['log', 'debug', 'info', 'warn', 'error',
          'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time',
          'timeEnd', 'count', 'trace', 'profile', 'profileEnd'],
          i, l = names.length;

      window.console = {};

      for (i = 0; i < l; i++) {
        window.console[names[i]] = function() {};
      }
    }());
}

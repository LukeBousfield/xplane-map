angular.module('xplaneMap')

  .directive('eta', function () {
    return {
      scope: {
        hours: '=',
        minutes: '=',
        heading: '='
      },
      templateUrl: 'templates/eta.html'
    };
  });
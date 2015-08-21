angular.module('xplaneMap', ['ngRoute'])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/locs'
      })
      .when('/locs', {
        templateUrl: 'templates/locations.html',
        controller: 'LocationsController'
      })
      .when('/locs/:id', {
        templateUrl: 'templates/location.html',
        controller: 'LocationController'
      })
      .otherwise({
        redirectTo: '/locs'
      });
  });
function getLocations($http) {
  return function (success, fail) {
    $http.get('locations.json')
      .then(success, fail);
  };
}

angular.module('xplaneMap')

  .factory('getLocations', getLocations)
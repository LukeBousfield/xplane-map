function getLocations($http) {
  return function (success, fail) {
    $http.get('/locations.json')
      .then(success, fail);
  };
}

function getMap() {
  return function (city, state) {
    // get city from Google Maps
    console.log('https://www.google.com/maps/embed/v1/place?key=AIzaSyAmbZexTen6N63G0bml3JVRdCKFVBIaI18&q=' + city + '+' + state);
    return 'https://www.google.com/maps/embed/v1/place?key=AIzaSyAmbZexTen6N63G0bml3JVRdCKFVBIaI18&q=' + city + '+' + state;
  };
}

angular.module('xplaneMap')

  .factory('getLocations', getLocations)
  .factory('getMap', getMap);
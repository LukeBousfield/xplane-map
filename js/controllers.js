function LocationsController($scope, getLocations, $location) {
  $scope.locations = [];
  
  var onLocations = function (data) {
    $scope.locations = data.data;
  };
  
  var fail = function (data) {
    console.error('Error retreiving content with error code ' + data.status);
  };
  
  getLocations(onLocations, fail);
  
  $scope.random = function () {
    var min = 0;
    var max = $scope.locations.length - 1;
    var rand = chance.integer({
      min: min,
      max: max
    });
    console.log('/locs/' + rand);
    $location.path('/locs/' + rand);
  };
  
}

function LocationController($scope, $routeParams, getLocations, $sce) {
  var id = parseInt($routeParams.id);
  
  var onLocations = function (data) {
    var locations = data.data;
    console.log(locations);
    locations.forEach(function (location, i) {
      if (i === id) {
        console.log(location);
        $scope.location = location;
        cb(location.lat, location.lng);
      }
    });
  };
  
  var getMap = function (lat, lng) {
    var mapElem = document.getElementById('map');
    console.log(mapElem);
    console.log(lat + ':' + lng);
    var map = new google.maps.Map(mapElem, {
      center: {
        lat: lat,
        lng: lng
      },
      zoom: 4
    });
    
    var BOISE_LAT = 43.61871;
    var BOISE_LNG = -116.21461;

    var coords = [
      {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      },
      {
        lat: lat,
        lng: lng
      }
    ];
    
    var path = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#0eacff',
      strokeWeight: 8
    });

    path.setMap(map);
    
    var boisePointer = new google.maps.Marker({
      position: {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      },
      map: map,
      label: 'A',
      title: 'Boise Airport'
    });
    
    var destPointer = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      label: 'B',
      title: $scope.location.city + ', ' + $scope.location.state
    });
    
  };
  
  var cb = function (lat, lng) {
    getMap(lat, lng);
  };
  
  var fail = function (data) {
    console.error('Error retrieving content with error code ' + data.status);
  };
  
  getLocations(onLocations, fail);
}

angular.module('xplaneMap')

  .controller('LocationsController', LocationsController)
  .controller('LocationController', LocationController);
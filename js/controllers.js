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

function LocationController($scope, $routeParams, getLocations, $sce, getZoomParams) {
  var id = parseInt($routeParams.id);
  
  var onLocations = function (data) {
    console.log('HELLO!');
    var locations = data.data;
    locations.forEach(function (location, i) {
      console.log(i, id);
      if (i === id) {
        $scope.location = location;
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
          address: $scope.location.city + ', ' + $scope.location.state + ' Airport'
        }, cb);
      }
    });
  };
  
  var getMap = function (lat, lng) {
    console.log('HELLO MAP!');
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
      strokeColor: '#0eacff'
    });

    path.setMap(map);
    
    var boisePointer = new google.maps.Marker({
      position: {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      },
      map: map,
      title: 'Boise, Idaho'
    });
    
    var destPointer = new google.maps.Marker({
      position: {
        lat: lat,
        lng: lng
      },
      map: map,
      title: $scope.location.city + ', ' + $scope.location.state
    });
    
  };
  
  var cb = function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      getMap(lat, lng);
    } else {
      console.error('Error getting city with error ' + status);
    }
  };
  
  var fail = function (data) {
    console.error('Error retrieving content with error code ' + data.status);
  };
  
  getLocations(onLocations, fail);
}

angular.module('xplaneMap')

  .controller('LocationsController', LocationsController)
  .controller('LocationController', LocationController);
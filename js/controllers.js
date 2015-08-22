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

function LocationController($scope, $routeParams, getLocations, $http, compHeading, $timeout) {

  var id = parseInt($routeParams.id);

  var onLocations = function (data) {
    var locations = data.data;
    console.log(locations);
    locations.forEach(function (location, i) {
      if (i === id) {
        console.log(location);
        $scope.location = location;
        if (location.lat && location.lng) {
          cb(location.lat, location.lng);
        } else {
          console.log(google.maps.Geocoder);
          var geocoder = new google.maps.Geocoder();

          var callCb = function (obj) {
            if (status === google.maps.GeocoderStatus.OK) {
              var lat = results[0].geometry.location.lat();
              var lng = results[0].geometry.location.lng();
              cb(lat, lng);
            }
          };

          geocoder.geocode({
            address: location.city + ', ' + location.state + ' Airport'
          }, callCb);

        }
      }
    });
  };

  var getMap = function (lat, lng) {

    var mapElem = document.getElementById('map');
    console.log(mapElem);
    var map = new google.maps.Map(mapElem, {
      center: {
        lat: lat,
        lng: lng
      },
      zoom: 4
    });

    var marker = null;

    setInterval(function () {
      $http
        .get('/test.txt')
        .then(function (res) {
          var data = res.data;
          var parts = data.split(',');
          var lat = parseInt(parts[0]);
          var lng = parseInt(parts[1]);
          var heading = parseInt(parts[2]);
          if (!marker) {
            marker = new google.maps.Marker({
              icon: {
                path: 'M 157.98695,184.38488 L 173.37483,168.20017 C 182.38616,159.18884 197.56012,162.31477 197.56012,162.31477 L 242.58958,168.47612 L 265.39575,146.16045 C 277.41087,134.35989 288.26269,152.4142 283.54247,158.63631 L 271.83305,172.24635 L 320.32641,181.22794 L 336.78707,162.03882 C 354.38063,141.01237 367.47041,159.95529 359.53185,171.11218 L 348.89521,184.56906 L 421.75804,194.07153 C 484.40828,133.78139 509.98537,108.77262 526.46939,123.63021 C 543.05967,138.5836 513.71315,168.38877 456.64135,227.17701 L 467.00204,302.24678 L 482.26714,289.52597 C 491.27847,282.01653 507.27901,294.06392 490.75822,309.72648 L 469.76089,329.52825 L 478.61969,378.66527 L 491.73923,368.58052 C 503.32523,359.35463 517.39476,371.55518 501.7322,388.29052 L 480.88803,409.28786 C 480.02981,409.93153 487.69305,452.38631 487.69305,452.38631 C 492.41327,473.19821 480.67347,480.80195 480.67347,480.80195 L 466.35838,493.27782 L 411.97962,339.67439 C 407.47395,326.15738 396.0546,311.47862 376.97351,313.22076 C 366.8894,314.29354 341.41552,331.49026 337.98263,335.56682 L 279.00579,392.27531 C 277.5039,393.34809 288.07915,465.99635 288.07915,465.99635 C 288.07915,468.14191 269.38054,492.66454 269.38054,492.66454 L 232.01433,426.14725 L 213.56128,434.7301 L 224.35108,417.93211 L 157.06733,379.9526 L 182.29502,361.49956 C 194.31014,364.28878 257.3034,371.36975 258.59073,370.72608 C 258.59073,370.72608 309.88762,319.85344 312.81633,316.77643 C 329.76623,298.96831 335.46935,292.31456 338.04402,283.51778 C 340.6208,274.71377 336.23117,261.81195 309.62838,245.4769 C 272.93937,222.94855 157.98695,184.38488 157.98695,184.38488 z',
                fillColor: '#FF0000',
                fillOpacity: 0.6,
                strokeWeight: 0,
                anchor: new google.maps.Point(400, 300),
                scale: 0.15
              },
              position: {
                lat: lat,
                lng: lng
              },
              map: map
            });
          }
          marker.icon.rotation = heading;
          marker.setIcon(marker.icon);
        });
      }, 500);

    var BOISE_LAT = 43.558467;
    var BOISE_LNG = -116.202134;

    var coords = [
      {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      }
    ];

    if ($scope.location.paths) {
      $scope.location.paths.forEach(function (path, i) {
        coords.push(path);
        if (i === $scope.location.paths.length - 1) {
          var nextPath = {
            lat: $scope.location.lat,
            lng: $scope.location.lng
          };
        } else {
          var nextPath = $scope.location.paths[i + 1];
        }

        console.log(google.maps);

        var heading = compHeading(path.lat, path.lng, nextPath.lat, nextPath.lng);

        heading = Math.round(heading);

        new google.maps.Marker({
          position: {
            lat: path.lat,
            lng: path.lng
          },
          map: map,
          label: 'F',
          title: 'Final Approach, new heading ' + heading
        });
      });
    }

    coords.push({
      lat: lat,
      lng: lng
    });

    var path = new google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: '#0eacff',
      strokeWeight: 8
    });

    path.setMap(map);

    if ($scope.location.paths && $scope.location.paths.length > 0) {
      console.log($scope.location.paths[0]);
      var nextLat = $scope.location.paths[0].lat;
      var nextLng = $scope.location.paths[0].lng;
    } else {
      var nextLat = $scope.location.lat;
      var nextLng = $scope.location.lng;
    }

    console.log(nextLat, nextLng);

    var heading = compHeading(BOISE_LAT, BOISE_LNG, nextLat, nextLng);
    console.log(BOISE_LAT, BOISE_LNG, nextLat, nextLng);

    heading = Math.round(heading);

    $timeout(function () {
      alert('ALERT: You have flown for 1 hour.  Cost is now $5.00');
    }, 3600000);

    var boisePointer = new google.maps.Marker({
      position: {
        lat: BOISE_LAT,
        lng: BOISE_LNG
      },
      map: map,
      label: 'A',
      title: 'Boise Airport, follow heading ' + heading
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

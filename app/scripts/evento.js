/**
 * Created by Ariel on 24/09/2016.
 */
angular.module('eventar').controller('EventoCtrl', function ($scope, NgMap, $http) {
  $scope.submitEvento = function (evento) {
    console.log(evento);
  }

  $scope.evento = {};

  $scope.center = [-26.9121973, -49.0869398];
  var markers = [];

  $scope.placeChanged = function () {
    $scope.place = this.getPlace();
    $scope.center = [$scope.place.geometry.location.lat(), $scope.place.geometry.location.lng()];
    $scope.placeMarker($scope.place.geometry.location);
  }

  NgMap.getMap().then(function (map) {
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
    google.maps.event.addListener(map, 'click', function (event) {
      $scope.placeMarker(event.latLng);
    });
    $scope.types = '[\'establishment\']';
    $scope.placeMarker = function (location) {
      clearMarkers();
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      $scope.evento.lat = location.lat();
      $scope.evento.lng = location.lng();
      $http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+ $scope.evento.lat + ', '+ $scope.evento.lng +'&sensor=true').then(function(response){
        $scope.evento.address  = response.data.results[0].formatted_address;
      });


      markers.push(marker);
    }
  });

  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  function clearMarkers() {
    setMapOnAll(null);
  }

  $scope.options = {scrollwheel: false};

  //Set options for dropzone
  //Visit http://www.dropzonejs.com/#configuration-options for more options
  $scope.dzOptions = {
    url: '/alt_upload_url',
    paramName: 'photo',
    maxFilesize: '10',
    maxFiles: 4,
    acceptedFiles: 'image/jpeg, images/jpg, image/png',
    addRemoveLinks: true
  };

  //Handle events for dropzone
  //Visit http://www.dropzonejs.com/#events for more events
  $scope.dzCallbacks = {
    'addedfile': function (file) {
      console.log(file);
      $scope.newFile = file;
    },
    'success': function (file, xhr) {
      console.log(file, xhr);
    }
  };

  //Apply methods for dropzone
  //Visit http://www.dropzonejs.com/#dropzone-methods for more methods
  $scope.dzMethods = {};
  $scope.removeNewFile = function () {
    $scope.dzMethods.removeFile($scope.newFile); //We got $scope.newFile from 'addedfile' event callback
  }

  $scope.isOpen = false;

  $scope.openCalendar = function (e) {
    e.preventDefault();
    e.stopPropagation();

    $scope.isOpen = true;
  };

});

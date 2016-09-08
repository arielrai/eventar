var app = angular.module('eventar', ['ngRoute', 'ui.bootstrap', 'thatisuday.dropzone',
  'ui.bootstrap.datetimepicker', 'ngMap']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/eventos', {
      templateUrl: 'pages/eventos.html'
    })
    .when('/novoEvento', {
      templateUrl: 'pages/novoEvento.html'
    }).otherwise({
      redirectTo: '/eventos'
    });
});

app.controller('mainController', function ($scope, NgMap) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      $scope.currentLat = position.coords.latitude;
      $scope.currentLng = position.coords.longitude;
    });
  }

  $scope.submitEvento = function (evento) {
    console.log(evento);
  };

  $scope.getDistanceFromLatLonInKm = function (evento, lat2, lon2) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var lat1 = position.coords.latitude;
      var lng1 = position.coords.longitude;
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lng1);
      var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      evento.distancia = d;
      $scope.eventos = $scope.eventos;
    });
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
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
  $scope.eventos = [{
    nome: 'Festa na lage',
    descricao: 'Festa na lage da Mirella com direito a cachorro quente paulista (pur\u00EA de batata n\u00E3o incluso).',
    dtFinal: new Date(),
    organizador: 'Mirella Macieal',
    dtInicial: new Date(),
    urlImagem: 'https://scontent.fcwb1-1.fna.fbcdn.net/t31.0-8/13724114_1176572792399987_5395472923415970298_o.jpg',
    urlFacebook: 'https://www.facebook.com/events/583221358527194/',
    lat: -26.9056473,
    lng: -49.079083500000024
  },

    {
      nome: 'Festa aniversário Ariel',
      descricao: 'Festa de aniversário do Ariel',
      dtFinal: new Date(),
      organizador: 'Ariel Rai Rodrigues',
      dtInicial: new Date(),
      urlImagem: 'http://static1.squarespace.com/static/56744689c647ad29367d624e/t/5697f71405caa7eb5b85475c/1450734853177/The+Maxim+Party+2016+Pavilion.jpg?format=2500w',
      urlFacebook: 'https://www.facebook.com/events/1254398704578731/',
      lat: -26.914416793996125,
      lng: -49.08182054758072
    },
  ];
});

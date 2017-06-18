angular.module('starter.controllers', ['ionic.wizard', 'ion-datetime-picker'])
  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {

      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('eventosCtrl', function ($scope, $rootScope, $http, $state) {

    $scope.loadEventos = function () {
      $http.get($rootScope.url + '/evento?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.eventos = response.data;
      }).catch(function (response) {
        $state.go('login');
      });
    }

    $rootScope.$on('login', function (events, args) {
      $scope.loadEventos();
    })
    $scope.loadEventos();
  })
  .controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $http, $ionicLoading, $state) {
    $rootScope.url = 'https://pure-mesa-29909.herokuapp.com';
    $scope.doLogin = function (user) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });

      var req = {
        method: 'POST',
        url: $rootScope.url + '/oauth/token?grant_type=password&username=' + user.username + '&password=' + user.password,
      };
      $http(req).then(function (response) {
        window.sessionStorage.setItem('token', response.data.access_token);
        $state.go('app.eventosList');
        $rootScope.$broadcast('login')
        $ionicLoading.hide();
      }).catch(function (response) {
        $ionicLoading.hide();
        $state.go('login');
      });
    }
  }).controller('novoEventoWizardController', function ($scope, $ionicLoading) {


    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      $scope.map.addListener('click', function (data) {
        alert($scope.evento);
        var uluru = { lat: data.latLng.lat(), lng: data.latLng.lng() };
        if ($scope.marker) $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: uluru,
          map: $scope.map
        });
        console.log(data);
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      $scope.searchBox = new google.maps.places.SearchBox(input);
      $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      $scope.map.addListener('bounds_changed', function () {
        $scope.searchBox.setBounds(map.getBounds());
      });

      $scope.searchBox.addListener('places_changed', function () {
        $scope.places = $scope.searchBox.getPlaces();

        if ($scope.places.length == 0) {
          return;
        }

        // Clear out the old markers.
        if($scope.marker) $scope.marker.setMap(null);

        // For each place, get the icon, name and location.
        $scope.bounds = new google.maps.LatLngBounds();
        $scope.places.forEach(function (place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          $scope.icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: place.geometry.location
          });

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            $scope.bounds.union(place.geometry.viewport);
          } else {
            $scope.bounds.extend(place.geometry.location);
          }
        });
        $scope.map.fitBounds($scope.bounds);
      });
    };

    $scope.centerOnMe = function () {
      console.log("Centering");
      if (!$scope.map) {
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log('Got pos', pos);
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }























  })
  .controller('novoEvento', function ($scope, $rootScope, $http) {
    $scope.necessidades = [
      { descricao: ''},
    ];
    $scope.addNecessidade = function(){
      $scope.necessidades.push({descricao: ""});
    }

    $scope.removeNecessidade = function(index){
      $scope.necessidades.splice(index, 1);
    }

    $scope.salvaEvento = function (navegaParaEvento) {
      if(!!$scope.evento.id){
        $http.post($rootScope.url + '/evento/'+eventoId+'?access_token=' + window.sessionStorage.getItem('token'), $scope.evento).then(function (response) {
            angular.forEach($scopes.necessidades, function (val) {
            });
        });
      }else{
        $http.post($rootScope.url + '/evento'+'?access_token=' + window.sessionStorage.getItem('token'), $scope.evento).then(function (response) {
          $state.go('app.eventosList');
          delete $scope.evento;
        });
      }
    };

    $scope.$watch('necessidades', function (newVal, oldVal) {
      if($scope.necessidades == null || $scope.necessidades.length == 0){
        $scope.necessidades = [
          { descricao: ''}
        ];
      }
    }, true);

    $scope.evento = {};
    $scope.evento.dataInicial = new Date();
    $scope.evento.dataFinal = new Date();

    $rootScope.go = function () {
      window.open("https://github.com/katemihalikova/ion-datetime-picker", "_blank");
    };




    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      $scope.map.addListener('click', function (data) {
        $scope.evento.lng = data.latLng.lng();
        $scope.evento.lat = data.latLng.lat();
        var uluru = { lat: data.latLng.lat(), lng: data.latLng.lng() };
        if ($scope.marker) $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: uluru,
          map: $scope.map
        });
        console.log(data);
      });

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      $scope.searchBox = new google.maps.places.SearchBox(input);
      $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      $scope.map.addListener('bounds_changed', function () {
        $scope.searchBox.setBounds(map.getBounds());
      });

      $scope.searchBox.addListener('places_changed', function () {
        $scope.places = $scope.searchBox.getPlaces();

        if ($scope.places.length == 0) {
          return;
        }

        // Clear out the old markers.
        if($scope.marker) $scope.marker.setMap(null);

        // For each place, get the icon, name and location.
        $scope.bounds = new google.maps.LatLngBounds();
        $scope.places.forEach(function (place) {
          if (!place.geometry) {
            console.log("Returned place contains no geometry");
            return;
          }
          $scope.icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

          // Create a marker for each place.
          $scope.marker = new google.maps.Marker({
            map: $scope.map,
            position: place.geometry.location
          });

          if (place.geometry.viewport) {
            // Only geocodes have viewport.
            $scope.bounds.union(place.geometry.viewport);
          } else {
            $scope.bounds.extend(place.geometry.location);
          }
        });
        $scope.map.fitBounds($scope.bounds);
      });
    };

    $scope.centerOnMe = function () {
      console.log("Centering");
      if (!$scope.map) {
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log('Got pos', pos);
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    }

  });



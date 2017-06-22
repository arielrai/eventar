angular.module('starter.controllers', ['ionic.wizard', 'ion-datetime-picker'])
  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicHistory) {
    $rootScope.cleanHistory = function () {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
    }
    $rootScope.url = 'https://pure-mesa-29909.herokuapp.com';
    //$rootScope.url = 'https://localhost:8443';
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
    $scope.isNoneMine = function () {
      for (eIdx in $scope.eventos) {
        if ($scope.eventos[eIdx].mine) {
          return false;
        }
      }
      return true;
    }
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
  })

  .controller('mapsEventosCtrl', function ($scope, $ionicLoading, $state, $http, $rootScope) {
    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      loadEventos();

      function loadEventos() {
        $http.get($rootScope.url + '/evento?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
          $scope.retorno = response;
          /*$scope.eventos = [
           {lng:-49.06399726867676,
           lat:-26.876832433474426},
           {lng:-49.08358812332153,
           lat:-26.903806794258795},
           {lng:-49.08358812332141,
           lat:-26.903806794258753}];*/

          var eventos = $scope.retorno.data;
          console.log("Eventos: ", eventos);

          //for (var j = 0; j < eventos.; j++) {
          var records = eventos;

          for (var i = 0; i < records.length; i++) {

            var record = records[i];
            var markerPos = new google.maps.LatLng(record.lat, record.lng);

            console.log(record);

            // Add the markerto the map
            var marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: markerPos
            });

            var infoWindowContent = "<h4><link rel=\"stylesheet\" type=\"text/css\" href=" + record.urlFacebook + ">" + record.nome + " </h4>" +
                "<img src=" + record.urlImagem + " height=\"100\" width=\"100\" >" + " <br>" +
                "Data: " + record.dtInicial + " até " + record.dtFinal + "<br>" +
                "Organizado por: " + record.usuario.nome + "<br>"
              ;

            adicionarResumoInfo(marker, infoWindowContent, record);

          }
          //}

          function adicionarResumoInfo(marker, message, record) {
            var infoWindow = new google.maps.InfoWindow({
              content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
              infoWindow.open($scope.map, marker);
            });
          }

        }).catch(function (response) {

        });
      };
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
    };

  })


  .controller('novoEventoWizardController', function ($scope, $ionicLoading) {
    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      $scope.map.addListener('click', function (data) {
        alert($scope.evento);
        var uluru = {lat: data.latLng.lat(), lng: data.latLng.lng()};
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
        if ($scope.marker) $scope.marker.setMap(null);

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

  .controller('novoEvento', function ($scope, $rootScope, $http, $state, $ionicHistory, $stateParams, $ionicLoading, $rootScope) {
    //carrega
    if (!!$stateParams.id) {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      var terminou = false;
      $http.get($rootScope.url + '/evento/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.evento = response.data;
        $scope.eventoOriginalName = angular.copy($scope.evento.nome);
        // if(terminou){
        $ionicLoading.hide();
        // }
        terminou = true
      });
      $http.get($rootScope.url + '/necessidade/' + $stateParams.id + '?access_token=' + window.sessionStorage.getItem('token')).then(function (response) {
        $scope.necessidades = response.data;
        $scope.necessidadesOriginal = angular.copy($scope.necessidades);
      });
    }
    $scope.necessidades = [
      {descricao: ''},
    ];
    $scope.addNecessidade = function () {
      $scope.necessidades.push({descricao: ""});
    }

    $scope.removeNecessidade = function (index) {
      $scope.necessidades.splice(index, 1);
    }

    $scope.$watch('necessidades', function (newVal, oldVal) {
      if ($scope.necessidades == null || $scope.necessidades.length == 0) {
        $scope.necessidades = [
          {descricao: ''}
        ];
      }
    }, true);

    $scope.evento = {};
    $scope.evento.dataInicial = new Date();
    $scope.evento.dataFinal = new Date();

    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.centerOnMe();
      $scope.map.addListener('click', function (data) {
        $scope.evento.lng = data.latLng.lng();
        $scope.evento.lat = data.latLng.lat();
        var uluru = {lat: data.latLng.lat(), lng: data.latLng.lng()};
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
        if ($scope.marker) $scope.marker.setMap(null);

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

        $scope.evento.lng = $scope.marker.position.lng();
        $scope.evento.lat = $scope.marker.position.lat();
        /*$scope.evento.address = $scope.marker.position.add();*/

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

    $scope.salvaEvento = function () {
      //salva
      if (!!$scope.evento.id) {
        $http.post($rootScope.url + '/evento/' + $scope.evento.id + '?access_token=' + window.sessionStorage.getItem('token'), $scope.evento).then(function (response) {
          var eventoId = response.data.id;
          delete $scope.evento;

          angular.forEach($scope.necessidadesOriginal, function (necessidade, key) {
            if (necessidade.id) {
              $http.delete($rootScope.url + '/necessidade/' + eventoId + '/' + necessidade.id + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
              });
            }
          });
          angular.forEach($scope.necessidades, function (necessidade, key) {
            delete necessidade.id
            $http.post($rootScope.url + '/necessidade/' + eventoId + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
              delete $scope.necessidades;
            });
          });
          $rootScope.cleanHistory();
          $state.go('app.eventosList');
        });
      } else {
        $http.post($rootScope.url + '/evento' + '?access_token=' + window.sessionStorage.getItem('token'), $scope.evento).then(function (response) {
          var eventoId = response.data.id;
          delete $scope.evento;
          angular.forEach($scope.necessidades, function (necessidade, key) {
            $http.post($rootScope.url + '/necessidade/' + eventoId + '?access_token=' + window.sessionStorage.getItem('token'), necessidade).then(function (response) {
              delete $scope.necessidades;
            });
          });
          $rootScope.cleanHistory();
          $state.go('app.eventosList');
        });
      }
    }

  })
  .controller('contribuirEventoController', function ($scope, $rootScope, $http, $state, $ionicHistory, $stateParams, $ionicLoading, $rootScope) {

  });



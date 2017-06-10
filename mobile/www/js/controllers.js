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

  .controller('eventosCtrl', function ($scope, $rootScope, $http) {

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
  .controller('LoginCtrl', function ($scope, $rootScope, $stateParams, $state, $http) {
    $rootScope.url = 'https://pure-mesa-29909.herokuapp.com/';
    $scope.doLogin = function (user) {
      var req = {
        method: 'POST',
        url: $rootScope.url + '/oauth/token?grant_type=password&username=' + user.username + '&password=' + user.password,
      };
      // $http(req).then(function (response) {
      // window.sessionStorage.setItem('token', response.data.access_token);
      $state.go('app.eventos');
      $rootScope.$broadcast('login')
      // }).catch(function (response) {
      // $state.go('login');
      // });
    }
  }).controller('novoEventoWizardController', function ($scope, $ionicLoading) {
    
    
    $scope.mapCreated = function (map) {
      $scope.map = map;
      $scope.map.addListener('click', data => {
        var uluru = { lat: data.latLng.lat(), lng: data.latLng.lng() };
        if($scope.marker) $scope.marker.setMap(null);
        $scope.marker = new google.maps.Marker({
          position: uluru,
          map: $scope.map
        });
        console.log(data);
      });
      $scope.centerOnMe();
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
  }})
  .controller('novoEvento', function ($scope, $rootScope, $http) {
    $scope.itens = [
      { produto: 'Leite', quantidade: 2, comprado: false },
      { produto: 'Cerveja', quantidade: 12, comprado: false }
    ];
    $scope.evento = {};
    $scope.evento.dataInicial = new Date();
    $scope.evento.dataFinal = new Date();

    $rootScope.go = function () {
      window.open("https://github.com/katemihalikova/ion-datetime-picker", "_blank");
    };
  });



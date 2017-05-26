var app = angular.module('eventar', ['ngRoute', 'ui.bootstrap',
  'ui.bootstrap.datetimepicker', 'ngMap']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/eventos', {
      templateUrl: 'pages/eventos.html',
      controller: 'EventosCtrl'
    })
    .when('/novoEvento/:eventoId?', {
      templateUrl: 'pages/novoEvento.html',
      controller: 'EventoCtrl'
    })
    .when('/login/:loginMessage?', {
      templateUrl: 'pages/login.html',
      controller: 'LoginCtrl'
    })
    .when('/criarConta', {
      templateUrl: 'pages/criarConta.html',
      controller: 'CriaContaCtrl'

    }).otherwise({
    redirectTo: '/eventos'
  });
});

app.controller('mainController', function ($scope, $rootScope, NgMap, $window, $http, $location) {
  $rootScope.formatUrl = function (url) {
    if(!!$window.localStorage.getItem('token')){
      return 'https://localhost:8443/' + url + '?access_token=' + $window.localStorage.getItem('token');
    }else{
      return 'https://localhost:8443/' + url;
    }
  }
  $rootScope.errorHandle = function(){
    $http.get($rootScope.formatUrl('auth')).then(function(reponse){
      //não vai pra tela de login
    }, function(){
      $location.path('/login/'+'Você precisa fazer login para acessar essa área do site!');
    });
  }
  if(!!$window.localStorage.getItem('token')){
    $http.get('https://localhost:8443/oauth/check_token?token=' + $window.localStorage.getItem('token')).then(function(response){
      $rootScope.login = response.data.user_name;
    }, $rootScope.errorHandle);
  }
});

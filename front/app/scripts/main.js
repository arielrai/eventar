var app = angular.module('eventar', ['ngRoute', 'ui.bootstrap', 'thatisuday.dropzone',
  'ui.bootstrap.datetimepicker', 'ngMap']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/eventos', {
      templateUrl: 'pages/eventos.html',
      controller: 'EventosCtrl'
    })
    .when('/novoEvento', {
      templateUrl: 'pages/novoEvento.html',
      controller: 'EventoCtrl'
    })
    .when('/login', {
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

app.controller('mainController', function ($scope, NgMap) {


});

/**
 * Created by Ariel on 24/09/2016.
 */
angular.module('eventar').controller('LoginCtrl', function ($scope, $routeParams, $window, $http, $location, $rootScope) {
  if (!!$routeParams.loginMessage) {
    $scope.loginMessage = $routeParams.loginMessage;
  }
  $scope.doLogin = function (username, password) {
    var req = {
      method: 'POST',
      url: 'https://localhost:8443/oauth/token?grant_type=password&username=' + username + '&password=' + password,
    };
    $http(req).then(function (response) {
      $window.localStorage.setItem('token', response.data.access_token);
      $location.path("/eventos");
      $rootScope.login = username;
    });
  }
});

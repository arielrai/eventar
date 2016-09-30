/**
 * Created by Ariel on 24/09/2016.
 */
angular.module('eventar').controller('CriaContaCtrl',function($scope, $http) {
  $scope.submitConta = function (usuario) {
    $http.post("http://localhost:8080/usuario", usuario);
  };
});

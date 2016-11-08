/**
 * Created by Ariel on 24/09/2016.
 */
angular.module('eventar').controller('EventosCtrl', function ($scope, $http, $location) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      $scope.currentLat = position.coords.latitude;
      $scope.currentLng = position.coords.longitude;
    });
  }

  angular.element( document.querySelector( '#datepicker' ) ).on("dp.change", function() {
    $scope.selecteddate = $("#datetimepicker").val();
    alert("selected date is " + $scope.selecteddate);
  });

  $scope.navigateEvento = function(id){
    $location.path('/novoEvento/'+ id);
  }

  //Calcula a distância de um evento
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
      //Reatualiza o escopo
      $scope.$digest();
    });
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  $http.get('https://localhost:8443/evento').then(function(response){
    $scope.eventos = response.data;
  });
});

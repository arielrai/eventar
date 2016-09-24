/**
 * Created by Ariel on 24/09/2016.
 */
angular.module('eventar').controller('EventosCtrl', function ($scope) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      $scope.currentLat = position.coords.latitude;
      $scope.currentLng = position.coords.longitude;
    });
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
      $scope.eventos = $scope.eventos;
    });
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

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

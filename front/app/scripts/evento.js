/**
 * Created by Ariel on 24/09/2016.
 */
var eventar = angular.module('eventar').controller('EventoCtrl', function ($scope, NgMap, $http, $routeParams) {
  $scope.evento = {};
  $scope.listaNecessidades = [];

  if (!!$routeParams.eventoNome) {
    $http.get('https://localhost:8443/evento?nome=' + $routeParams.eventoNome).then(function (response) {
      $scope.evento = response.data;
      $scope.eventoOriginalName = angular.copy($scope.evento.nome);
      angular.element(document.querySelector('#data1')).val($scope.evento.dtInicial);
      angular.element(document.querySelector('#data2')).val($scope.evento.dtFinal);
    });
    $http.get('https://localhost:8443/necessidade?nome=' + $routeParams.eventoNome).then(function (response) {
      $scope.listaNecessidades = response.data;
    });

  }

  $scope.steps = {};
  $scope.categorias = [{id: 1, nome: 'Esportes'}, {id: 2, nome: 'Entretenimento'}, {id: 3, nome: 'Estilo de vida'}];
  $scope.steps.firstStep = true;

  $scope.cleanSteps = function () {
    angular.forEach($scope.steps, function (value, key) {
      $scope.steps[key] = false;
    });
  }
  $scope.atualizaDatas = function () {
    $scope.evento.dtInicial = angular.element(document.querySelector('#data1')).val();
    $scope.evento.dtFinal = angular.element(document.querySelector('#data2')).val();
  }

  //Métodos da primeira etapa
  $scope.firstStep = function () {
    $scope.cleanSteps();
    $scope.steps.firstStep = true;
  }

  //Métodos da segunda etapa
  $scope.canGoSecondStep = function () {
    if (!!$scope.dados) {
      return !$scope.dados.$invalid;
    }
    return false;
  }

  $scope.secondStep = function () {
    if ($scope.canGoSecondStep()) {
      $scope.cleanSteps();
      $scope.steps.secondStep = true;
      $scope.atualizaDatas();
      $scope.salvaEvento();
    }
  }

  $scope.salvaEvento = function () {
    $http.post('https://localhost:8443/evento', $scope.evento);
    if (!!$scope.eventoOriginalName && !angular.equals($scope.eventoOriginalName, $scope.evento.nome)) {
      $scope.salvaNecessidades($scope.evento.nome, $scope.eventoOriginalName);
      $scope.eventoOriginalName = $scope.evento.nome;
    } else {
      $scope.salvaNecessidades($scope.evento.nome);
    }
  };

  $scope.salvaNecessidades = function (eventoNome, prevEventoNome) {
    if ($scope.listaNecessidades.length > 0) {
      var necessidades = [];
      angular.forEach($scope.listaNecessidades, function (value, key) {
        necessidades.push({descricao: value.descricao, eventoNome: eventoNome, prevEventoNome: prevEventoNome})
      });
      $http.post('https://localhost:8443/necessidade', necessidades);
    }else{
      
      $http.delete('https://localhost:8443/necessidade?nome=' + $scope.evento.nome)
    }
  };

  $scope.secondStepTooltip = function () {
    if (!$scope.canGoSecondStep()) {
      return 'Defina as informações do seu evento para habilitar esta etapa!'
    } else {
      return 'Informações de localização';
    }
  }

  //Métodos da terceira etapa
  $scope.canGoThirdStep = function () {
    return !!$scope.evento.lat && !!$scope.evento.lng && !!$scope.evento.address;
  }

  $scope.thirdStep = function () {
    if ($scope.canGoThirdStep()) {
      $scope.cleanSteps();
      $scope.steps.thirdStep = true;
      $scope.salvaEvento();
    }
  }

  $scope.canGoLastStep = function () {
    return $scope.canGoSecondStep() && $scope.canGoThirdStep();
  }

  $scope.lastStep = function () {
    if ($scope.canGoLastStep()) {
      $scope.cleanSteps();
      $scope.steps.lastStep = true;
      $scope.salvaEvento();
    }
  }

  $scope.thirdStepTooltip = function () {
    if (!$scope.canGoThirdStep()) {
      return 'Defina o local onde o evento acontecerá para habilitar esta etapa!'
    } else {
      return 'Necessidades do evento';
    }
  }

  $scope.lastStepTooltip = function () {
    if (!$scope.canGoLastStep()) {
      return 'Preencha as etapas anteriores para habilitar esta etapa!'
    } else {
      return '';
    }
  }
});

eventar.directive('dados', function () {
  return {
    templateUrl: 'pages/evento/eventoDados.html',
    restrict: 'E',
    scope: false
  }
});

eventar.directive('localizacao', function (NgMap, $http) {
  return {
    templateUrl: 'pages/evento/eventoLocalizacao.html',
    restrict: 'E',
    scope: false,
    link: function ($scope) {
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
          if (angular.isFunction(location.lat)) {
            $scope.evento.lat = location.lat();
            $scope.evento.lng = location.lng();
          }
          $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + $scope.evento.lat + ', ' + $scope.evento.lng + '&sensor=true').then(function (response) {
            $scope.evento.address = response.data.results[0].formatted_address;
          });


          markers.push(marker);
        }
        if (!!$scope.evento.lat) {
          $scope.placeMarker({lat: parseFloat($scope.evento.lat), lng: parseFloat($scope.evento.lng)})
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

      if (!!$scope.evento.lng) {
        $scope.center = [$scope.evento.lat, $scope.evento.lng];
      } else {
        $scope.center = [-26.9121973, -49.0869398];
      }
    }
  }
});

eventar.directive('necessidades', function () {
  return {
    templateUrl: 'pages/evento/eventoNecessidades.html',
    restrict: 'E',
    scope: false,
    link: function ($scope) {
      $scope.adicionarNecessidade = function (necessidade) {
        $scope.listaNecessidades.push(necessidade);
        delete $scope.necessidade;
      }

      $scope.removerNecessidade = function (necessidade) {
        var index;
        index = $scope.listaNecessidades.indexOf(necessidade);
        $scope.listaNecessidades.splice(index, 1);
        delete $scope.necessidade;
      }
    }
  }
});

eventar.directive('resumo', function ($location) {
  return {
    templateUrl: 'pages/evento/eventoResumo.html',
    restrict: 'E',
    scope: false,
    link: function ($scope) {
      $scope.finalizarEvento = function () {
        $scope.salvaEvento();
        $location.path('/eventos');
      }
    }
  }
});



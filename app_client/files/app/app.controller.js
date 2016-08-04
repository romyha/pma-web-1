(function () {
  angular.module('pm')

    .controller('AppCtrl', function ($state, $ionicPlatform, deviceData, $rootScope, $scope, $ionicHistory, $location, authentication, $ionicPopover, paths, store) {

      document.addEventListener("deviceready", function () { screen.lockOrientation('portrait'); }, false);

      document.addEventListener("offline", function () {
        alert("You are offline, displaying data from last refresh");
      }, false);

      $ionicPlatform.registerBackButtonAction(function (event) {
        if ($ionicHistory.viewHistory().backView) {
          navigator.app.backHistory();
        }
        else if ($state.current.name != 'app.devices') {
          paths.newPathDisableBack('/app/devices');
        } else {
          navigator.app.exitApp();
        }
      }, 100);

      $rootScope.refresh = function () {
        deviceData.devices().success(function (data) {
          store.set("devices", data);
        }).error(function (err) {
          alert("No connection");
        });
      }

      if (!!window.cordova) {
        $rootScope.browser = false;
      } else {
        $rootScope.browser = true;
      }

      $scope.openPopover = function ($event) {
        // Init popover on load
        $ionicPopover.fromTemplateUrl('files/app/popover.html', {
          scope: $scope,
        }).then(function (popover) {
          $scope.popover = popover;
          $scope.popover.show($event);
        });
      };

      $rootScope.testMode = false;

      $scope.$on('$ionicView.enter', function (e) {
        if (paths.hasBackView() || $location.path() == "/app/devices" || $location.path() == "/app/login") {
          $scope.noBack = false;
        } else {
          $scope.noBack = true;
        }
        if (authentication.isLoggedIn()) {
          $scope.isLoggedIn = true;
        }
        else {
          $scope.isLoggedIn = false;
        }

        if (!$rootScope.testMode && !$scope.isLoggedIn && ($location.path() != "/app/register")) {
          paths.newPathDisableBack("/app/login");
        }
      });

      $rootScope.logout = function () {
        authentication.logout();
        $scope.isLoggedIn = authentication.isLoggedIn();
        paths.newPathDisableBack("/app/login");
      }

      $scope.onHelpPage = function () {
        return $location.path() == "/app/help";
      }

      $scope.enterHelp = function () {
        $scope.popover.hide();
        $location.path("/app/help");
      }

      $scope.settings = function () {
        $scope.popover.hide();
        $location.path("/app/settings");
      }

      $scope.onSettings = function () {
        return $location.path() == "/app/settings";
      }

      $scope.goHome = function () {
        paths.newPathDisableBack("/app/devices");
      }
    });
})();
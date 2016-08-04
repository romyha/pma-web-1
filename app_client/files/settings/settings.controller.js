(function () {
    angular.module("pm").controller("settingsCtrl", settingsCtrl);

    settingsCtrl.$inject = ['$ionicHistory', '$location', '$rootScope'];
    function settingsCtrl($ionicHistory, $location, $rootScope) {
        var vm = this;
        vm.goHome = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $location.path("/app/devices");
            $ionicHistory.nextViewOptions.disableBack = false;
        }

        vm.endTestMode = function () {
            $rootScope.testMode = false;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $location.path("/app/login");
            $ionicHistory.nextViewOptions.disableBack = false;
        }
    }
})();
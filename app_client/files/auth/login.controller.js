(function () {
    angular.module("pm").controller("loginCtrl", loginCtrl);

    loginCtrl.$inject = ['$rootScope', '$scope', '$location', '$state', 'authentication', 'store'];
    function loginCtrl($rootScope, $scope, $location, $state, authentication, store) {
        var vm = this;
        $scope.isLoggedIn = authentication.isLoggedIn();
        
        vm.loginWithSncn = function() {
            authentication.logSynapticon();
        }

        vm.toRegister = function () {
            $location.path("app/register");
        }

        vm.asTestUser = function () {
            $scope.isLoggedIn = true;
            $rootScope.testMode = true;
            $location.path("/");
        }

    };
})();
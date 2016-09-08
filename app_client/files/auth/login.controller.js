(function () {
    angular.module("pm").controller("loginCtrl", loginCtrl);

    loginCtrl.$inject = ['$rootScope', '$scope', '$location', 'authentication'];
    function loginCtrl($rootScope, $scope, $location, authentication) {
        var vm = this;
        $scope.isLoggedIn = authentication.isLoggedIn();
        
        vm.loginWithSncn = function() {
            authentication.logSynapticon();
        }

        vm.asTestUser = function () {
            $scope.isLoggedIn = true;
            $rootScope.testMode = true;
            $location.path("/");
        }

    };
})();
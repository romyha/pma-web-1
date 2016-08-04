(function () {
    angular.module('pm').controller('registerCtrl', registerCtrl);
    
    
    function registerCtrl ($scope, $location, $ionicHistory, authentication, paths) {
        var vm = this;
        vm.credentials = {};
        vm.doRegister = function () {
            var user = {
                name: vm.credentials.name,
                email: vm.credentials.email,
                password: vm.credentials.password
            }
            authentication.register(user).error(function (err) {
                vm.log = "Something went wrong";
            }).then(function () {
                vm.log = "Registered";

                //avoid back-button in nav
                paths.newPathDisableBack('/app/devices');
                $scope.$apply();
            });
        };
    };
})();
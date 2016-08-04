(function () {
    angular.module("pm").controller("loginCtrl", loginCtrl);

    loginCtrl.$inject = ['$rootScope', '$scope', '$location', '$state', '$ionicPopup', 'authentication', 'paths', 'store'];
    function loginCtrl($rootScope, $scope, $location, $state, $ionicPopup, authentication, paths, store) {
        var vm = this;
        $scope.isLoggedIn = authentication.isLoggedIn();
        $scope.loginData = {};

        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            $scope.log = "";
            authentication.login({
                email: $scope.loginData.username,
                password: $scope.loginData.password
            }).error(function (err) {
                $scope.log = err;
            }).then(function () {
                $scope.isLoggedIn = authentication.isLoggedIn();

                paths.newPathDisableBack("/app/devices");
            });

        };

        /*vm.loginWithGoogle = function () {
            auth.signin({
                popup: false,
                connection: 'google-oauth2',
                scope: 'openid name email offline_access',
                device: 'Mobile device'


            }, function (profile, token, accessToken, state, refreshToken) {
                store.set('profile', profile);
                store.set('token', token);
                store.set('refreshToken', refreshToken);
                $location.path('/');

                $state.go("app.devices");
            }, function () {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your credentials!'
                });
            });
        }*/
        
        vm.loginWithSncn = function() {
            authentication.logSynapticon();
        }

        vm.toRegister = function () {
            $location.path("app/register");
        }

        vm.asTestUser = function () {
            $scope.isLoggedIn = true;
            $rootScope.testMode = true;
            $location.path("/app/devices");
        }

    };
})();
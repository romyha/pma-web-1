(function () {
    angular.module('pm').factory('authentication', authentication);

    authentication.$inject = ['$rootScope', '$window', '$http', '$resource', '$location', 'pmaServiceApiUrl'];
    function authentication($rootScope, $window, $http, $resource, $location, apiUrl) {
        var popupWidth;
        if (!$rootScope.browser) {
            popupWidth = window.screen.width;
        } else {
            popupWidth = 400;
        }

        //if running on device use inAppBrowser instead
        document.addEventListener('deviceready', function () {
            window.open = cordova.InAppBrowser.open;
            window.close = cordova.InAppBrowser.close;
        })

        var saveToken = function (token) {
            $window.localStorage['pma-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['pma-token'];
        };

        var isLoggedIn = function () {
            var token = getToken();
            return token ? true : false;
        }

        var currentUser = function () {
            if (isLoggedIn()) {
                var token = getToken();
                var name;
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                if (payload.givenName && payload.familyName) {
                    name = payload.givenName.substring(0, 1) + payload.familyName;
                } else name = payload.profile.email.substring(0, payload.profile.email.indexOf('@'));
                return {
                    email: payload.profile.email,
                    name: name
                };
            } else if ($rootScope.testMode) {
                return {
                    email: "test@user.com",
                    name: "Test User"
                }
            }
        };

        register = function (user) {
            return $http.post(apiUrl + '/register', user).success(function (data) {
                saveToken(data.token);
            });
        };

        login = function (user) {
            var req = {
                data: user,
                url: apiUrl + "/login",
                method: 'POST'
            }

            return $http(req).success(function (data) {
                saveToken(data.token);
            });
        };

        logSynapticon = function () {
            var loginPopup = $window.open(apiUrl + '/loginsncn', 'Login');
            $window.addEventListener('message', function (event) {
                saveToken(event.data);
                loginPopup.close();
                $location.path('/');
                $rootScope.$apply();
            });
        };

        logout = function () {
            $window.localStorage.removeItem('pma-token');
            var logoutPopup = window.open('https://account.synapticon.com', 'Logout');
            
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser,
            login: login,
            register: register,
            logout: logout,
            logSynapticon: logSynapticon
        };
    }
})();

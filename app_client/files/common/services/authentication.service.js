(function () {
    angular.module('pm').factory('authentication', authentication);

    authentication.$inject = ['$rootScope', '$window', '$http', '$resource', '$state', 'pmaServiceApiUrl'];
    function authentication($rootScope, $window, $http, $resource, $state, apiUrl) {
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
            var loginPopup = $window.open(apiUrl + '/loginsncn', 'Login', 'width=' + popupWidth + 'px,height=600px');
            window.addEventListener('message', function (event) {
                saveToken(event.data);
                loginPopup.close();
                $state.go('app.devices');
            });

            loginPopup.addEventListener('loadstop', function (event) {
                if (event.url.indexOf('pma') > -1) {
                    loginPopup.executeScript(
                        { code: "localStorage.jwt;" }, function (data) {
                            saveToken(data);
                            loginPopup.close();
                            $state.go('app.devices');
                        }
                    );
                }
            });
        }

        logout = function () {
            $window.localStorage.removeItem('pma-token');
            var logoutPopup = window.open('https://account.synapticon.com', 'Logout', 'width=' + popupWidth + 'px,height=600px');
            
        }

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

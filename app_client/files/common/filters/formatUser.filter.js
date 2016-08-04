(function () {
    angular.module('pm').filter('formatUser', formatUser);

    formatUser.$inject = ['$rootScope', 'authentication', 'store'];
    function formatUser($rootScope, authentication, store) {
        return function (username) {
            var displayedName;
            if (authentication.currentUser() && username == authentication.currentUser().name) {
                displayedName = "you";
            }
            else if (username) {
                if (username.indexOf('@') > -1) {
                    var at = username.indexOf('@');
                    displayedName = username.substring(0, at);
                }
                else
                    displayedName = username.toLowerCase();
            }

            return displayedName;
        };
    };
})();
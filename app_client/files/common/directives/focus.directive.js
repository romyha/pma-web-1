angular.module('pm').directive('focusMe', function ($timeout) {
    return {
        link: function (scope, element, attrs) {

            attrs.$observe('focusMe', function (value) {
                if (value == 'true') {
                    $timeout(function () {
                        element[0].focus();
                    }, 0);
                }
            });
        }
    };
});

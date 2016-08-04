angular.module('pm').directive('navigation', navigation);

function navigation() {
    return {
        restrict: 'EA',
        templateUrl: '/files/common/directives/navigation/navigation.template.html',
        controller: 'navigationCtrl as nvm'
    };
}
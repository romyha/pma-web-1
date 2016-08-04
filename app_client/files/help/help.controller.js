(function () {
    angular.module("pm").controller("helpCtrl", helpCtrl);

    helpCtrl.$inject = ['paths'];
    function helpCtrl(paths) {
        var vm = this;
        vm.goHome = function () {
            paths.newPathDisableBack("/app/devices");
        }
    }
})();
(function () {
    angular.module('pm').service('paths', paths);

    paths.$inject = ['$location', '$ionicHistory'];
    function paths($location, $ionicHistory) {
        var newPathDisableBack = function (path) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $location.path(path);
            $ionicHistory.nextViewOptions.disableBack = false;
        }

        var goAndRemoveBackView = function (path) {
            $location.path(path);
            $ionicHistory.removeBackView();

        }

        var hasBackView = function () {
            if (!$ionicHistory.backView()) {
                return false;
            }
            return true;
        }

        return {
            newPathDisableBack: newPathDisableBack,
            goAndRemoveBackView: goAndRemoveBackView,
            hasBackView: hasBackView
        }
    }
})();
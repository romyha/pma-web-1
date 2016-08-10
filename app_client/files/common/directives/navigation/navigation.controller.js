angular.module('pm').controller('navigationCtrl', navigationCtrl);

function navigationCtrl($location, $uibModal, authentication, deviceData) {
    var nvm = this;

    nvm.user = authentication.currentUser().email;


    nvm.tabs = [
        {
            name: 'Recent Items',
            index: 1,
            path: '/',
            href: '#/'
        },
        {
            name: 'Add Item',
            index: 2,
            path: '/devices/3/new',
            href: '#/devices/3/new'
        }
    ];

    nvm.tabs.forEach(function (tab) {
        if ($location.path() == tab.path) {
            nvm.active = tab.index;
        }
    });

    nvm.select = function (tab) {
        $location.path(tab.path);
    };

    nvm.logout = function () {
        authentication.logout();
        // $scope.isLoggedIn = authentication.isLoggedIn();
        $location.path("/login");
    };

    nvm.camScan = function () {
        var scanModal = $uibModal.open({
            animation: true,
            templateUrl: "/files/home/scan.html",
            controller: 'scanCtrl',
            controllerAs: 'vm'
        });

        scanModal.closed.then(function () {
            Quagga.stop();
        });

        scanModal.result.then(function (result) {
            if (!isNaN(result)) {
                deviceData.deviceByCode(result).success(function (device) {
                    $location.search("code", result);
                    $location.path('');
                }).error(function (err) {
                        $location.path('/devices/' + result + '/new');
                });
            } else {
                alert('No valid code detected.');
            }
        });
    };
}
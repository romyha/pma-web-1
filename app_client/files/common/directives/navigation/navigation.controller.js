(function () {
    angular.module('pm').controller('navigationCtrl', navigationCtrl);

    navigationCtrl.$inject = ['$location', '$uibModal', 'authentication', 'deviceData'];
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
                path: '/devices/code/new',
                href: '#/devices/code/new'
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
                    searchCodeInItems(result);
                } else {
                    alert('No valid code detected.');
                }
            });
        };

        nvm.pistolScan = function () {
            $(document).ready(function () {
                var pressed = false;
                var numbers = [];
                window.addEventListener('keypress', function codeListener(e) {
                    if (e.which >= 48 && e.which <= 57) {
                        numbers.push(String.fromCharCode(e.which));
                    }
                    if (pressed == false) {
                        setTimeout(function () {
                            if (numbers.length > 0) {
                                var barcode = numbers.join("");
                                if ($location.path() == '/') {
                                    searchCodeInItems(barcode);
                                } else {
                                    deviceData.deviceByCode(barcode).success(function (device) {
                                        alert("This code already exists.");
                                    }).error(function(){
                                        $("#code").val(barcode);
                                    });
                                }
                            }
                            window.removeEventListener('keypress', codeListener);
                            numbers = [];
                            pressed = false;
                        }, 500);
                    }
                    pressed = true;
                });
            });
            $("#code").keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                }
            });
        };

        function searchCodeInItems(code) {
            deviceData.deviceByCode(code).success(function (device) {
                $location.search("code", code);
                $location.path('');
            }).error(function (err) {
                $location.path('/devices/' + code + '/new');
            });
        }
    }
})();
(function () {
    angular.module("pm").controller("updateCtrl", updateCtrl);

    updateCtrl.$inject = ['$ionicScrollDelegate', 'popup', '$rootScope', '$location', '$anchorScroll', '$stateParams', 'deviceData', '$scope', 'authentication', 'paths', 'store'];
    function updateCtrl($ionicScrollDelegate, popup, $rootScope, $location, $anchorScroll, $stateParams, deviceData, $scope, authentication, paths, store) {
        var vm = this;

        if (!$rootScope.testMode) {
            if (authentication.currentUser()) {
                vm.author = authentication.currentUser().name;
            } else {
                vm.author = store.get('profile').email;
            }
        }
        else vm.author = "test user";

        vm.devicecode = $stateParams.code;
        vm.noLocation = true;
        vm.noMessage = true;
        vm.locationHide = true;
        vm.date = new Date();

        var ready = false;

        document.addEventListener('deviceready', function () { ready = true; });

        $scope.$on('$ionicView.enter', function () {
            deviceData.deviceByCode(vm.devicecode).success(function (data) {
                vm.device = data;
                vm.device.name = data.name;
            }).error(function () {
                var devices = store.get("devices");
                for (var key in devices) {
                    if (devices[key].code == vm.devicecode) {
                        vm.device = devices[key];
                    }
                }
            });
            deviceData.locations().success(function (locations) {
                vm.locations = locations;
            });
        });

        var form = document.getElementsByTagName('form')[0];

        vm.addUpdate = function () {
            vm.submitted = true;
            var update = {
                author: vm.author,
                status: vm.selector,
                message: vm.message,
                location: vm.location,
                date: vm.date
            };
            deviceData.addUpdateById(vm.device._id, update).success(function (update) {
                if (vm.location && !(vm.locations.indexOf(vm.location) > -1)) {
                    deviceData.addLocation({
                        name: vm.location
                    });
                }
                $location.search('code', vm.devicecode);
                paths.newPathDisableBack("/app/devices");
            }).error(function (err) {
                if (typeof err == 'string' && err.indexOf('Unauthorized') > -1)
                { alert('You do not have permission to do this.'); }
            });
        };

        vm.currentDate = new Date();
        vm.maxDate = vm.currentDate;

        vm.saveDate = function (date) {
            vm.date = date;
        };

        vm.pickDate = function () {
            if (ready) {
                var options = {
                    date: vm.date,
                    windowTitle: "Updated device on",
                    mode: 'date', // or 'time'
                    allowOldDates: true,
                    maxDate: ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf()
                };

                datePicker.show(options, function (date) {
                    if (date != "CANCEL")
                        vm.date = date;
                    $scope.$apply();
                });
            }
        };

        vm.complete = function (loc) {
            vm.location = loc;
            vm.locationHide = true;
        };

        vm.onLocEnter = function () {
            //$location.hash("locAnchor");
            //$ionicScrollDelegate.$getByHandle('locationScroll').scrollTop();
            if (!vm.location) {
                vm.noLocation = true;
                vm.statRequired = true;
            }
            else {
                vm.noLocation = false;
                vm.statRequired = false;
            }

            if (!vm.location) {
                vm.locationHide = true;
            } else vm.locationHide = false;
        }

        vm.onMesEnter = function () {
            if (!vm.message) {
                vm.noMessage = true;
                vm.statRequired = false;
            }
            else {
                vm.noMessage = false;
                vm.statRequired = true;
            }
        }

        vm.updateColor = function () {
            switch (vm.selector) {
                case "green": {
                    vm.color = "lawngreen";
                    break;
                }
                case "yellow": {
                    vm.color = "yellow";
                    break;
                }
                case "blue": {
                    vm.color = "deepskyblue";
                    break;
                }
                case "red": {
                    vm.color = "orangered";
                    break;
                }
            }
        }

        vm.goHome = function () {
            paths.newPathDisableBack("/app/devices");
        }

    }
})();
(function () {
    angular.module("pm").controller("editUpdateCtrl", editUpdateCtrl);

    editUpdateCtrl.$inject = ['$rootScope', '$scope', '$location', '$stateParams', 'deviceData', 'authentication', 'paths', 'store', 'popup'];
    function editUpdateCtrl($rootScope, $scope, $location, $stateParams, deviceData, authentication, paths, store, popup) {
        var vm = this;
        var ready = false;

        document.addEventListener("deviceready", function () {
            ready = true;
        })

        if (!$rootScope.testMode) vm.name = authentication.currentUser().name;
        else vm.name = "test user";

        vm.devicecode = $stateParams.code;
        vm.updateid = $stateParams.updateid;

        vm.locationHide = true;

        deviceData.locations().success(function (locations) {
            vm.locations = locations;
        }).error(function (err) {
            vm.locations = store.get('locations');
        });

        $scope.$on('$ionicView.enter', function () {
            if (store.get('failedUpdateEdit')) {
                vm.update = store.get('failedUpdateEdit');
                setViewData(vm.update);
                deviceData.deviceByCode(vm.devicecode).success(function (data) {
                    vm.device = data;
                });
                store.remove('failedUpdateEdit');
            } else {
                deviceData.deviceByCode(vm.devicecode).success(function (data) {
                    vm.device = data;
                    deviceData.updateById(data._id, vm.updateid).success(function (data) {
                        vm.update = data;
                        setViewData(vm.update);
                    });
                }).error(function (err) {
                    var devices = store.get("devices");
                    for (var key in devices) {
                        if (devices[key].code == vm.devicecode) {
                            vm.device = devices[key];
                            break;
                        }
                    }
                    for (var key in vm.device.updates) {
                        if (vm.device.updates[key]._id == vm.updateid) {
                            vm.update = vm.device.updates[key];
                            setViewData(vm.update);
                            break;
                        }
                    };
                });
            }

        });

        function setViewData(dataset) {
            vm.selector = dataset.status;
            vm.updateColor();
            vm.message = dataset.message;
            vm.location = dataset.location;
            vm.update.date = new Date(dataset.date);
        }


        vm.edit = function () {
            var update = {
                status: vm.selector,
                message: vm.message,
                location: vm.update.location,
                date: vm.update.date,
                _id: vm.updateid
            };
            if (navigator.connection && navigator.connection.type == Connection.NONE) {
                popup.confirm('Offline', 'Do you want to save the request?', 'Yes', function (confirmed) {
                    if (confirmed) {
                        if (!store.get('editUpdates')) {
                            store.set('editUpdates', []);
                        }
                        //store requests if no internet connection
                        var ups = store.get('editUpdates');
                        ups.push({ code: vm.devicecode, id: vm.device._id, update: update });
                        store.set('editUpdates', ups);
                        paths.newPathDisableBack("/app/devices/" + vm.devicecode);
                    }
                });
            } else {
                deviceData.editUpdateById(vm.device._id, vm.updateid, update).success(function (update) {
                    if (!(vm.locations.indexOf(vm.update.location) > -1)) {
                        deviceData.addLocation({
                            name: vm.update.location
                        });
                    }
                    paths.newPathDisableBack("/app/devices/" + vm.devicecode);
                }).error(function (err) {
                    if (typeof err == 'string' && err.indexOf('Unauthorized') > -1)
                    { alert('You do not have permission to do this.'); }
                });
            }


        }

        vm.goHome = function () {
            paths.newPathDisableBack("/app/devices");
        }

        vm.saveDate = function (date) {
            vm.update.date = date;
        }

        vm.maxDate = new Date();

        vm.pickDate = function () {
            if (ready) {
                var options = {
                    date: vm.update.date,
                    windowTitle: "Updated device on",
                    mode: 'date',
                    allowOldDates: true,
                    maxDate: ionic.Platform.isIOS() ? new Date() : (new Date()).valueOf()
                };

                datePicker.show(options, function (date) {
                    if (date != "CANCEL") {
                        vm.update.date = date;
                        $scope.$apply();
                    }
                });

            }

        }

        //check if entered location, if not, hide suggestions
        vm.checkIfEmpty = function () {
            if (!vm.update.location) {
                vm.locationHide = true;
            } else vm.locationHide = false;
        };

        vm.complete = function (loc) {
            vm.update.location = loc;
            vm.locationHide = true;
        };

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
                default: {
                    vm.color = "none";
                    break;
                }
            }
        }
    }
})();
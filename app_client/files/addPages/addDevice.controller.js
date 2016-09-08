(function () {
    angular.module("pm").controller("addDeviceCtrl", addDeviceCtrl);

    addDeviceCtrl.$inject = ['$uibModal', '$rootScope', '$location', 'deviceData', '$routeParams', '$scope', 'store', 'authentication'];
    function addDeviceCtrl($uibModal, $rootScope, $location, deviceData, $routeParams, $scope, store, authentication) {
        var vm = this;
        vm.device = {};
        vm.update = {};
        var img, updimg, chooser, updchooser;
        vm.colorValid = true;
        vm.messageValid = true;
        vm.locationValid = true;

        if ($routeParams.code !== 'code') {
            vm.device.code = $routeParams.code;
        };

        deviceData.locations().success(function (locations) {
            vm.locations = [];
            if (locations.length > 0) {
                locations.forEach(function (loc) {
                    vm.locations.push(loc.name);
                });
            }
        });

        deviceData.itemNames().success(function (names) {
            vm.itemNames = [];
            if (names.length > 0) {
                names.forEach(function (name) {
                    vm.itemNames.push(name.name);
                });
            }
        });

        vm.clear = function () {
            vm.nameerror = "";
            vm.codeerror = "";
        };

        function validate(codeValid, nameValid) {
            if (!nameValid || !codeValid) {
                if (!nameValid) {
                    vm.nameerror = "Name required!";
                } else {
                    vm.nameerror = "";
                }
                if (!codeValid) {
                    vm.codeerror = "Code required!";
                } else {
                    vm.codeerror = "";
                }
                return false;
            }
            if (codeValid && nameValid) {
                return true;
            }
        }

        vm.validateUpdate = function () {
            var valid;
            if (vm.color && !vm.update.message) {
                vm.error = "Location or message and status required.";
                vm.messageValid = false;
                vm.colorValid = true;
                vm.locationValid = true;
                valid = false;
            } else if (vm.update.message && !vm.color) {
                vm.error = "Location or message and status required.";
                vm.colorValid = false;
                vm.messageValid = true;
                vm.locationValid = true;
                valid = false;
            }
            else if (!vm.update.location && !vm.update.message && !vm.color) {
                vm.error = "Location or message and status required.";
                vm.colorValid = false;
                vm.messageValid = false;
                vm.locationValid = false;
                valid = false;
            } else {
                vm.error = "";
                vm.colorValid = true;
                vm.messageValid = true;
                vm.locationValid = true;
                valid = true;
            }
            return valid;
        }

        vm.addDevice = function (codeValid, nameValid) {
            if (validate(codeValid, nameValid) && vm.validateUpdate()) {
                saveItem(false);
            }
        };

        vm.saveAndCreateNext = function (codeValid, nameValid) {
            if (validate(codeValid, nameValid) && vm.validateUpdate()) {
                saveItem(true);
            }
        };

        function saveItem(createNext) {
            var deviceToSave = {
                creator: authentication.currentUser().name,
                name: vm.device.name,
                description: vm.device.description,
                code: vm.device.code
            }

            deviceData.addDevice(deviceToSave).success(function (device) {
                if (img) {
                    deviceData.upload(vm.device.code, img);
                }
                deviceData.addUpdateById(device._id, {
                    author: authentication.currentUser().name,
                    location: vm.update.location,
                    date: new Date(),
                    status: vm.color,
                    message: vm.update.message
                }).success(function (data) {
                    if (updimg) {
                        deviceData.uploadUpdatePicture(vm.device.code, data._id, updimg);
                    }
                    if (!(vm.locations.indexOf(vm.update.location) > -1)) {
                        deviceData.addLocation({
                            name: vm.update.location
                        });
                    }
                }).error(function (err) {
                    if (typeof err == "string" && err.indexOf('Unauthorized') > -1) {
                        vm.unauthorized = true;
                    }
                });
                
                if (vm.itemNames.indexOf(vm.device.name) == -1) {
                    deviceData.addName({ name: vm.device.name });
                }
                afterSave(createNext);
            }).error(function (err) {
                console.log(err);
                if (err.errmsg) {

                    if (err.errmsg.indexOf('name') > -1 && err.errmsg.indexOf('dup key') > -1) {
                        vm.nameerror = "This name already exists.";
                    }
                    if (err.errmsg.indexOf('code') > -1 && err.errmsg.indexOf('dup key') > -1) {
                        vm.codeerror = "This code already exists.";
                    }
                } else if (typeof err == 'string' && err.indexOf('Unauthorized') > -1)
                { alert('You do not have permission to do this.'); }
            });

        }

        function afterSave(createNext) {
            if (createNext) {
                vm.device.code = "";
            } else {
                var code = vm.device.code;
                $location.search('code', code);
                $location.path("/");
            }
        }

        vm.setStatus = function (color, status) {
            vm.status = status;
            vm.color = color;
            vm.validateUpdate();
        };

        setImgFile = function (target) {
            if (target == "item") {
                vm.path = URL.createObjectURL(event.target.files[0]);
                chooser = document.getElementById('file-chooser');
                var file = chooser.files[0];
                if (file) {
                    img = file;
                }
            } else {
                vm.updpath = URL.createObjectURL(event.target.files[0]);
                updchooser = document.getElementById('updfile-chooser');
                var file = chooser.files[0];
                if (file) {
                    updimg = file;
                }
            }
            $scope.$apply();
        };

        vm.removeImg = function (target) {
            if (target == 'item') {
                img = '';
                vm.path = '';
                chooser.value = '';
            } else {
                updimg = '';
                vm.updpath = '';
                updchooser.value = '';
            }
        };

        vm.scan = function () {
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
                        alert('This code already exists!');
                    }).error(function (err) {
                        vm.device.code = result;
                    });
                } else {
                    alert('No valid code detected.');
                }
            });
        };
    }
})();
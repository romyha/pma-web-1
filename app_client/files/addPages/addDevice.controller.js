(function () {
    angular.module("pm").controller("addDeviceCtrl", addDeviceCtrl);

    addDeviceCtrl.$inject = ['$rootScope', '$location', 'deviceData', '$routeParams', '$scope', 'store', 'authentication'];
    function addDeviceCtrl($rootScope, $location, deviceData, $routeParams, $scope, store, authentication) {
        var vm = this;
        vm.device = {};
        var img;

        if ($routeParams.code !== 'code') {
            vm.device.code = $routeParams.code;
        };

        deviceData.locations().success(function (locations) {
            vm.locations = locations;
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

        vm.addDevice = function (codeValid, nameValid) {
            if (validate(codeValid, nameValid)) {
                saveItem(false);
            }
        };

        vm.saveAndCreateNext = function (codeValid, nameValid) {
            if (validate(codeValid, nameValid)) {
                saveItem(true);
            }
        };

        function saveItem(createNext) {
            var deviceToSave = {
                creator: authentication.currentUser().name,
                name: vm.device.name,
                description: vm.device.description,
                status: vm.color,
                location: vm.device.location,
                code: vm.device.code
            }

            if (img) {
                deviceData.upload(vm.device.code, img);
            }

            deviceData.addDevice(deviceToSave).success(function (device) {
                if (vm.device.location && !(vm.locations.indexOf(vm.device.location) > -1)) {
                    deviceData.addLocation({
                        name: vm.device.location
                    });
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
        };

        setImgFile = function () {
            vm.path = URL.createObjectURL(event.target.files[0]);
            var chooser = document.getElementById('file-chooser');
            var file = chooser.files[0];
            if (file) {
                img = file;
            }
            $scope.$apply();
        };

        vm.scan = function () {
            alert('Not yet able to scan');
        }
    }
})();
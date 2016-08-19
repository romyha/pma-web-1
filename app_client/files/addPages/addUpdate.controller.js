(function () {
    angular.module('pm').controller('updateCtrl', updateCtrl);

    updateCtrl.$inject = ['locations', 'author', 'device', 'doRefresh', '$uibModalInstance', 'deviceData'];
    function updateCtrl(locations, author, device, doRefresh, $uibModalInstance, deviceData) {
        var vm = this;
        vm.device = device;
        vm.locations = locations;
        vm.colorValid = true;
        vm.messageValid = true;
        vm.locationValid = true;

        vm.dismiss = function () {
            $uibModalInstance.close();
        };

        vm.setStatus = function (color, status) {
            vm.status = status;
            vm.color = color;
            vm.validate();
        };

        vm.dateOptions = {
            maxDate: new Date()
        };

        vm.update = {};

        vm.update.date = new Date();

        vm.validate = function () {
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

        vm.addUpdate = function () {
            if (vm.validate()) {
                deviceData.addUpdateById(vm.device._id, {
                    author: author,
                    location: vm.update.location,
                    date: vm.update.date,
                    status: vm.color,
                    message: vm.update.message
                }).success(function (data) {
                    if (!(vm.locations.indexOf(vm.update.location) > -1)) {
                        deviceData.addLocation({
                            name: vm.update.location
                        });
                    }
                    doRefresh();
                    vm.dismiss();
                }).error(function (err) {
                    if (typeof err == "string" && err.indexOf('Unauthorized') > -1) {
                        vm.unauthorized = true;
                    }
                });
            }
        };
    }
})();
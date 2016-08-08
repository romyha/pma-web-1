angular.module('pm').controller('updateCtrl', updateCtrl);

function updateCtrl(locations, author, device, doRefresh, $uibModalInstance, deviceData) {
    var vm = this;
    vm.device = device;
    vm.locations = locations;

    vm.dismiss = function () {
        $uibModalInstance.close();
    };

    vm.setStatus = function (color, status) {
        vm.status = status;
        vm.color = color;
    };

    vm.dateOptions = {
        maxDate: new Date()
    };

    vm.update = {};

    vm.update.date = new Date();

    vm.addUpdate = function () {
        deviceData.addUpdateById(vm.device._id, {
            author: author,
            location: vm.update.location,
            date: vm.update.date,
            status: vm.color,
            message: vm.update.message
        }).success(function (data) {
            doRefresh();
            vm.dismiss();
        });
    };
}
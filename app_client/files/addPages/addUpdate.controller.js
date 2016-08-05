angular.module('pm').controller('updateCtrl', updateCtrl);

function updateCtrl(locations, author, device, doRefresh, $uibModalInstance, deviceData) {
    var vm = this;
    vm.device = device;
    vm.locations = locations;

    vm.dismiss = function () {
        $uibModalInstance.dismiss('dismiss');
    };

    vm.setStatus = function (color, status) {
        vm.status = status;
        vm.color = color;
    };

    vm.addUpdate = function () {
        deviceData.addUpdateById(vm.device._id, {
            author: author,
            location: vm.update.location,
            date: new Date(),
            status: vm.color,
            message: vm.update.message
        }).success(function (data) {
            doRefresh();
            vm.dismiss();
        });
    };
}
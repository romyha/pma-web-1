(function () {
    angular.module('pm').controller("scanCtrl", scanCtrl);

    scanCtrl.$inject = ['$uibModalInstance', '$scope'];
    function scanCtrl($uibModalInstance, $scope) {
        setTimeout(function () {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#barcode')
                },
                decoder: {
                    readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "codabar_reader"]
                },
                locate: true
            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });

            Quagga.onDetected(function (data) {
                var code = data.codeResult.code;
                Quagga.stop();
                $uibModalInstance.close(code);
            });

            $('#scan-modal').html5_qrcode(function (code) {
                $('#scan-modal').html5_qrcode_stop();
                $uibModalInstance.close(code);
            }, function (error) { }, function (videoError) {
                if (videoError) {
                    $('#scan-modal').html5_qrcode_stop();
                }
            }
            );
        }, 100);

        $scope.$on("modal.closing", function () {
            $('#scan-modal').html5_qrcode_stop();
        });
    }
})();
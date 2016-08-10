angular.module('pm').controller("scanCtrl", scanCtrl);

function scanCtrl() {
    setTimeout(function () {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#barcode')    // Or '#yourElement' (optional)
            },
            locator: {
                patchSize: "small"
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

            deviceData.deviceByCode(code).success(function (device) {
                $location.search("code", code);
                $location.path('');
            }).error(function (err) {
                if (!isNaN(code)) {
                    $location.path('/devices/' + code + '/new');
                }
            });
        });
    }, 100);

}
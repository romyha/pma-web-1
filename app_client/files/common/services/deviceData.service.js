(function () {
    angular.module('pm').service('deviceData', deviceData);

    deviceData.$inject = ['$http', 'pmaServiceApiUrl', 'authentication'];
    function deviceData($http, apiUrl, authentication) {

        var deviceByCode = function (code) {
            return $http.get(apiUrl + '/devices/' + code);
        };

        var addDevice = function (device) {
            return $http.post(apiUrl + '/devices', device, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var editDeviceById = function (id, data) {
            return $http.put(apiUrl + '/devices/' + id, data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var devices = function () {
            return $http.get(apiUrl + '/devices');
        };

        var updateById = function (deviceid, updateid) {
            return $http.get(apiUrl + '/devices/' + deviceid + '/updates/' + updateid);
        };

        var addUpdateById = function (deviceid, update) {
            return $http.post(apiUrl + '/devices/' + deviceid + '/updates', update, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var editUpdateById = function (deviceid, updateid, data) {
            return $http.put(apiUrl + '/devices/' + deviceid + '/updates/' + updateid, data, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        };

        var deleteById = function (deviceid) {
            return $http.delete(apiUrl + '/devices/' + deviceid, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        var locations = function () {
            return $http.get(apiUrl + '/locations');
        }

        var addLocation = function (location) {
            return $http.post(apiUrl + '/locations', location);
        }

        var deleteUpdate = function (deviceid, updateid) {
            return $http.delete(apiUrl + '/devices/' + deviceid + '/updates/' + updateid, {
                headers: {
                    Authorization: 'Bearer ' + authentication.getToken()
                }
            });
        }

        var upload = function (devicecode, img) {
            var options = {
                method: 'POST',
                url: apiUrl + '/devices/' + devicecode + '/uploadimg',
                headers: {
                    'Content-Type': undefined//'multipart/form-data; boundary=----WebKitFormBoundary4TpcZi3XUXysYj52'
                },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append('file', data.file);
                    return formData;
                },
                data: {
                    file: img
                }
            }
            return $http(options);
        }

        var uploadUpdatePicture = function (devicecode, updateid, img) {
            var options = {
                method: 'POST',
                url: apiUrl + '/devices/' + devicecode + '/updates/' + updateid + '/uploadimg',
                headers: {
                    'Content-Type': undefined//'multipart/form-data; boundary=----WebKitFormBoundary4TpcZi3XUXysYj52'
                },
                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append('file', data.file);
                    return formData;
                },
                data: {
                    file: img
                }
            }
            return $http(options);
        };

        // var uploadDevicePicture = function (devicecode, path) {
        //   return $cordovaFileTransfer.upload(apiUrl + '/devices/' + devicecode + '/uploadimg', path, { chunkedMode: false }, true);
        // };

        return {
            addDevice: addDevice,
            devices: devices,
            addUpdateById: addUpdateById,
            editDeviceById: editDeviceById,
            editUpdateById: editUpdateById,
            updateById: updateById,
            deleteById: deleteById,
            locations: locations,
            addLocation: addLocation,
            deviceByCode: deviceByCode,
            deleteUpdate: deleteUpdate,
            upload: upload,
            uploadUpdatePicture: uploadUpdatePicture
            // uploadDevicePicture: uploadDevicePicture
        };
    }
})();

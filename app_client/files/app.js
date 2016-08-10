angular.module('pm', ['ngRoute', 'ngResource', 'ui.router', 'ui.bootstrap', 'angular-storage', 'angular-jwt'])

    .constant('pmaServiceApiUrl', 'http://localhost:3000/api')

    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'files/home/listing.html',
                controller: 'listingCtrl',
                controllerAs: 'vm'
            })

            .when('/devices/:code/new', {
                templateUrl: 'files/addPages/addDevice.html',
                controller: 'addDeviceCtrl',
                controllerAs: 'vm'
            })

            .when('/login', {
                templateUrl: 'files/auth/login.html',
                controller: 'loginCtrl',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/' });
    })
    
    .run(function(authentication, $location){
        if (!authentication.isLoggedIn()) {
            $location.path('/login');
        }
    });

angular.module('pm', ['ngRoute', 'ngResource', 'ui.router', 'ui.bootstrap', 'angular-storage', 'angular-jwt'])

    .constant('pmaServiceApiUrl', 'http://localhost:5000/api')//'https://pma-service.synapticon.com/api')

    .config(function ($routeProvider, $urlRouterProvider, $locationProvider) {
        //r$ionicConfigProvider.navBar.alignTitle('center');

        $routeProvider

            // .state('app', {
            //     url: '/app',
            //     abstract: true,
            //     templateUrl: 'files/app/menu.html',
            //     controller: 'AppCtrl'
            // })

            // .state('app.login', {
            //     url: '/login',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/auth/login.html',
            //             controller: 'loginCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            // .state('app.register', {
            //     url: '/register',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/auth/register.html',
            //             controller: 'registerCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            .when('/', {

                templateUrl: 'files/home/listing.html',
                controller: 'listingCtrl',
                controllerAs: 'vm'


            })

            // .state('app.updateadd', {
            //     url: '/devices/:code/updates',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/addPages/addChange.html',
            //             controller: 'updateCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            // .state('app.updateedit', {
            //     url: '/devices/:code/updates/:updateid/edit',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/editPages/editChange.html',
            //             controller: 'editUpdateCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            .when('/devices/:code/new', {
                templateUrl: 'files/addPages/addDevice.html',
                controller: 'addDeviceCtrl',
                controllerAs: 'vm'
            })

            // .state('app.deviceedit', {
            //     url: '/devices/:code/edit',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/editPages/editDevice.html',
            //             controller: 'editDeviceCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            // .state('app.help', {
            //     url: '/help',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/help/help.html',
            //             controller: 'helpCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })

            // .state('app.settings', {
            //     url: '/settings',
            //     views: {
            //         'menuContent': {
            //             templateUrl: 'files/settings/settings.html',
            //             controller: 'settingsCtrl',
            //             controllerAs: 'vm'
            //         }
            //     }
            // })
            // if none of the above states are matched, use this as the fallback
            .otherwise({ redirectTo: '/' });
    });

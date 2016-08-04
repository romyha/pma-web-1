angular.module('pm').controller('navigationCtrl', navigationCtrl);

function navigationCtrl($location) {
    var nvm = this;




    nvm.tabs = [
        {
            name: 'Recent Items',
            index: 1,
            path: '/',
            href: '#/'
        },
        {
            name: 'Add Item',
            index: 2,
            path: '/devices/3/new',
            href: '#/devices/3/new'
        }
    ];

    nvm.tabs.forEach(function (tab) {
        if ($location.path() == tab.path) {
            nvm.active = tab.index;
    }
    });

    nvm.select = function (tab) {
        $location.path(tab.path);
    };
}
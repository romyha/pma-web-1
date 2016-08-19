(function () {
    angular.module('pm').directive('resize', resize);

    resize.$inject = ['$timeout'];
    function resize($timeout) {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                attrs.$observe('resize', function (value) {
                    
                    //make sure that page is rendered and changed values are applied before checking them
                    $timeout(function () {
                        if (element[0].localName == 'img') {
                            var infoHeight = document.getElementById('item-info').offsetHeight + 'px';
                            element[0].style.maxHeight = infoHeight;
                        } else if (element[0].localName == 'ul') {
                            var navHeight = document.getElementsByTagName('nav')[0].offsetHeight;
                            var infoHeight = document.getElementById('item-info').offsetHeight;
                            element[0].style.height = document.getElementsByTagName('body')[0].offsetHeight - (infoHeight + navHeight) + 'px';
                        }
                    }, 0);
                });
            }
        };
    };
})();
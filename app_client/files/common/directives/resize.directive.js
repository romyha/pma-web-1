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
                        console.log(element);
                        if (element[0].localName == 'img') {
                            var infoHeight = document.getElementById('item-info').offsetHeight + 'px';
                            element[0].style.maxHeight = infoHeight;
                        } else if (element[0].localName == 'ul') {
                            var navHeight = $('nav').outerHeight(true);
                            var infoHeight = $('#item-info').outerHeight(true);
                            var body = $('body').outerHeight(true);
                            var panel = $('.panel-heading').outerHeight(true);
                            element[0].style.height = body - infoHeight - navHeight - panel - 25 + 'px';
                            console.log(body, infoHeight, navHeight, panel, element[0].style.height);
                        }
                    }, 0);
                });
            }
        };
    };
})();
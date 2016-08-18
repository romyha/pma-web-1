(function () {
    angular.module('pm').directive('positionBarsAndContent', positionBarsAndContent);

    positionBarsAndContent.$inject = ['$timeout'];
    function positionBarsAndContent($timeout) {
        return {
            restrict: 'AC',
            link: function (scope, element, attrs) {
                attrs.$observe('changed', function (value) {
                    //make sure that page is rendered and changed values are applied before checking them
                    $timeout(function () {
                        var navbar = document.getElementsByClassName('bar-header')[0];
                        var offsetTop = navbar.offsetHeight;
                        var content = document.getElementsByTagName('ion-content')[0];
                        var headers = document.getElementsByClassName('bar-subheader');

                        for (var x = 0; x < headers.length; x++) {
                            if (headers[x].className.indexOf('bar-footer') === -1) {
                                //check for attribute show-val which tells if there is sth that can be hidden
                                //(cannot check for ng-show, because getAttribute() returns angular binding as string)
                                if (!headers[x].getAttribute('show-val') || (headers[x].getAttribute('show-val') == "true")) {
                                    headers[x].style.top = offsetTop + 'px';
                                    // Add up the heights of all the header bars
                                    offsetTop = offsetTop + headers[x].offsetHeight;
                                }
                            }
                        }
                        content.style.top = offsetTop + 'px';
                    }, 0);
                });
            }
        };
    };
})();
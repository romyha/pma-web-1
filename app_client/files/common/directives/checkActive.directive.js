(function () {
  angular.module('pm').directive('checkActive', checkActive);

  checkActive.$inject = ['$document', '$window'];
  function checkActive($document, $window) {
    return {
      restrict: 'EA',
      scope: {
        'onActive': '='
      },
      link: function ($scope, element) {
        element.data('checkActive', true);
        angular.element($document[0].body).on('click', function (e) {
          var inThing = angular.element(e.target).inheritedData('checkActive');
          if (inThing) {
            $scope.onActive('in');
          } else {
            $scope.onActive('out');
          }
        })
      }
    }
  };
})();
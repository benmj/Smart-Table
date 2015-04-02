ng.module('smart-table')
  .directive('stCustomSearch', ['stConfig', '$timeout', function (stConfig, $timeout) {
      return {
        require: '^stTable',
        link: function (scope, element, attr, ctrl) {
          var tableCtrl = ctrl;
          var promise = null;
          var throttle = attr.stDelay || stConfig.search.delay;
          var propertyName = attr.stCustomSearch;
          var filterName = attr.filterName;

          if (!filterName.length) {
            throw 'stCustomSearch a custom filter name. Ex: st-custom-search filter-name="myFilter"';
          }

          // view -> customFilters
          element.bind('input', function (evt) {
            if (promise !== null) {
              $timeout.cancel(promise);
            }

            promise = $timeout(function () {
              tableCtrl.customSearch(evt.target.value, propertyName, filterName);
              promise = null;
            }, throttle);
          });
        }
      }
    }]);
describe('stCustomSearch Directive', function () {
    var rootScope;
  var scope;
  var element;

  function trToModel(trs) {
    return Array.prototype.map.call(trs, function (ele) {
      return {
        name: ele.cells[0].innerHTML,
        firstname: ele.cells[1].innerHTML,
        age: +(ele.cells[2].innerHTML)
      };
    });
  }

  beforeEach(module('smart-table', function ($filterProvider) {
    // contrived filter to be used by customSearch
    $filterProvider.register('greaterThan', function () {
      return function (collection, property, greaterThan) {
        if (collection && property && greaterThan) {
          return collection.filter(function (row) {
            return parseInt(row[property]) > parseInt(greaterThan);
          });
        }
        return collection;
      }
    });
  }));

  var stConfig;
  beforeEach(inject(function (_stConfig_) {
    stConfig = _stConfig_;
  }));

  describe('custom filtering', function () {
    beforeEach(inject(function ($compile, $rootScope) {

      rootScope = $rootScope;
      scope = $rootScope.$new();
      scope.rowCollection = [
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99},
        {name: 'Renard', firstname: 'Olivier', age: 33},
        {name: 'Leponge', firstname: 'Bob', age: 22},
        {name: 'Faivre', firstname: 'Blandine', age: 44}
      ];

      var template = '<table st-table="rowCollection">' +
        '<thead>' +
        '<tr>' +
        '<th><input st-custom-search="age" filter-name="greaterThan"/></th>' +
        '<th>age</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="test-filtered" ng-repeat="row in rowCollection">' +
        '<td>{{row.name}}</td>' +
        '<td>{{row.firstname}}</td>' +
        '<td>{{row.age}}</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

      element = $compile(template)(scope);
      scope.$apply();
    }));

    it('should only keep items that meet the custom filter', inject(function ($timeout) {
      var ths = element.find('th');
      var trs;

      var input = angular.element(ths[0].children[0]);
      input[0].value = '50';
      input.triggerHandler('input');
      trs = element.find('tr.test-filtered');
      expect(trs.length).toBe(5);
      $timeout.flush();
      trs = element.find('tr.test-filtered');
      expect(trs.length).toBe(2);
      expect(trToModel(trs)).toEqual([
        {name: 'Renard', firstname: 'Laurent', age: 66},
        {name: 'Francoise', firstname: 'Frere', age: 99}
      ]);
    }));
  });
});
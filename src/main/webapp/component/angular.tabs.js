angular
    .module('components', [])
    .directive('tabs', function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},
            controller: function($scope, $ele) {
                var panes = $scope.panes = [];

                $scope.select = function(pane) {
                    angular.forEach(panes, function(e){
                        e.selected = false;
                    });

                    pane.selected = true;
                },

                this.addPane = function(pane) {
                    if (!panes.length) {
                        pane.selected = true;
                    }
                    panes.push(pane);
                };
            },
            template:
                '<div class="tabbable">' +
                    '<ul class="nav nav-tabs">' +
                        '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                            '<a href="#{{pane.id}}" ng-click="select(pane)">{{pane.title}}</a>' +
                        '</li>' +
                    '</ul>' +
                    '<div class="tab-content" ng-transclude></div>' +
                '</div>',
            replace: true
        };
    })
    .directive('pane', function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: { title: '@'}, // {} = isolate, true = child, false/undefined = no change
            // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
            require: '^tabs', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            replace: true,
            transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, ele, iAttrs, tabsCtrl) {
                tabsCtrl.addPane($scope);
            },
            template:
                '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>'
        };
    });
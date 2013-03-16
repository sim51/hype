angular.module('directives', [])
    .directive('pagination', function () {
        return {
            restrict:'E',
            replace:true,
            transclude: true,
            templateUrl:'/assets/javascripts/angularJS/partials/pagination.html', //Do not remove this div ! @see https://github.com/angular/angular.js/issues/2151
            scope:{
              items :'='
            },
            link:function (scope, element, attrs) {
                // init
                scope.reverse = false;
                scope.filteredItems = [];
                scope.groupedItems = [];
                scope.itemsPerPage = 5;
                scope.pagedItems = [];
                scope.currentPage = 0;


            }
        }
    })
    .directive('countdown', function($timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                 console.log(attrs);
                scope.$watch(attrs.countdown, function(value){
                    scope.endDate = value;
                    console.log("End countdown for : " + scope.endDate);
                    scope.updateTime();
                });

                scope.updateTime = function() {
                    var seconds=0, minutes=0, hours=0, days=0;
                    var timediff = scope.endDate.getTime() - new Date().getTime();
                    if ( timediff <= 1000 ) {
                        element.text("Game Over")
                    }
                    else {
                        seconds     = Math.floor(timediff/1000);
                        minutes     = Math.floor(seconds/60);
                        hours       = Math.floor(minutes/60);
                        days        = Math.floor(hours/24);
                        hours       %= 24;
                        seconds     %= 60;
                        minutes     %= 60;
                        element.text(minutes + ":" + seconds)
                        $timeout(scope.updateTime, 1000);
                    }
                }
            }
        }
    });
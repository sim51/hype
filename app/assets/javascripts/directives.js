angular.module('directives', [])
    .directive('pagination', function ($filter, $location) {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/assets/javascripts/angularJS/partials/pagination.html', //Do not remove this div ! @see https://github.com/angular/angular.js/issues/2151
            link:function (scope, element, attrs) {
                // init
                scope.reverse = false;
                scope.filteredItems = []; // list of data with the current filter applied
                scope.itemsPerPage = 5; // default nb item per page
                scope.pagedItems = []; // array to retrive items by page id
                scope.currentPage = 0; // the current page
                scope.items = []; // all the data not filter
                scope.sortingOrder = attrs.sortingOrder; // the current sorting order


                // Function that compora to string and says that if 'needle' is included into 'groupedItems'.
                var searchMatch = function (haystack, needle) {
                    if (!needle) {
                        return true;
                    }
                    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
                };

                // init the filtered items
                watch = function (newValue, oldValue, scope) {
                    // data are loaded with async, so sometimes, there are undefined.
                    // we avoid it.
                    scope.items = []
                    if( newValue){
                        scope.items = newValue;
                    }
                    scope.search();
                };

                scope.search =function(){
                    scope.filteredItems = $filter('filter')(scope.items, function (item) {
                        for(var attr in item) {
                            if (searchMatch(item[attr], scope.query))
                                return true;
                        }
                        return false;
                    });
                    // take care of the sorting order
                    if (scope.sortingOrder !== '') {
                        scope.filteredItems = $filter('orderBy')(scope.filteredItems, scope.sortingOrder, scope.reverse);
                    }
                    scope.currentPage = 0;
                    // now group by pages
                    groupToPages();
                }

                // calculate page in place
                groupToPages = function () {
                    scope.pagedItems = [];
                    for (var i = 0; i < scope.filteredItems.length; i++) {
                        if (i % scope.itemsPerPage === 0) {
                            scope.pagedItems[Math.floor(i / scope.itemsPerPage)] = [ scope.filteredItems[i] ];
                        } else {
                            scope.pagedItems[Math.floor(i / scope.itemsPerPage)].push(scope.filteredItems[i]);
                        }
                    }
                };

                // View functions
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                scope.range = function (start, end) {
                    var ret = [];
                    if (!end) {
                        end = start;
                        start = 0;
                    }
                    for (var i = start; i < end; i++) {
                        ret.push(i);
                    }
                    return ret;
                };
                scope.prevPage = function () {
                    if (scope.currentPage > 0) {
                        scope.currentPage--;
                    }
                };
                scope.nextPage = function () {
                    if (scope.currentPage < scope.pagedItems.length - 1) {
                        scope.currentPage++;
                    }
                };
                scope.setPage = function () {
                    scope.currentPage = this.n;
                };
                scope.sort_by = function(newSortingOrder) {
                    if (scope.sortingOrder == newSortingOrder){
                        scope.reverse = !scope.reverse;
                    }
                    scope.sortingOrder = newSortingOrder;
                    // icon setup
                    $('th i').each(function(){
                        // icon reset
                        $(this).removeClass().addClass('icon-sort');
                    });
                    if (scope.reverse) {
                        $('th.'+ newSortingOrder +' i').removeClass().addClass('icon-chevron-up');
                    } else {
                        $('th.'+ newSortingOrder +' i').removeClass().addClass('icon-chevron-down');
                    }
                    scope.search();
                };
                scope.see = function(id){
                    $location.path('/prez/' + id);
                };
                scope.run = function(id){
                    $location.path('/prez/run' + id);
                }
                scope.edit = function(id){
                    $location.path('/prez/edit' + id);
                }

                // Let's watch the data & do the job baby
                // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                scope.$watch(attrs.data, watch, true);

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
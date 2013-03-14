angular.module('directives', [])
    .directive('pagination', function () {
        return {
            restrict:'E',
            replace:true,
            templateUrl:'/assets/javascripts/angularJS/partials/pagination.html',
            link:function (scope, element, attrs) {
                var chart = new AwesomeChart(attrs.id);
                chart.chartType = attrs.type || 'default';
                chart.title = attrs.title;

                var redraw = function (newValue, oldValue, scope) {
                    //clear it up first: not the nicest method (should be a call on AwesomeChart) but no other choice here...
                    chart.ctx.clearRect(0, 0, chart.width, chart.height);

                    var data = [], labels = [], colors = [];
                    for (var j=0; j<newValue.length; j++){
                        if(newValue && newValue[j] > 0){
                            data.push(newValue[j]);
                            labels.push(scope.labels[j]);
                            colors.push(scope.colors[j%10]);
                        }
                    }
                    chart.data = data;
                    chart.labels = labels;
                    chart.colors = colors;
                    chart.draw();
                };

                scope.$watch(attrs.data, redraw, true);
            }
        }
    })
    .directive('countdown', function($timeout, countdownService) {
        return {
            restrict: 'C',
            link: function(scope, elm, attrs) {
                scope.BigDay     = null;
                scope.over     = false;

                attrs.$observe('countdownEnd', function(value){
                    if(scope.BigDay == null){
                        scope.BigDay = new Date(value);
                        scope.updateTime();
                    }
                });

                scope.updateTime = function() {
                    var now = new Date();
                    var timediff = scope.BigDay.getTime() - now.getTime();
                    if ( timediff <= 1000 ) scope.finished();
                    else {
                        scope.seconds     = Math.floor(timediff/1000);
                        scope.minutes     = Math.floor(scope.seconds/60);
                        scope.hours       = Math.floor(scope.minutes/60);
                        scope.days        = Math.floor(scope.hours/24);
                        scope.hours       %= 24;
                        scope.seconds     %= 60;
                        scope.minutes     %= 60;
                        $timeout(scope.updateTime, 1000);
                    }
                }

                scope.finished = function() {
                    scope.over = true;
                    countdownService.addCount();
                }
            }
        }
    });
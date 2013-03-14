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
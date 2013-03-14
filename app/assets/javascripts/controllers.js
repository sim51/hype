'use strict';

/**
 *  Error.
 */
function ErrorCtrl() {
}

/**
 *	Home controller : let's display some welcome text & explanation !
 */
function HomeCtrl() {}

/**
 *	Contact controller : do you want to contact me ?
 */
var ContactCtrl = ['$scope', 'Play', function($scope, Play) {
    Play.token().then(function(response){
        $scope.token = response;
        $scope.warning=true;
        $scope.countdown = Date(new Date() + 10*60000);
    })
    $scope.sendMail = function(){
        // No future response, but if there is an error, we are redirect
        // to error page by the service !
        Play.sendMail($scope.name, $scope.email, $scope.message, $scope.token);
        $scope.success=true;
        $scope.warning=false
    }
}]

/**
 *	Contact controller : do you want to contact me ?
 */
var ProfileCtrl = ['$scope', 'Github', function ($scope, Github) {
    $scope.presentations = Github.list();
    $scope.create = function(){}
}]
'use strict';

/**
 *  Error.
 */
function ErrorCtrl() {
}
/**
 *	Home controller : let's display some welcome text & explaination !
 */
function HomeCtrl() {}

/**
 *	Contact controller : do you want to contact me ?
 */
function ContactCtrl($scope, Play) {
    Play.token().then(function(response){
        $scope.token = response;
        $scope.warning=true
    })
    $scope.sendMail = function(){
        // No future response, but if there is an error, we are redirect
        // to error page by the service !
        Play.sendMail($scope.name, $scope.email, $scope.message, $scope.token);
        $scope.success=true;
        $scope.warning=false
    }
}

/**
 *	Contact controller : do you want to contact me ?
 */
function ProfileCtrl($scope, Github) {
    $scope.presentations = Github.list();
}


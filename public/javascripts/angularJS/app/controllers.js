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
    $scope.sendMail = function(){
        // No future response, but if there is an error, we are redirect
        // to error page by the service !
        Play.sendMail($scope.name, $scope.email, $scope.message);
        $scope.success=true
    }
}

/**
 *	Contact controller : do you want to contact me ?
 */
function ProfileCtrl($scope, Github) {
    $scope.presentations = Github.list();
}


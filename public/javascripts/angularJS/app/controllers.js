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
function ContactCtrl($scope) {
    $scope.sendMail = function(){
        alert("Email is sent")
    }
}



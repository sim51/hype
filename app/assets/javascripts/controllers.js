'use strict';

/**
 *  Error.
 */
function ErrorCtrl() {
};

/**
 *	Home controller : let's display some welcome text & explanation !
 */
function HomeCtrl() {};

/**
 *	Contact controller : do you want to contact me ?
 */
var ContactCtrl = ['$scope', 'Play', function($scope, Play) {
    Play.token().then(function(response){
        $scope.token = response;
        $scope.warning=true;
        $scope.countdown = new Date(new Date().getTime() + 10*60000);
    })
    $scope.sendMail = function(){
        // No future response, but if there is an error, we are redirect
        // to error page by the service !
        Play.sendMail($scope.name, $scope.email, $scope.message, $scope.token);
        $scope.success=true;
        $scope.warning=false
    }
}];

/**
 *	Profile controller : manage all prez's user and permit to add one.
 */
var ProfileCtrl = ['$scope', 'Github', 'Play', function ($scope, Github, Play) {
    Github.list().then(function(response){
        $scope.presentations = response;
    })
    $scope.create = function(){
        // getting template prez
        Play.template($scope.name, $scope.message).then(function(template){
            // create the gist
            Github.create($scope.name, $scope.message, $scope.isPublic || false, template).then(function(response){
                $scope.success=true;
                $scope.name ='';
                $scope.message = '';
                $scope.presentations.push(response);
            });
        })
    }
}];

var PrezEditCtrl = ['$scope', '$routeParams', '$timeout', 'Github', function ($scope, $routeParams, $timeout, Github) {
    var id = $routeParams.id;
    Github.get(id).then(function(data){
       $scope.css = data['css'];
       $scope.prez = data['html'];
    });
    $scope.$watch('css + prez', function(newValue, oldValue){
        if (newValue != oldValue) {
            console.log("change !!!");
            var ifrm = document.getElementById('preview');
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
            ifrm.document.open();
            ifrm.document.write($scope.prez);
            ifrm.document.close();
        }
    })
}];

'use strict';

/**
 *  Error.
 */
function ErrorCtrl() {
};

/**
 *	Index controller : let's display some welcome text & explanation !
 */
function IndexCtrl(){
};

/**
 *	Home controller : let's display some welcome text & explanation for anonymous, or profile page for user
 */
var HomeCtrl = ['$rootScope', '$location', function HomeCtrl($rootScope, $location) {
    if($rootScope.isConnected){
        $location.path("/profile");
    }
}];

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

/**
 * Controller to edit a presentation like in jsfiddle.
 */
var PrezEditCtrl = ['$scope', '$routeParams', '$timeout', 'Github', 'Common', function ($scope, $routeParams, $timeout, Github, Common) {
    var id = $routeParams.id;
    Github.get(id).then(function(data){
       $scope.css = data['css'];
       $scope.html = data['html'];
       $scope.name = data['name'];
    });
    // watching change on css + html to update preview
    $scope.$watch('css + html', function(newValue, oldValue){
        if (newValue != oldValue) {
            // little trick to avoid multiple update.
            // We only take the last one by canceled previous
            if($scope.timeout != 'undefined') {
                console.log('cancel timeout');
                $timeout.cancel($scope.timeout);
                $scope.timeout= 'undefined';
            }
            $scope.timeout = $timeout(function(){
                console.log("change !!!");
                var code = $scope.html;
                code = Common.insertInnerCSS( code, $scope.css);
                var ifrm = document.getElementById('preview');
                var currentSlideIndice = {h:0, v:0};
                if(ifrm.contentWindow && ifrm.contentWindow.Reveal){
                    currentSlideIndice = ifrm.contentWindow.Reveal.getIndices();
                }
                console.log('current slide is ' + currentSlideIndice.h + ' ' + currentSlideIndice.v);
                ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
                ifrm.document.open();
                ifrm.document.write(code);
                ifrm.document.close();
                // Goto current slide
                if(ifrm.Reveal){
                    ifrm.Reveal.slide(currentSlideIndice.h, currentSlideIndice.v);
                }
            }, 1000);
        }
    });
    // enable ctrl+s to save the work !
    document.addEventListener("keydown", function(e) {
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            Github.save(id, $scope.name, $scope.html, $scope.css ).then(function(){
                $scope.success = true;
                $timeout(function(){
                    $scope.success = false;
                }, 5000)
            });
        }
    }, false);
}];

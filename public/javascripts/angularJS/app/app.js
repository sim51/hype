'use strict';

/* List all necessary angular module for the application */
var app = angular.module('hope', ['github', 'play']);

/* Configure the application with the route */
app.config(function($routeProvider) {
		$routeProvider
			.when('/error', {templateUrl: '/assets/javascripts/angularJS/partials/error.html', controller: ErrorCtrl})
	      	.otherwise({redirectTo: '/error'});
	});

/* What we do when application start ? */
app.run(function($rootScope, Play){
    console.log("Application start")
    Play.messages().then(function(data){
        $rootScope.messages = data
        console.log($rootScope.messages['page.home'])
    })
});

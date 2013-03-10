'use strict';

/* App Module */
var app = angular.module('hope', ['github', 'play']);

app.config(function($routeProvider) {
		$routeProvider
			.when('/error', {templateUrl: '/assets/javascripts/angularJS/partials/error.html', controller: ErrorCtrl})
	      	.otherwise({redirectTo: '/error'});
	});

app.run(function($rootScope){
});

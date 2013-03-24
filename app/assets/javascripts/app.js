'use strict';

/* List all necessary angular module for the application */
var app = angular.module('hype', ['ngCookies', 'github', 'play', 'directives', 'filter', 'ui', 'Hype']);

/* Configure the application with the route */
app.config(function($routeProvider) {
		$routeProvider
            .when('/', {templateUrl:'/assets/javascripts/angularJS/partials/home.html', controller: HomeCtrl})
            .when('/contact', {templateUrl:'/assets/javascripts/angularJS/partials/contact.html', controller: ContactCtrl})
            .when('/profile', {templateUrl:'/assets/javascripts/angularJS/partials/profile.html', controller: ProfileCtrl})
            .when('/prez/:id', {templateUrl:'/assets/javascripts/angularJS/partials/edit.html', controller: PrezEditCtrl})
			.when('/error', {templateUrl: '/assets/javascripts/angularJS/partials/error.html', controller: ErrorCtrl})
	      	.otherwise({redirectTo: '/'});
});

/* What we do when application start ? */
app.run(function($rootScope, $cookieStore, $cookies, $location, Play){
    console.log("[MAIN] Application start");

    // loading i18n properties
    $rootScope.messages = [];
    Play.messages().then(function(data){
        $rootScope.messages = data;
    });

    // we look at cookies to know user is logged
    if ( $cookies['token'] ) {
        $rootScope.isConnected=true;
        $rootScope.token=$cookieStore.get('token').replace(/"/g,'');
        console.log("[MAIN] user is authenticate with token: " + $rootScope.token);
        // we redirect the user to its page
        // $location.path("/profile");
    }
});

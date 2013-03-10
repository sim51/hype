'use strict';

/* List all necessary angular module for the application */
var app = angular.module('hope', ['github', 'play']);

/* Configure the application with the route */
app.config(function($routeProvider) {
		$routeProvider
            .when('/', {templateUrl:'/assets/javascripts/angularJS/partials/home.html', controller: HomeCtrl})
            .when('/about', {templateUrl:'/assets/javascripts/angularJS/partials/about.html', controller: AboutCtrl})
            .when('/contact', {templateUrl:'/assets/javascripts/angularJS/partials/contact.html', controller: ContactCtrl})
            .when('/user', {templateUrl:'/assets/javascripts/angularJS/partials/user.html', controller: UserCtrl})
            .when('/user/:user', {templateUrl:'/assets/javascripts/angularJS/partials/user.html', controller: UserCtrl})
            .when('/prez/:id', {templateUrl:'/assets/javascripts/angularJS/partials/user.html', controller: PrezViewCtrl})
            .when('/prez/edit/:id', {templateUrl:'/assets/javascripts/angularJS/partials/user.html', controller: PrezEditCtrl})
			.when('/error', {templateUrl: '/assets/javascripts/angularJS/partials/error.html', controller: ErrorCtrl})
	      	.otherwise({redirectTo: '/'});
	});

/* What we do when application start ? */
app.run(function($rootScope, Play){
    console.log("Application start")
    Play.messages().then(function(data){
        $rootScope.messages = data
        console.log($rootScope.messages['page.home'])
    })
});

'use strict';

/*
 *  Error.
 */
function ErrorCtrl() {
}


/* 
 *	Search a repository (/search/:keyword).
 */
function RepositoryListCtrl($scope, $rootScope, $routeParams, $location, $github) {
	var keyword = $routeParams.keyword  || '';
	$rootScope.keyword = keyword;
	if( keyword != ''){
		$('#loading').show();
		$github.search(keyword).then(function(response){
			$scope.repositories = response;
			$('#loading').hide();
		});
	}
	$scope.orderProp = 'name';
}



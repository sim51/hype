'use strict';

var githuburl = 'http://api.github.com';
var playurl = 'http://localhost:9000';

/* Services */
angular.module('github', [ ])
    /* Github gists securesocial*/
    .factory('Gist', function($http, $location, $rootScope){
        return {
            list:function(owner){
                var url = githuburl + '/user/' + user + '/gists?callback=JSON_CALLBACK';
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	//TODO
                        	$rootScope.error = response.data.data.message;
                            $location.path('/error');
                        }
                    });
            },
            get:function(id){
                var url = githuburl + '/gists/' + id + '?callback=JSON_CALLBACK';
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	//TODO
                        	$rootScope.error = response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            create:function(description, content){
                var url = githuburl + '/gists?callback=JSON_CALLBACK';
                return $http.post( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	//TODO
                        	$rootScope.error = response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            save:function(owner, repo, sha){
                var url = githuburl + '/repos/' + owner + '/' + repo  + '/commits?per_page=100&callback=JSON_CALLBACK';
                return $http.jsonp( url, {cache:true} )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                            //TODO
                            $rootScope.error = response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            comments:function(owner, repo){
                var url = githuburl + '/repos/' + owner + '/' + repo  + '/collaborators?callback=JSON_CALLBACK';
                return $http.jsonp( url, {cache:true} )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            return response.data.data;
                        }else{
                        	$rootScope.error = response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            }
        }
    });

angular.module('play', [ ])
    /* Github gists securesocial*/
    .factory('play', function($http, $location, $rootScope){
        return {
            messages:function(owner){
                var url = playurl + '/messages?callback=JSON_CALLBACK';
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	$rootScope.error = "Error when retriving I18N messages.";
                            $location.path('/error');
                        }
                    });
            }
        }
    });

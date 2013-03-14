'use strict';

var githuburl = 'https://api.github.com';
var playurl = 'http://localhost:9000';
var SUCCESS=true

/* Services */
angular.module('github', [ ])
    /* Github gists securesocial*/
    .factory('Github', function($http, $location, $rootScope){
        var token = $rootScope.token;
        return {
            user:function(owner){
                var url = githuburl + '/user/' + user + '/gists?callback=JSON_CALLBACK&access_token=' + token;
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            return response.data.data;
                        }else{
                            $rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });
            },
            list:function(owner){
                var url = githuburl + '/gists?callback=JSON_CALLBACK&access_token=' + token;
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            var gists = response.data.data;
                            var prez = _.filter(gists, function(gist){
                                if(gist.description.indexOf('#hype') > 0){
                                    return true;
                                }
                                else{
                                    return false;
                                }
                            })
                            return prez;
                        }else{
                            $rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });
            },
            get:function(id){
                var url = githuburl + '/gists/' + id + '?callback=JSON_CALLBACK&access_token=' + token;
                return $http.jsonp( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	$rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            create:function(description, content){
                var url = githuburl + '/gists?callback=JSON_CALLBACK&access_token=' + token;
                return $http.post( url )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                        	$rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            save:function(owner, repo, sha){
                var url = githuburl + '/repos/' + owner + '/' + repo  + '/commits?per_page=100&callback=JSON_CALLBACK&access_token=' + token;
                return $http.jsonp( url, {cache:true} )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            //TODO
                            return null;
                        }else{
                            $rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            },
            comments:function(owner, repo){
                var url = githuburl + '/repos/' + owner + '/' + repo  + '/collaborators?callback=JSON_CALLBACK&access_token=' + token;
                return $http.jsonp( url, {cache:true} )
                    .then(function (response){
                        if( response.status == 200 && response.data.meta.status == 200){
                            return response.data.data;
                        }else{
                        	$rootScope.error.title = i18n('error.github');
                            $rootScope.error.cause = i18n('error.case') + response.data.data.message;
                            $location.path('/error');
                        }
                    });   
            }
        }
    });

angular.module('play', [ ])
    /* Github gists securesocial*/
    .factory('Play', function($http, $location, $rootScope){
        return {
            messages:function(){
                var url = playurl + '/api/messages';
                return $http.get( url )
                    .then(function (response){
                        if( response.status == 200 ){
                            return response.data;
                        }else{
                        	$rootScope.error.title = "Error when retriving I18N messages.";
                        	$rootScope.error.cause = i18n('error.case') + "Http code (" + url + ") : " + response.status;
                            $location.path('/error');
                        }
                    });
            },
            token:function(){
                var url = playurl + '/api/token';
                return $http.get( url )
                    .then(function (response){
                        if( response.status == 200 ){
                            return response.data.replace(/"/g, '');
                        }else{
                            $rootScope.error.title = "Error when retriving token.";
                            $rootScope.error.cause = i18n('error.case') + "Http code (" + url + ") : " + response.status;
                            $location.path('/error');
                        }
                    });
            },
            sendMail:function(name, email, message, token){
                console.log("[Play|sendMail] Name:" + name + ", email:" + email +", message:" + message +", token:"+token)
                var url = playurl +'/api/mail'
                var data = "name="+ name +"&email=" + email +"&message=" + message + "&token=" + token;
                $http({
                    method: 'POST',
                    url: url,
                    data: data,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                })
                .success(function(data, status, headers, config) {
                    if( status == 200 ){
                        return SUCCESS;
                    }else{
                        $rootScope.error.title = "Error when retriving token.";
                        $rootScope.error.cause = i18n('error.case') + "Http code (" + url + ") : " + response.status;
                        $location.path('/error');
                    }
                })
                .error(function(data, status, headers, config) {
                    $rootScope.error.title = i18n('error.sendMail');
                    $rootScope.error.cause = i18n('error.case') + "Http code (" + url + ") : " + status;
                    $location.path('/error');
                })
            }
        }
    });
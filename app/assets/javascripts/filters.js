'use strict';

'use strict';

/* Filters */

angular.module('filter', [])
    /**
     * I18N filter
     */
    .filter('i18n', function($rootScope) {
        return function(key) {
            if($rootScope.messages != 'undefined'){
                return $rootScope.messages[key];
            }
            else{
                return '';
            }

        };
    })
    .filter('date', function() {
        return function(date) {
            var date = new Date(Date.parse(date));
            return date.toLocaleDateString();
        };
    })
    .filter('urlEncode', function(){
        return function(string){
            return encodeURIComponent(string);
        }
    });

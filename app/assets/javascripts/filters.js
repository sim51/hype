'use strict';

'use strict';

/* Filters */

angular.module('filter', [])
    /**
     * I18N filter
     */
    .filter('i18n', function($rootScope, Play) {
        return function(key) {
            return $rootScope.messages[key];
        };
    });

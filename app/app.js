var app = angular.module('ipsum',  [
    'ngResource',
    'ngRoute',
    'ui.bootstrap',
    'pascalprecht.translate'
]);

app.config(['$routeProvider', '$translateProvider',

    function($routeProvider, $translateProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'partials/apply.html',
            controller:  'ApplyCtrl'
        }).
        when('/about', {
            templateUrl: 'partials/about.html',
            controller:  'AboutCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

        $translateProvider.useStaticFilesLoader({
          prefix: 'ressources/languages/locale-',
          suffix: '.json'
        });
    }
]);
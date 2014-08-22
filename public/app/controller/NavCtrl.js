app.controller('NavCtrl', ['$scope', '$location', '$translate', 'shareProperty', '$http',  
    function ($scope, $location, $translate, shareProperty, $http) {
        $scope.currentPage = "";

        $scope.$on('$routeChangeSuccess', function(event, current) {
            $scope.currentPage = $location.path().slice(1).split('/')[0];
        });

        $scope.language_d = {};

        var languageNetwork = shareProperty.getNetwork();
        languageNetwork.then(function(result) {  
            $scope.language_d.active = result.data.default_language;
            $translate.use($scope.language_d.active);
        });

        $scope.languages = [{ 
             'name': 'FRENCH', 
             'abv': 'fr'
        }, { 
             'name': 'ENGLISH', 
             'abv': 'en'
        }];

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
            $scope.language_d.active = langKey;
        };

    }
]);

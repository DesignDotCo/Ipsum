app.controller('AboutCtrl', ['$scope', '$http',

    function ($scope, $http) {

        $scope.ipsum = {};

        $http.get('bower.json').success(function(response) {
            $scope.ipsum.version = response.version;
            $scope.ipsum.link = response.github;
            $scope.ipsum.wiki = response.wiki;
        });
    }
]);
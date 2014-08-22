app.controller('ApplyCtrl', ['$scope',

    function ($scope) {

        $scope.step = {};
        $scope.step.one = false;
        $scope.step.two = false;
        $scope.step.three = false;

        $scope.steptwo = function(user) {
            $scope.step.two = true;
        };
    }
]);
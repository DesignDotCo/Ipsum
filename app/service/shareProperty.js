app.service('shareProperty', ['$http', '$q',

    function ($http, $q) {

        var user = {};
        user.contract = false;
        var deferred = $q.defer();

        $http.get('config/network.json').then(function(data) {
            deferred.resolve(data);
        });
        
        return {
            getNetwork: function() {
                return deferred.promise;
            },
            getContract: function () {
                return user;
            },
            setContract: function(value) {
                user.contract = value;
            }
        };
}]);


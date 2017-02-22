var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;
        apiGet(
            '/login_check',
            function(status, response) {
                if (status != null) {
                    $scope.logged_in = true;
                } else {
                    $scope.logged_in = false;
                }
                $scope.loading = false;
                $scope.$digest();
            }
        );
    };

    // Launch interactive dummy API call which will trigger login prompt if necessary
    $scope.loginPrompt = function() {
        xhrWithAuth('GET', '/login_check', true, function(status, response) {
            if (status != null) {
                $scope.logged_in = true;
                localStorage.logged_in = true;
                $scope.$digest();
            }
        });
    };

    $scope.logout = function() {
        $scope.logged_in = false;
    };
});

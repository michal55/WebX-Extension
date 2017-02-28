var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;
        uiLoginCheck($scope, function(status, response) {
                $scope.loading = false;
            }
        );
    };

    $scope.loginPrompt = function() {
        uiLoginPrompt($scope);
    };

    $scope.logout = function() {
        uiLogout($scope);
    };
});

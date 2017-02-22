var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;

        chrome.storage.sync.get({
            server_url: default_options.DEFAULT_SERVER_URL
        }, function(items) {
            $scope.server_url = items.server_url;
            $scope.loading = false;
            $scope.$digest();
        });
    };

    $scope.optionsChanged = function() {
        chrome.storage.sync.set({
            server_url: $scope.server_url
        }, function() {
            // Update status to let user know options were saved
            $scope.status = 'Options saved';
            $scope.$digest();

            setTimeout(function() {
                $scope.status = '';
                $scope.$digest();
            }, 750);
        });
    };
});

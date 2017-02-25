function uiLoginPrompt($scope, onSuccess) {
    xhrWithAuth('GET', '/login_check', true, function(status, response) {
        if (status != null) {
            $scope.logged_in = true;
            localStorage.logged_in = true;
            $scope.$digest();

            if (onSuccess) {
                onSuccess();
            }
        }
    });
}

function uiLogout($scope) {
    // FIXME: Maybe https://stackoverflow.com/questions/26080632/how-do-i-log-out-of-a-chrome-identity-oauth-provider
    $scope.logged_in = false;
}

function uiLoginCheck($scope, callback) {
    apiGet('/login_check', function(status, response) {
        $scope.logged_in = status != null;
        callback(status, response);
        $scope.$digest();
    });
}

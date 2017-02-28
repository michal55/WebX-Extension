var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;
        apiGet(
            '/login_check',
            function(status, response) {
                if (status != null) {
                    $scope.logged_in = true;
                    loadCookies();
                } else {
                    $scope.logged_in = false;
                    // At this point, user is shown 'Please log in by using icon near address bar' message,
                    // just an attempt to make the icon more noticeable
                    for (var i = 0; i < 10; ++i) {
                        // Why is it wrapped in a function? Idk but it doesn't work otherwise
                        // http://stackoverflow.com/a/32567596/6022799
                        (function(i) {
                            setTimeout(function () {
                                setBadgeText(i % 2 ? '' : '...');
                            }, i * 1000);
                        }(i));
                    }
                }
                $scope.loading = false;
                $scope.$digest();
            }
        );
    };

    function loadCookies() {
        $scope.projects = angular.fromJson(localStorage.projects);
        $scope.project = angular.fromJson(localStorage.project);
        $scope.scripts = angular.fromJson(localStorage.scripts);
        $scope.script = angular.fromJson(localStorage.script);
        $scope.xpaths = angular.fromJson(localStorage.xpaths);
    }
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
            var storageChange = changes[key];
            if (key == "newxpath"){
                chrome.storage.local.get('newxpath_name',function(result){
                    var name = result.newxpath_name;
                    for (i in $scope.xpaths.data) {
                        if ($scope.xpaths.data[i].name == name){
                            $scope.xpaths.data[i].value = storageChange.newValue;
                            $scope.$digest();
                        }
                    }
    
                });            
            }
        }
      });


    $scope.getProjects = function() {
        apiGet(
            '/data/user/projects',
            function(status, response) {
                $scope.projects = angular.fromJson(response);
                $scope.project = {name: 'Select project', id: false, disabled: true};
                $scope.projects.unshift($scope.project);
                $scope.scripts = false;
                $scope.script = false;
                $scope.xpaths = false;

                localStorage.projects = angular.toJson($scope.projects);
                localStorage.project = angular.toJson($scope.project);
                localStorage.scripts = false;
                localStorage.script = false;
                localStorage.xpaths = false;

                $scope.$digest();
            }
        );
    };

    $scope.getScripts = function() {
        $scope.script = {name: 'Select script', id: false, disabled: true};
        $scope.xpaths = false;

        localStorage.script = angular.toJson($scope.script);
        localStorage.xpaths = angular.toJson($scope.xpaths);

        apiGet(
            '/data/user/project/' + $scope.project.id.toString() + '/scripts',
            function(status, response) {
                $scope.scripts = angular.fromJson(response);
                $scope.scripts.unshift($scope.script);
                localStorage.scripts = angular.toJson($scope.scripts);
                $scope.$digest();
            }
        );
    };

    $scope.getScriptData = function() {
        $scope.xpaths = false;

        localStorage.xpaths = angular.toJson($scope.xpaths);

        apiGet(
            '/data/user/project/' + $scope.project.id.toString() + '/scripts/' + $scope.script.id,
            function(status, response) {
                $scope.xpaths = angular.fromJson(response);
                localStorage.xpaths = angular.toJson($scope.xpaths);
                $scope.$digest();
            }
        );
    };

    $scope.changeScript = function() {
        localStorage.xpaths = angular.toJson($scope.xpaths);
    };

    $scope.saveScript = function() {
        $scope.saving = true;
        apiPut(
            '/data/user/project/' + $scope.project.id.toString() + '/scripts/' + $scope.script.id.toString(),
            function(status, response) {
                $scope.saving = false;
                $scope.$digest();
            },
            angular.toJson($scope.xpaths)
        );
    };

    $scope.toggleTargeting = function(name) {
        chrome.storage.local.set({ "newxpath_name": name }, function() {});
        get_xpath();      
        };

    $scope.selectProject = function() {
        localStorage.project = angular.toJson($scope.project);
        $scope.getScripts();
    };

    $scope.selectScript = function() {
        $scope.xpaths = false;
        localStorage.script = angular.toJson($scope.script);
        $scope.getScriptData();
    };
});


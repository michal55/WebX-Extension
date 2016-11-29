var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;
        apiGet(
            '',
            function(status, response) {
                if (status != null) {
                    $scope.logged_in = true;
                    loadCookies();
                } else {
                    $scope.logged_in = false;
                }
                $scope.loading = false;
                $scope.$digest();
            }
        );
    }

    function loadCookies() {
        $scope.projects = angular.fromJson(localStorage.projects);
        $scope.project = angular.fromJson(localStorage.project);
        $scope.scripts = angular.fromJson(localStorage.scripts);
        $scope.script = angular.fromJson(localStorage.script);
        $scope.xpaths = angular.fromJson(localStorage.xpaths);
    }

    // Launch interactive dummy API call which will trigger login prompt if necessary
    $scope.loginPrompt = function() {
        xhrWithAuth('GET', '', true, function(status, response) {
            if (status != null) {
                $scope.logged_in = true;
                localStorage.logged_in = true;
                $scope.$digest();
                loadCookies();
                if ($scope.projects == false) {
                    $scope.getProjects();
                }
            }
        });
    }

    $scope.logout = function() {
        $scope.logged_in = false;

        localStorage.logged_in = false;
        localStorage.projects = false;
        localStorage.project = false;
        localStorage.scripts = false;
        localStorage.script = false;
        localStorage.xpaths = false;
        loadCookies();
    }

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
    }

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
    }

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
    }

    $scope.changeScript = function() {
        localStorage.xpaths = angular.toJson($scope.xpaths);
    }

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
    }

    $scope.toggleTargeting = function() {
        $scope.targeting = !$scope.targeting;
        if ($scope.targeting) {
            $('body').css('minWidth', '36px');
            $('body').css('width', '36px');
            $('body').css('minHeight', '30px');
            $('body').css('height', '30px');
        } else {
            $('body').css('minWidth', '768px');
            $('body').css('width', '768px');
            $('body').css('minHeight', '300px');
            $('body').css('height', '300px');
        }
    }

    $scope.selectProject = function() {
        localStorage.project = angular.toJson($scope.project);
        $scope.getScripts();
    }

    $scope.selectScript = function() {
        $scope.xpaths = false;
        localStorage.script = angular.toJson($scope.script);
        $scope.getScriptData();
    }
});

var app = angular.module('extension', []);
app.controller('main', function($scope) {
    $scope.init = function() {
        $scope.loading = true;

        getServerURL(function(url_base) {
            $scope.url_base = url_base;

            uiLoginCheck($scope, function(status, response) {
                if (status != null) {
                    loadCookies();
                } else {
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
            });
        });
    };

    function loadCookies() {
        $scope.projects = angular.fromJson(localStorage.projects);
        $scope.project = angular.fromJson(localStorage.project);
        $scope.scripts = angular.fromJson(localStorage.scripts);
        $scope.script = angular.fromJson(localStorage.script);
        $scope.script_builder = angular.fromJson(localStorage.script_builder);
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
                $scope.script_builder = false;

                localStorage.projects = angular.toJson($scope.projects);
                localStorage.project = angular.toJson($scope.project);
                localStorage.scripts = false;
                localStorage.script = false;
                localStorage.script_builder = false;

                $scope.$digest();
            }
        );
    };

    $scope.getScripts = function() {
        $scope.script = {name: 'Select script', id: false, disabled: true};

        localStorage.script = angular.toJson($scope.script);

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
        apiGet(
            '/data/user/project/' + $scope.project.id.toString() + '/scripts/' + $scope.script.id,
            function(status, response) {
                $scope.script_builder.loadScripts(angular.fromJson(response));
                $scope.$digest();

                console.log('after load... ', $scope.script_builder.data_fields)
            }
        );
    };

    $scope.changeScript = function() {

    };

    $scope.saveScript = function() {
        $scope.saving = true;
        apiPut(
            '/data/user/project/' + $scope.project.id.toString() + '/scripts/' + $scope.script.id.toString(),
            function(status, response) {
                $scope.saving = false;
                $scope.$digest();
            },
            angular.toJson($scope.script_builder.getJson())
        );
    };

    $scope.toggleTargeting = function(name) {
        chrome.storage.local.set({ "newxpath_name": name }, function() {});
        get_xpath();
    };

    $scope.addPositiveInput = function(field) {
        console.log('positive input:', field);
        if (typeof field.positives === 'undefined') {
            console.log('mame prazdny positives, robiem novy');
            field.positives = [{
                'value': ''
            }]
        } else {
            console.log('uz tam nieco mame, vid: ', field.positives);
            field.positives.push({
                'value': ''
            });
        }
    };

    $scope.addNegativeInput = function(field) {
        console.log('negative input:', name);
        if (typeof field.negatives === 'undefined') {
            console.log('mame prazdny positives, robiem novy');
            field.negatives = [{
                'value': ''
            }]
        } else {
            console.log('uz tam nieco mame, vid: ', field.positives);
            field.negatives.push({
                'value': ''
            });
        }
    };

    $scope.squash = function(field) {
        // field.value = YOUR CODE FOR SQUASHING
        field.value = 'squashed xpath';

        // CLEAN FIELDS
        field.negatives = [];
        field.positives = [];
    };

    $scope.selectProject = function() {
        localStorage.project = angular.toJson($scope.project);
        $scope.getScripts();

        apiGet(
            '/data/user/project/' + $scope.project.id.toString() + '/data_fields',
            function(status, response) {
                $scope.script_builder = new ScriptBuilder(angular.fromJson(response));
                $scope.$digest();
            }
        );
    };

    $scope.selectScript = function() {
        localStorage.script = angular.toJson($scope.script);
        $scope.getScriptData();
    };

    $scope.loginPrompt = function() {
        uiLoginPrompt($scope, function() { $scope.getProjects(); });
    };

    $scope.logout = function() {
        uiLogout($scope);
    };

    $scope.refresh = function() {
        uiLoginCheck($scope, function(status, response) {
            if (status != null) {
                $scope.getProjects();
            }
        });
    };
});

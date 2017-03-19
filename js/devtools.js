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

        //!!! To be reworked, click refresh after load
        if (localStorage.script_builder) {
            //$scope.script_builder = new ScriptBuilder();
            //$scope.script_builder.fromJSON(localStorage.script_builder);
        }
    }

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            if (key == 'newxpath') {
                chrome.storage.local.get('field_id', function(result) {
                    var field_id = result.field_id;
                    chrome.storage.local.get('field_type', function(result_type) {
                        var field_type = result_type.field_type;
                        if (field_type == 'field_id') {
                            $scope.script_builder.scripts[field_id].xpath = storageChange.newValue;
                            localStorage.script_builder = $scope.script_builder.toJSON();
                            $scope.$digest();
                        } else {
                            chrome.storage.local.get('pos_neg_indx', function(result_indx) {
                                var indx = result_indx.pos_neg_indx;
                                if (field_type == 'positive_id') {
                                    $scope.script_builder.data_fields[field_id].positives[indx].xpath = storageChange.newValue;
                                } else if (field_type == 'negative_id') {
                                    $scope.script_builder.data_fields[field_id].negatives[indx].xpath = storageChange.newValue;
                                }

                                localStorage.script_builder = $scope.script_builder.toJSON();
                                $scope.$digest();
                            });
                        }
                    });
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
            }
        );
    };

    $scope.changeXpath = function() {
        localStorage.script_builder = $scope.script_builder.toJSON();
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

    $scope.toggleTargeting = function(field_id, field_type, indx) {
        chrome.storage.local.set({'field_id': field_id}, function() {});
        chrome.storage.local.set({'field_type': field_type}, function() {});
        chrome.storage.local.set({'pos_neg_indx': indx}, function() {});
        get_xpath();
    };

    $scope.toggleTargetingForSquash = function(field_name, field_type, indx) {
        var field_id = $scope.script_builder.data_fields.findIndex((field) => field.name == field_name);
        $scope.toggleTargeting(field_id, field_type, indx);
    };

    $scope.focusXpath = function(field) {
        starthighlight($scope.script_builder.scripts[field.scriptId].xpath, 'base');
        (field.positives || []).forEach((element) => starthighlight(element.xpath, 'positive'));
        (field.negatives || []).forEach((element) => starthighlight(element.xpath, 'negative'));
    };

    $scope.blurXpath = function() {
        stophighlight();
    };

    $scope.addPositiveInput = function(field) {
        if (typeof field.positives === 'undefined') {
            field.positives = [{
                'xpath': '',
                'id': 0
            }]
        } else {
            field.positives.push({
                'xpath': '',
                'id': field.positives.length
            });
        }
    };

    $scope.addNegativeInput = function(field) {
        if (typeof field.negatives === 'undefined') {
            field.negatives = [{
                'xpath': '',
                'id': 0
            }]
        } else {
            field.negatives.push({
                'xpath': '',
                'id': field.negatives.length
            });
        }
    };

    $scope.squash = function(field) {
        var main_xpath = $scope.script_builder.scripts[field.scriptId].xpath.split('/');

        for (var i in field.positives) {
            var p_xpath = field.positives[i].xpath.split('/');

            if (main_xpath.length != p_xpath.length) {
                continue;
            }

            for (var indx in main_xpath) {
                var temp_m = main_xpath[indx];
                var temp_p = p_xpath[indx];
                if (temp_m.replace(/ /g, '') == temp_p.replace(/ /g, '')) {
                    continue;
                } else if (temp_m.indexOf('[') == -1) {
                    continue;
                } else if (temp_m.substr(0,temp_m.indexOf('[')).replace(/ /g, '') != temp_p.substr(0,temp_p.indexOf('[')).replace(/ /g, '')) {
                    break;
                } else {
                    temp_m = temp_m.substr(0, temp_m.indexOf('['));
                    main_xpath[indx] = temp_m;
                }
            }
        }

        for (var i in field.negatives) {
            var n_xpath = field.negatives[i].xpath.split('/');

            if (main_xpath.length != n_xpath.length) {
                continue;
            }

            for (var indx in n_xpath) {
                var temp_n = n_xpath[indx];

                if (main_xpath[indx].replace(/ /g, '') == temp_n.replace(/ /g, '')) {
                    continue;
                }

                var indx_1 = temp_n.indexOf('[');
                var indx_2 = temp_n.indexOf(']');

                if (indx_1 != -1) {
                    var num = temp_n.substr(indx_1 + 1 , indx_2 - indx_1 -1);
                    if (!isNaN(num)) {
                        if (main_xpath[indx].indexOf('[') == -1) {
                            main_xpath[indx] = main_xpath[indx] + '[' + 'position() != '+ num + ' ]' ;
                        } else {
                            main_xpath[indx] = main_xpath[indx].replace(']', ' and position() != ' + num + ' ]');
                        }
                        break;
                    }
                }
            }
        }

        main_xpath = main_xpath.join('/');
        $scope.script_builder.scripts[field.scriptId].xpath = main_xpath;
        localStorage.script_builder = $scope.script_builder.toJSON();

        // Clean fields
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
                localStorage.script_builder = $scope.script_builder.toJSON();
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

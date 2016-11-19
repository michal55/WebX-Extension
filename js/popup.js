var app = angular.module('extension', []);
app.controller('main', function($scope) {
	$scope.init = function() {
		if(localStorage.logged_in == 'true') {
			$scope.loginPrompt(); //in case of corrupted cookies
			$scope.logged_in = true;
			loadCookies();
		}
		else {
			$scope.logged_in = false;
		}
	}

	function loadCookies() {
		$scope.projects = angular.fromJson(localStorage.projects);
		$scope.project = angular.fromJson(localStorage.project);
		$scope.scripts = angular.fromJson(localStorage.scripts);
		$scope.script = angular.fromJson(localStorage.script);
		$scope.schema = angular.fromJson(localStorage.schema);
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
		localStorage.schema = false;
		loadCookies();
	}

	$scope.getProjects = function() {
	    xhrWithAuth('GET', '/data/user/projects', false, function(status, response) {
	    	$scope.projects = angular.fromJson(response);
	    	$scope.project = {name: 'Select project', id: false, disabled: true};
	    	$scope.projects.unshift($scope.project);
	    	$scope.scripts = false;
	    	$scope.script = false;
	    	$scope.schema = false;

	    	localStorage.projects = angular.toJson($scope.projects);
	    	localStorage.project = angular.toJson($scope.project);
	    	localStorage.scripts = false;
			localStorage.script = false;
			localStorage.schema = false;

			$scope.$digest();
	    });
	}

	$scope.getScripts = function() {
		xhrWithAuth('GET', '/data/user/project/'+ $scope.project.id.toString() +'/scripts', false, function(status, response) {
	    	$scope.scripts = angular.fromJson(response);
	    	$scope.script = {name: 'Select script', id: false, disabled: true};
	    	$scope.scripts.unshift($scope.script);

	    	localStorage.scripts = angular.toJson($scope.scripts);
			localStorage.script = angular.toJson($scope.script);

	    	$scope.$digest();
	    });
	}

	$scope.getSchema = function() {
		xhrWithAuth('GET', '/data/user/project/'+ $scope.project.id.toString() +'/data_schemas', false, function(status, response) {
	    	$scope.schema = angular.fromJson(response);

			localStorage.schema = angular.toJson($scope.schema);

	    	$scope.$digest();
	    });
	}

	$scope.changeScript = function() {
		localStorage.schema = angular.toJson($scope.schema);
	}

	$scope.saveScript = function() {
		console.log(angular.toJson($scope.schema));
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
		$scope.getSchema();
	}

	$scope.selectScript = function() {
		localStorage.script = angular.toJson($scope.script);
	}
});
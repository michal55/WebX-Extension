var app = angular.module('extension', []);
app.controller('main', function($scope) {
	$scope.init = function() {
	    $scope.scripts = false;
	    $scope.logged_in = false;
	    $scope.getProjects();
	    $scope.loginPrompt();
	    $scope.targeting = false;
	}

    // Launch interactive dummy API call which will trigger login prompt if necessary
	$scope.loginPrompt = function() {
	    xhrWithAuth('GET', '', true, function(status, response) {
	        if (status != null) {
	            $scope.logged_in = true;
	            $scope.$digest();
	        }
	    });
	}

	$scope.getUserInfo = function() {
	    xhrWithAuth('GET', '/data/user', false, function(status, response) {
		    alert('Hello this is for you');
		});
	}

	$scope.getProjects = function() {
	    xhrWithAuth('GET', '/data/user/projects', false, function(status, response) {
	    	$scope.projects = angular.fromJson(response);
	    	$scope.project = {name: 'Select project', id: false, disabled: true};
	    	$scope.projects.unshift($scope.project);
	    	$scope.script = false;
	    	$scope.schema = false;
	    	$scope.$digest();
	    });
	}

	$scope.getScripts = function() {
		xhrWithAuth('GET', '/data/user/project/'+ $scope.project.id.toString() +'/scripts', false, function(status, response) {
	    	$scope.scripts = angular.fromJson(response);
	    	$scope.script = {name: 'Select script', id: false, disabled: true};
	    	$scope.scripts.unshift($scope.script);
	    	$scope.$digest();
	    });
	}

	$scope.getSchema = function() {
		xhrWithAuth('GET', '/data/user/project/'+ $scope.project.id.toString() +'/data_schemas', false, function(status, response) {
	    	$scope.schema = angular.fromJson(response);
	    	$scope.$digest();
	    });
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
});
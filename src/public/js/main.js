/**
 * Created by harry on 15/8/12.
 */
var dataTableApp = angular.module('dataTableApp', []);
dataTableApp.controller('DataTableController', ['$scope', '$http', DataTableController]);
function DataTableController($scope, $http) {
	$scope.pageSizes = [5,10,20,30,50,100];
	$scope.reverse = false;
	$scope.pageSize = 20;
	$scope.pages = [];
	$scope.currentPage = 0;
	$scope.query = "";

	// init the filtered items
	$scope.list = function () {
		$scope.modelConf.route.list($scope, $http, function (data) {
			$scope.items = data.result.list;
			$scope.totalCount = data.result.count;
			$scope.getPages();
		});
	};
	$scope.save = function () {
		$scope.modelConf.route.addOrUpdate($scope, $http, $scope.editModel, function (result) {
			if(result && result.err){
				$scope.error = result.err;
			}else{
				$('#myModal').modal('hide');
				$scope.list();
			}
		});
	}
	$scope.remove = function () {
		$scope.modelConf.route.remove($scope, $http, $scope.removeModel, function (result) {
			if(result && result.err){
				$scope.errorRemove = result.err;
			}else{
				$('#myModalConfirm').modal('hide');
				$scope.list();
			}
		});
	}
	$scope.getPages = function () {
		var page = $scope.currentPage || 0;
		var offsetPage = 2;
		var minPage = Math.max(page - offsetPage, 0);
		var result = [];
		for(var i=minPage;i< offsetPage * 2 + 1 + minPage;i++){
			if((i) * $scope.pageSize >= $scope.totalCount) break;
			result.push(i);
		}
		$scope.pages = result;
	}


	$scope.prevPage = function () {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
			$scope.list();
		}
	};

	$scope.nextPage = function () {
		if ($scope.currentPage < (($scope.totalCount / $scope.pageSize) - 1)) {
			$scope.currentPage++;
			$scope.list();
		}
	};

	$scope.setPage = function (page) {
		$scope.currentPage = page;
		$scope.list();
	};
	$scope.sortBy = function (newSortingOrder) {
		if ($scope.sortingOrder == newSortingOrder)
			$scope.reverse = !$scope.reverse;

		$scope.sortingOrder = newSortingOrder;
		$scope.list();
	}
	$scope.addDialog = function () {
		$('#myModal').modal('show');
		$scope.editModel = {};
		$('.datepicker').datepicker();
	}
	$scope.updateDialog = function (model) {
		$('#myModal').modal('show');
		$scope.fixItem(model)
		$scope.editModel = model;
		$('.datepicker').datepicker();
	}
	$scope.removeConfirm = function (model) {
		$('#myModalConfirm').modal('show');
		$scope.removeModel = model;
	}
	$scope.getEditType = function (field) {
		if(field.type == Date) return "date";
		if(field.type == Boolean) return "bool";
		if(field.editType == "image") return "image";
		if(field.editType instanceof Array) return "list";
		if(!field.editType || field.editType == "text") return "text";
		return field.editType;
	}
	$scope.fixItem = function (item) {
		if($scope.modelConf.fix){
			$scope.modelConf.fix(item);
		}
	}
	$scope.crud = function (flag) {
		return $scope.modelConf &&
			(!$scope.modelConf.crud || ($scope.modelConf.crud && $scope.modelConf.crud.indexOf(flag) > -1));
	}

	var modelConf = ModelConf();
	modelConf.route = modelConf.route || {};
	extendRoutes(modelConf);
	$scope.modelConf = modelConf;
	if(modelConf.scopeExtend){
		$.extend($scope, modelConf.scopeExtend($scope, $http));
	}
	$scope.list();

};
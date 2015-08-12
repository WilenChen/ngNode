var extendRoutes = function (model) {
	var name = model.name;
	$.extend(model.route, {
		getBaseUrl : function () {
			return '/'+ name.toLowerCase() +'/api/';
		},
		list : function ($scope, $http, call) {
			var url = this.getBaseUrl() + 'list?q';
			if($scope.query){
				url += "&key=" + $scope.query;
			}
			if($scope.sortingOrder){
				var sortField = $scope.sortingOrder;
				url += "&sort=" + sortField + "&desc=" + ($scope.reverse ? -1 : 1);
			}
			url += "&page=" + $scope.currentPage + "&pagesize=" + $scope.pageSize;
			$http.get(url).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call(data);
			});
		},
		addOrUpdate : function($scope, $http, item, call){
			$http.post(this.getBaseUrl() + (item._id ? "update" : "create"), item).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call(data);
			});
		},
		remove : function($scope, $http, item, call){
			$http.get(this.getBaseUrl() + "remove?id=" + item._id).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call(data);
			});
		}
	})
}

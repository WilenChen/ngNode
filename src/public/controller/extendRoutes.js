var extendRoutes = function (model) {
	$.extend(model, {
		getBaseUrl : function () {
			return '/'+ this.name.toLowerCase() +'/api/';
		},
		list : function ($scope, $http, call) {
			var url = this.getBaseUrl() + 'list?q';
			if($scope.query){
				url += "&key=" + $scope.query;
			}
			if($scope.sortingOrder){
				url += "&sort=" + $scope.sortingOrder + "&desc=" + ($scope.reverse ? -1 : 1);
			}
			url += "&page=" + $scope.currentPage + "&pagesize=" + $scope.itemsPerPage;
			$http.get(url).success(function (data) {
				call(data);
			}).error(function (data, status) {
				alert('get data error!');
			});
		},
		add : function($scope, $http, item, call){
			$http.post(this.getBaseUrl() + (item._id ? "update" : "create"), item).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		},
		remove : function($scope, $http, item, call){
			$http.get(this.getBaseUrl() + "remove?id=" + item._id).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		}
	})
}

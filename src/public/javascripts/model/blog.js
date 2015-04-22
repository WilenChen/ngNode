/**
 * Created by harry on 15/4/21.
 */
define(function () {
	return {
		schema: [
			{
				name : "title",
				type : String,
				sortable : true,
				text : "Title"
			},
			{
				type : String,
				sortable : true,
				text : "Author",
				name : "author"
			},
			{
				type : String,
				editType : "textarea",
				render : function (data) {
					return data.length > 40 ? data.substring(0, 40) + ".." : data;
				},
				text : "Body",
				name : "body"
			},
			{
				type: Date,
				sortable: true,
				render : function (data) {
					return data && data.split("T")[0];
				},
				text : "Date",
				name : "date"
			},
			{
				name : "category",
				text : "Category",
				type : ["Mongod", "Express", "Angularjs", "Node"]
			},
			{
				name : "recommend",
				text : "Recommend",
				type : Boolean,
				render : function (data) {
					return "";
				}
			}
		],
		fix : function (data) {
			if(data && data.date){
				data.date = data.date.split("T")[0];
			}
		},
		list : function ($scope, $http, call) {
			var url = '/blog/api/list?q';
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
		add : function($scope, $http, blog, call){
			var that = this;
			$http.post("/blog/api/" + (blog._id ? "update" : "create"), blog).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		},
		remove : function($scope, $http, blog, call){
			var that = this;
			$http.get("/blog/api/remove?id=" + blog._id).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		}
	}
});

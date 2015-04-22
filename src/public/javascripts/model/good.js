/**
 * Created by harry on 15/4/21.
 */
define(function () {
	return {
		schema: [
			{
				name : "name",
				type : String,
				sortable : true,
				text : "名称"
			},
			{
				type : Number,
				sortable : true,
				text : "价格",
				name : "price"
			},
			{
				type: Date,
				sortable: true,
				render : function (data) {
					return data && data.split("T")[0];
				},
				text : "日期",
				name : "date"
			},
			{
				name : "recommend",
				text : "是否推荐",
				type : Boolean,
				render : function (data) {
					return "";
				}
			}
		],
		list : function ($scope, $http, call) {
			var url = '/good/api/list?q';

			$http.get(url).success(function (data) {
				call(data);
			}).error(function (data, status) {
				alert('get data error!');
			});
		},
		add : function($scope, $http, good, call){
			var that = this;
			$http.post("/good/api/add", good).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		},
		remove : function($scope, $http, good, call){
			var that = this;
			$http.get("/good/api/remove?id=" + good._id).success(function (data) {
				call(data);
			}).error(function (data, status) {
				call('get data error!');
			});
		}
	}
});

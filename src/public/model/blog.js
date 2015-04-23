/**
 * Created by harry on 15/4/21.
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(function () {
	return {
		name: "Blog",
		server: {
			schema: {
				title: String,
				author: String,
				body: String,
				date: {type: Date, default: Date.now},
				category: String,
				recommend: Boolean
			},
			defSortField: "title",
			queryFields: ["title", "author"],
			defaultPageSize: 15,
			initData: function () {
				var result = [];
				for (var i = 0; i < 100; i++) {
					result.push({
						title: "title" + i,
						author: "author" + i,
						body: "body body body body body body body body body body body body body body body body body body body body body body ",
						date: new Date(new Date().valueOf() + (i * 1000 * 3600 * 24)),
						category: ["Mongod", "Express", "Angularjs", "Node"][Math.floor(Math.random() * 4)],
						recommend: false
					});
				}
				return result;
			}
		},
		client: {
			schema: [
				{
					name: "title",
					type: String,
					sortable: true,
					text: "Title"
				},
				{
					type: String,
					sortable: true,
					text: "Author",
					name: "author"
				},
				{
					type: String,
					editType: "textarea",
					render: function (data) {
						return data.length > 40 ? data.substring(0, 40) + ".." : data;
					},
					text: "Body",
					name: "body"
				},
				{
					type: Date,
					sortable: true,
					render: function (data) {
						return data && data.split("T")[0];
					},
					text: "Date",
					name: "date"
				},
				{
					name: "category",
					text: "Category",
					type: ["Mongod", "Express", "Angularjs", "Node"]
				},
				{
					name: "recommend",
					text: "Recommend",
					type: Boolean,
					render: function (data) {
						return "";
					}
				}
			]
		}


	}
});

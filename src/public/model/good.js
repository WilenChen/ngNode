/**
 * Created by harry on 15/4/21.
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(function () {
	return {
		name: "Good",
		server: {
			schema: {
				name: String,
				price: Number,
				createDate: {type: Date, default: Date.now}
			},
			defSortField: "name",
			queryFields: ["name"],
			defaultPageSize: 5
		},
		client: {
			schema: [
				{
					name: "name",
					type: String,
					sortable: true,
					text: "Name"
				},
				{
					type: Number,
					sortable: true,
					text: "Price",
					name: "price"
				},
				{
					type: Date,
					text : "Create Date",
					name : "createDate",
					sortable : false
				}
			]
		}


	}
});

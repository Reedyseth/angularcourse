// Initialize Firebase
var config = {
	apiKey: "AIzaSyDgrg8MwRDdUIylykWBAQz-0twr_MO2lWE",
	authDomain: "project-8290100803277551841.firebaseapp.com",
	databaseURL: "https://project-8290100803277551841.firebaseio.com",
	storageBucket: "project-8290100803277551841.appspot.com",
};

var app = angular.module('itemsApp',['ngRoute', 'firebase']);

	app.service('fbRef', function(){
		firebase.initializeApp(config);
	});

	app.service('Items', function(){
	this.fetch = function(){
			return [{
					"sku"        : "001",
					"description": "Foo Bar 1"
				    }, {
					"sku"        : "002",
					"description": "Foo Bar 2"
				    }, {
					"sku"        : "003",
					"description": "Foo Bar 3"
				    }];
	}
});

app.config(function($routeProvider){
    $routeProvider
	.when('/', {
	    controller:'ItemListController as itemList',
	    templateUrl:'list.html',
	    resolve: {
	    	items: function(Items){
	    		return Items.fetch();
	    	}
	    }
	});
});
app.controller('ItemListController', function(items) {
    this.items = items;
});

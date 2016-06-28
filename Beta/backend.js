var app = angular.module('itemsApp',['ngRoute']);
app.config(function($routeProvider){
    $routeProvider
	.when('/', {
	    controller:'ItemListController as itemList',
	    templateUrl:'list.html'
	});
});
app.controller('ItemListController', function() {
    this.items = [{
	"sku": "001",
	"description": "Foo Bar 1"
    }, {
	"sku": "002",
	"description": "Foo Bar 2"
    }, {
	"sku": "003",
	"description": "Foo Bar 3"
    }];
});

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDgrg8MwRDdUIylykWBAQz-0twr_MO2lWE",
	authDomain: "project-8290100803277551841.firebaseapp.com",
	databaseURL: "https://project-8290100803277551841.firebaseio.com",
	storageBucket: "project-8290100803277551841.appspot.com",
};

var app = angular.module('itemsApp',['ngRoute', 'firebase']);

app.service('fbRef', function(){
	return firebase.initializeApp(config);
});

app.service('fbAuth', function($q, fbRef) {
	var auth;
	return function() {
		if (auth) return $q.when(auth);
	    var authObj = fbRef.auth();
	    if (authObj.currentUser) {
		return $q.when(auth = authObj.currentUser);
	    }
	    var deferred = $q.defer();
	    authObj.signInAnonymously().then(function(authData) {
		auth = authData;
		deferred.resolve(authData);
	    });
	    return deferred.promise;
	}
});

app.service('Items', function($q, fbRef, fbAuth){
	this.fetch = function(){
		fbAuth().then(function(auth){
			console.log(auth);
		});
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

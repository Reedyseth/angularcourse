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
	var self = this;
	this.fetch = function(){
		if (this.items) return $q.when(this.items);
		return fbAuth().then(function(auth) {
				var deferred = $q.defer();
				var ref = fbRef.database().ref('items');
				ref.on('value', function(snapshot) {
				    self.items = snapshot.val();
				    deferred.resolve(self.items);
				});

				//Remove projects list when no longer needed.
				//ref.onDisconnect().remove();
				return deferred.promise;
	    });
	}
});

app.config(function($routeProvider){
	resolveItems = {
		items: function(Items){
			return Items.fetch();
		}
	}
    $routeProvider
	.when('/', {
	    controller:'ItemListController as itemList',
	    templateUrl:'list.html',
	    resolve: resolveItems
	})
	.when('/new', {
		controller:'ItemNewController as currentItem',
	    templateUrl:'form.html',
	    resolve: resolveItems

	})
	.when('/edit/:itemId', {
		controller:'ItemEditController as currentItem',
	    templateUrl:'form.html',
	    resolve: resolveItems

	});
});

app.controller('ItemListController', function(items) {
    this.items = items;
});

app.controller('ItemNewController', function($location, fbRef) {
	var currentItem = this;
	currentItem.save = function() {
	    var newPostKey = fbRef.database().ref().child('items').push().key;
	    var updates = {};
	    updates['/items/' + newPostKey] = currentItem.item;
	    fbRef.database().ref().update(updates);
	    $location.path('/');
	};
});

app.controller('ItemEditController', function($location, $routeParams, items) {
	var currentItem = this;
	var itemId = $routeParams.itemId;

	currentItem.items = items;
	currentItem.item = currentItem.items[itemId];

	currentItem.save = function() {
            var adaNameRef = firebase.database().ref('items/' + itemId);
	    // Modify the 'first' and 'last' properties, but leave other data at
	    // adaNameRef unchanged.
	    adaNameRef.update(currentItem.item);
	    $location.path('/');
	};
});

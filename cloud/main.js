
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("LoadAllItems", function(request, response) {
	var query = new Parse.Query("BBS");

	query.descending("createdAt");

	query.find({
		success: function(results) {
			response.success(results);
		},

		error: function(error) {
			// error is an instance of Parse.Error.
			response.error("글목록 로딩 실패");
		}
	});
});

Parse.Cloud.define("LoadSpecificItems", function(request, response) {
	var query = new Parse.Query("BBS");

	if(request.params.parentOptVal === 'Title') {
		query.contains('Title', request.params.searchWord);
	}
	else {
		query.contains(request.params.parentOptVal, request.params.childOptVal);
	}

	query.descending("createdAt");
	
	request.params.childOptVal

	query.find({
		success: function(results) {
			response.success(results);
		},

		error: function(error) {
			// error is an instance of Parse.Error.
			response.error("글목록 로딩 실패");
		}
	});
});
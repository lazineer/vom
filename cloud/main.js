
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("LoadItems", function(request, response) {
	var query = new Parse.Query("BBS");

	if(request.params.parentOptVal === 'Title') {
		query.contains('Title', request.params.searchWord);
	}
	else if(request.params.parentOptVal !== null){
		query.contains(request.params.parentOptVal, request.params.childOptVal);
	}

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

Parse.Cloud.define("LoadComments", function(request, response) {
	var query = new Parse.Query("Comment");

	query.equalTo('ItemId', request.params.itemId);

	query.ascending("createdAt");

	query.find({
		success: function(results) {
			response.success(results);
		},
		error: function(error) {
			// error is an instance of Parse.Error.
			response.error("댓글 로딩 실패");
		}
	});
});

Parse.Cloud.afterSave("Comment", function(request) {
  query = new Parse.Query("BBS");
  query.get(request.object.get("pBBS").id, {
    success: function(post) {
      post.increment("NumComments");
      post.save();
    },
    error: function(error) {
      console.error("Got an error " + error.code + " : " + error.message);
    }
  });
});

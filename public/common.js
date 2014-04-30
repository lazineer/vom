function AddOption(optType, optID){
		//document.getElementById(optID).innerHTML = "";
		
		if(optType == 'Branch' || optType == 'PU'){
			var Item = Parse.Object.extend(optType);
			var query = new Parse.Query(Item);
			query.ascending("Name");

			query.find({
				success: function(results) {
					
					var num_total = results.length;
					var item;
					
					for (var i = 0; i < num_total; i++) { 
						item = results[i];
						$("#" + optID).append("<option>" + item.get("Name") + "</option>");
					}
				},
				error: function(error) {
					// error is an instance of Parse.Error.
				}
			});
		}
		else
			alert("옵션 타입은 'Branch' 또는 'PU'이어야 함");
	}

function UpdateItem(strID, strBranch, strPU, strTitle, strContent, bPublic) {
	var Item = Parse.Object.extend("BBS");
	var query = new Parse.Query(Item);

	query.get(strID, {
		success: function(item) {
			// The object was retrieved successfully.
			item.set("Branch", strBranch);
			item.set("PU", strPU);
			item.set("Title", strTitle);
			item.set("Content", strContent);
			item.set("Public", bPublic);

			item.save();
		},
		error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
			alert('Failed to query to get a item for update, with error code: ' + error.description);
		}
	});
}

function DeleteItem(strID) {
	var Item = Parse.Object.extend("BBS");
	var query = new Parse.Query(Item);

	query.get(strID, {
		success: function(item) {
			// The object was retrieved successfully.
			item.destroy({
				success: function(myObject) {
					// The object was deleted from the Parse Cloud.
				},
				error: function(myObject, error) {
					// The delete failed.
					// error is a Parse.Error with an error code and description.
					alert('Failed to delete a item, with error code: ' + error.description);
				}
			});
		},
		error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
			alert('Failed to query to get a itemfor delete, with error code: ' + error.description);
		}
	});
}
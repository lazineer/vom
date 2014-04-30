var num_start;
var num_end;
var num_total;

function getURLParameter(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function LoadAllItems(isDefault){
	
	//클라우드 코드 내에 선언을 하면 안 되네 ㅡㅡ;;
	var obj = {};
	var item;

	Parse.Cloud.run('LoadAllItems', {}, {			
		
		success: function(items) {

			num_total = items.length;

			
			if(isDefault)
				num_start = 0;
			else
				num_start = num_end;

			num_end = num_start + 10;
			
			for (var i = num_start; i < num_end; i++) { 
				item = items[i];
				obj.strId = item.id;
				obj.strBranch = item.get("Branch");
				obj.strPU = item.get("PU");
				obj.strTitle = item.get("Title");
				obj.strContent = item.get("Content");//사용 안 함
				obj.bPublic = item.get("Public");
				obj.date = item.createdAt;

				$('#div_list').append("<a href='read.html?id=" + obj.strId + "'>" + "<div style='width: 100%; border-bottom: 2px solid black; padding-top : 15px; padding-bottom: 15px'>"+
				"<div style='float: left; margin-left: 10px; background-color: #808080; width: 60px; height: 20px; color: white; font-weight: bolder; text-align: center; padding-top: 5px; border-radius: 5px; font-size: 13px'>"+obj.strBranch+"</div>"
									+"<div style='float: left; margin-left: 30px; height: 30px; font-weight: bolder;'>" + obj.strTitle + "</div>"
									+"<br><br><div style='float: left;  margin-left: 10px; margin-top: -10px; width: 60px; height: 30px; color: black; font-weight: bolder; text-align: center; font-size: 13px'>" + obj.strPU + "</div>"
									+"<div style='float: right; margin-top: -10px; height: 30px; font-weight: bolder; font-size: 13px'>" +obj.date.getFullYear() + '-' + (obj.date.getMonth() + 1) + '-' + obj.date.getDate() + "&nbsp&nbsp" + "</div>"
				+"</div>" + "</a>");
			}

			if(isDefault) {
				$('#div_list').append("<div class='next'><a href='page.html'>next</a></div>");
				$('#div_list').jscroll();
			}
			else {
				$("#div_list2").parent().append("<div class='next'><a href='page.html'>next</a></div>");
				$("#div_list2").parent().jscroll();
				$("#div_list2").remove();
			}
		
		},
		error: function(error) {
			alert(error);
		}
	});	
}

function LoadSpecificItems(isDefault, parentOptVal, childOptVal, searchWord){
	
	//클라우드 코드 내에 선언을 하면 안 되네 ㅡㅡ;;
	var obj = {};
	var item;

	Parse.Cloud.run('LoadSpecificItems', {parentOptVal:parentOptVal, childOptVal:childOptVal, searchWord:searchWord}, {			
		
		success: function(items) {

			num_total = items.length;

			
			if(isDefault)
				num_start = 0;
			else
				num_start = num_end;

			num_end = num_start + 10;
			
			for (var i = num_start; i < num_end; i++) { 
				item = items[i];
				obj.strId = item.id;
				obj.strBranch = item.get("Branch");
				obj.strPU = item.get("PU");
				obj.strTitle = item.get("Title");
				obj.strContent = item.get("Content");//사용 안 함
				obj.bPublic = item.get("Public");
				obj.date = item.createdAt;

				$('#div_list').append("<a href='read.html?id=" + obj.strId + "'>" + "<div style='width: 100%; border-bottom: 2px solid black; padding-top : 15px; padding-bottom: 15px'>"+
				"<div style='float: left; margin-left: 10px; background-color: #808080; width: 60px; height: 20px; color: white; font-weight: bolder; text-align: center; padding-top: 5px; border-radius: 5px; font-size: 13px'>"+obj.strBranch+"</div>"
									+"<div style='float: left; margin-left: 30px; height: 30px; font-weight: bolder;'>" + obj.strTitle + "</div>"
									+"<br><br><div style='float: left;  margin-left: 10px; margin-top: -10px; width: 60px; height: 30px; color: black; font-weight: bolder; text-align: center; font-size: 13px'>" + obj.strPU + "</div>"
									+"<div style='float: right; margin-top: -10px; height: 30px; font-weight: bolder; font-size: 13px'>" +obj.date.getFullYear() + '-' + (obj.date.getMonth() + 1) + '-' + obj.date.getDate() + "&nbsp&nbsp" + "</div>"
				+"</div>" + "</a>");
			}

			if(isDefault) {
				//$('#div_list').append("<div class='next'><a href='page.html'>next</a></div>");
				//$('#div_list').jscroll();
			}
			else {
				$("#div_list2").parent().append("<div class='next'><a href='page.html'>next</a></div>");
				$("#div_list2").parent().jscroll();
				$("#div_list2").remove();
			}
		
		},
		error: function(error) {
			alert(error);
		}
	});	
}

function nextPage(){
	location = "page.html?s="+num_start+"&e="+num_end;
	//http://192.168.137.1:8020/vom_ing/public/index.html
}

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
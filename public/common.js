//paging을 위한 변수
var num_start;
var num_end;
var num_total;

//검색 시 넘겨받은 키워드들
var parentOptVal = getURLParameter("parentOptVal");
var childOptVal = getURLParameter("childOptVal");
var searchWord = getURLParameter("searchWord");

Parse.initialize("VlzoLnwwdwKUwvKFUPEKSadvZlL6SeVmPuRDy8ac", "fxEr0NEeRaD6rfs80NEO21t6efQm3FwHwgwaQPuH");

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

function LoadAllItems(isDefault){
	LoadSpecificItems(isDefault, null, null, null)
}

function LoadSpecificItems(isDefault, parentOptVal, childOptVal, searchWord){
	
	//클라우드 코드 내에 선언을 하면 안 되네 ㅡㅡ;;
	var obj = {};
	var item;
	var strNumComments = "";

	Parse.Cloud.run('LoadItems', {parentOptVal:parentOptVal, childOptVal:childOptVal, searchWord:searchWord}, {			
		
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
				obj.numComments = item.get("NumComments");
				obj.date = item.createdAt;

				if(item.get("NumComments") > 0) {
					strNumComments = "<div style='color: red; float: right; margin-right: 30px; height: 30px; font-weight: bolder;'>+" + obj.numComments + "</div>";
				}

				$('#div_list').append("<a href='read.html?id=" + obj.strId + "'>"
									+ "<div style='width: 100%; border-bottom: 2px solid black; padding-top : 15px; padding-bottom: 15px'>"
										+"<div style='float: left; margin-left: 10px; background-color: #808080; width: 60px; height: 20px; color: white; font-weight: bolder; text-align: center; padding-top: 5px; border-radius: 5px; font-size: 13px'>"+obj.strBranch+"</div>"
										+"<div style='float: left; margin-left: 30px; height: 30px; font-weight: bolder;'>" + obj.strTitle + "</div>"
										+ strNumComments
										+"<br><br><div style='float: left;  margin-left: 10px; margin-top: -10px; width: 60px; height: 30px; color: black; font-weight: bolder; text-align: center; font-size: 13px'>" + obj.strPU + "</div>"
										+"<div style='float: right; margin-top: -10px; height: 30px; font-weight: bolder; font-size: 13px'>" +obj.date.getFullYear() + '-' + (obj.date.getMonth() + 1) + '-' + obj.date.getDate() + "&nbsp&nbsp" + "</div>"
									+"</div>"
									+"</a>");
				strNumComments = "";
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

function LoadComments(strId){
	
	//클라우드 코드 내에 선언을 하면 안 되네 ㅡㅡ;;
	var obj = {};
	var item;

	Parse.Cloud.run('LoadComments', {itemId:strId}, {			
		
		success: function(items) {

			for (var i = 0; i < items.length; i++) { 
				item = items[i];
				obj.strId = item.id;
				obj.strContent = item.get("Content");//사용 안 함
				obj.date = item.createdAt;

				$('#comment_list').append("<div>" + obj.strContent + "</div><hr style='width: 93%'>");
			}
		},
		error: function(error) {
			alert(error);
		}
	});	
}

function nextPage(){
	location = "page.html?s="+num_start+"&e="+num_end;

	if(parentOptVal !== null)
		location += "&parentOptVal=" + src_parentOptVal + "&childOptVal=" + src_childOptVal +"&searchWord=" + src_searchWord;

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
					alert(optType + " 옵션 추가 실패");
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
//UpdateItem("x9lbF8Uuvp", "분당점", "선물", "건의사항", "자율출근제를 도입합시다!", true);
//DeleteItem("x9lbF8Uuvp");
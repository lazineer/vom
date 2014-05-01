//var mainDiv_pos;
//var device_width;

if(parentOptVal === null) //검색을 안 함
	LoadAllItems(true);
else //검색 시
	LoadSpecificItems(true, parentOptVal, childOptVal, searchWord);

//첫 번째 옵션을 선택했을 때, 두 번째 옵션을 로딩
function chgOpt2(){
	var opt1;
	opt1 = select_srcOption1.options[select_srcOption1.selectedIndex].value;
	document.getElementById("select_srcOption2").innerHTML = "";

	if(opt1 === 'Title')
		document.getElementById("input_srcWord").disabled = false;
	else {
		document.getElementById("input_srcWord").disabled = true;
		AddOption(opt1, 'select_srcOption2');
	}
}

// 검색 버튼 눌렀을 때 호출
function doSearch(){
	var src_parentOptVal;	// 제목, 지점, 부서
	var src_childOptVal = "";	// 지점 혹은 부서 선택 옵션 변수
	var src_searchWord;	// 검색어 변수
	
	src_parentOptVal = select_srcOption1.options[select_srcOption1.selectedIndex].value;
	src_searchWord = document.getElementById("input_srcWord").value;

	if(src_parentOptVal !== "Title"){
		src_childOptVal = select_srcOption2.options[select_srcOption2.selectedIndex].innerHTML;
	}
	else if(src_parentOptVal === "Title" && src_searchWord === "") {
		alert('검색어를 입력하세요!');
		return;
	}
	
	location.href="index.html?parentOptVal=" + src_parentOptVal + "&childOptVal=" + src_childOptVal +"&searchWord=" + src_searchWord;
}
/*
$(function(){
	mainDiv_pos = $('#div_upper').height();
	device_width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	
	$('#div_upper').css("width",device_width+"px");
	$('#div_list').css("top",mainDiv_pos+25+"px");

	//alert(mainDiv_pos + "/" + device_width);
	//alert(window.innerWidth + "/" + screen.width);
});
*/
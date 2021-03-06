function setTaskAdd(){
	$('#addSsubmit').unbind('click');
	$('#addSsubmit').on('click', function(){
		var paramId;
		var flag = true;
		
		var dt = $('#addSdate').val();
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();
		
		if(dt=="") {
			alertWarning("일정을 추가할 날짜를 선택하세요."); flag = false;
			$('.addSday').css("background-color","#F17F7F");
			setTimeout(function() {
		        $(".addSday").css("background-color","#FFF");
		}, 2000);
			}
		else if(st.length<4 || ed.length<4) {alertWarning("시간을 빠짐없이 입력하세요."); flag = false;}
		else if(st<0900 || ed>2400) {alertWarning("09시부터 24시 사이에만 생성할 수 있습니다."); flag = false;}
		else if(st>=ed) {alertWarning("종료 시간이 시작 시간보다 빠릅니다."); flag = false;}
		else if(cont=="") {alertWarning("일정의 내용을 입력하세요."); flag = false;}
		
		if(flag){
		
			var formData = "date=" + dt + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont;
	
			if($('#topTitle').attr('value')==0)	{	
				paramId = $('#userId').val();
				formData += "&user=" + paramId;
			}
			
			else {		
				paramId = $(".glName").filter(function(){ return $(this).text() == $('#topTitle').text() }).parent().attr('id');
				formData += "&group=" + paramId;
			}
			
			if($('#repeatValue').val()!=0){
				var edv = $('#repeatEday').val();
				var edt = edv.slice(0,4)+edv.slice(5,7)+edv.slice(8,10)
				formData += "&repeatValue=" + $('#repeatValue').val() + "&repeatEday=" + edt;
			}
			
			$.ajax({
				type: "POST",
				url: '/createTask',
				data: formData,
				async : false,
				complete: function(){
					UpdateDate(paramId);
				}
			});
		}
		$('.schdTimes').val(''); $('#addScont').val('');
		$('#addSrepeat').show();
		$('#addSrepeatCancel').hide();
		$('#repeatValue').val(0);
	});
}

function setTaskDel(id){	//change to individual
	$('.taskDel').unbind('click');
	$('.taskDel').on('click', function(){
		if($(this).siblings('.taskRv').val()==0){
			taskDel($(this).parent().attr('id'),id,"");
		}
		
		else{
			$('#deleteModal').modal();
			setTaskDelRepeat($(this).parent().attr('id'),id);
		}
	});
}

function setTaskDelRepeat(DOMId, OwnerId){
	$('#deleteAll').unbind('click');
	$('#deleteAll').on('click', function(){
		var repeatV = "&repId=" + $('#'+DOMId).find('.taskRId').val() + "&repeatSday=" + $('#'+DOMId).find('.taskRst').val() + 
		"&repeatEday=" + $('#'+DOMId).find('.taskRst').val() + "&repeatValue=" + $('#'+DOMId).find('.taskRv').val();
		taskDel(DOMId, OwnerId, repeatV);
	});
	
	$('#deleteOne').unbind('click');
	$('#deleteOne').on('click', function(){
		taskDel(DOMId, OwnerId, "");
	});
}

function taskDel(DOMId, OwnerId, repeatV){
	var ajaxData = "contents=" + $('#'+DOMId).find('.taskCon').text() + "&date=" + DOMId.slice(0,8) + "&startTime=" + DOMId.slice(8,12) + repeatV;
	
	if($('#topTitle').attr('value')==0){
		ajaxData += "&user=" + OwnerId;
	}
	else{
		ajaxData += "&group=" + OwnerId;
	}
	$.ajax({
		type: "POST",
		url: "/removeTask",
		data: ajaxData,		
		complete: function(){
			//$('#'+DOMId).remove();		//Is it necessary?
				UpdateDate(OwnerId);
		}
	});
}

function setRepeat(){
	var ret;
	var dwFlag=0;
	$('#addSrepeat').unbind('click');
	$('#addSrepeat').on('click',function(){			//반복하기 버튼
		ret = 0;
		$('#repeatIsDay').unbind('click');
		$('#repeatIsDay').on('click', function(){
			dwFlag = 0;
			$('#repeatDayNum').val('');
			});
		
		$('#repeatIsWeek').unbind('click');
		$('#repeatIsWeek').on('click', function(){
			dwFlag = 1;
			$('#repeatWeekNum').val('');
			});
		
	});
	
	$('#repeatSubmit').unbind('click');
	$('#repeatSubmit').on('click',function(){		//확인 버튼
		if(dwFlag==0)
			ret+=Number($('#repeatDayNum').val());
		else
			ret+=(Number($('#repeatWeekNum').val())*7);
		$('#repeatValue').val(ret);
		$('#repeatEday').val($('#datepicker').val());
		$('#repeatDayNum').val('');
		$('#repeatWeekNum').val('');
		$('#addSrepeat').hide();
		$('#addSrepeatCancel').show();
	});
	
	$('#repeatCancel').unbind('click');
	$('#repeatCancel').on('click', function(){		//취소 버튼
		$('#repeatValue').val(0);
		$('#repeatDayNum').val('');
		$('#repeatWeekNum').val('');
	});
	
	$('#addSrepeatCancel').unbind('click');
	$('#addSrepeatCancel').on('click', function(){	//반복 취소 버튼
		$('#repeatValue').val(0);
		$('#addSrepeat').show();
		$('#addSrepeatCancel').hide();
	});
}
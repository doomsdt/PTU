function setTaskAdd(){
	$('#addSsubmit').unbind('click');
	$('#addSsubmit').on('click', function(){
		var paramId;
		
		var dt = $('#addSdate').val();
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();
		
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
		$('.schdTimes').val(''); $('#addScont').val('');
		$('#addSrepeat').show();
		$('#addSrepeatCancel').hide();
	});
}

function setTaskDel(id){	//change to individual
	$('.taskDel').unbind('click');
	$('.taskDel').on('click', function(){
		if($(this).siblings('.taskRv').val()==0){
			ajaxData = "contents=" + $(this).parent().find('.taskCon').text() + "&date=" + $(this).parent().attr('id').slice(0,8) + "&startTime=" + $(this).parent().attr('id').slice(8,12);
	
			if($('#topTitle').attr('value')==0){
				ajaxData += "&user=" + id;
			}
			else{
				ajaxData += "&group=" + id;
			}
			$.ajax({
				type: "POST",
				url: "/removeTask",
				data: ajaxData
				
				,success: function(){
					$(this).parent().remove();
						UpdateDate(id);
				}
			});
		}
		
		else{
			$('#deleteModal').modal();
		}
	});
}

function setTaskDelRepeat(){
	
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
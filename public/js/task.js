function setTaskAdd(){
	$('#addSsubmit').unbind('click');
	$('#addSsubmit').on('click', function(){
		var paramId;
		
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();
		var d = new Date();
		var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + "&tmp=" + d;

		if($('#topTitle').attr('value')==0)	{	
			paramId = $('#userId').val();
			formData += "&user=" + paramId;
		}
		
		else {		
			paramId = $(".glName").filter(function(){ return $(this).text() == $('#topTitle').text() }).parent().attr('id');
			formData += "&group=" + paramId;
		}
		
		
		
		if($('#repeatValue').val()!=0)
			formData += "&repeatValue=" + $('#repeatValue').val();
		
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
	});
}

function setTaskDel(id){	//change to individual
	$('.taskDel').unbind('click');
	$('.taskDel').on('click', function(){
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
		
	});
}

function setRepeat(){
	var ret = 0;
	$('#addSrepeat').unbind('click');
	$('#addSrepeat').on('click',function(){
		$('#repeatIsDay').unbind('click');
		$('#repeatIsDay').on('click', function(){
			ret=0;
			$('#repeatDayNum').val(0);
			});
		
		$('#repeatIsWeek').unbind('click');
		$('#repeatIsWeek').on('click', function(){
			ret=10;
			$('#repeatWeekNum').val(0);
			});
	});
	
	$('#repeatSubmit').unbind('click');
	$('#repeatSubmit').on('click',function(){
		if(ret==0)
			ret+=Number($('#repeatDayNum').val());
		else
			ret+=Number($('#repeatWeekNum').val());
		$('#repeatValue').val(ret);
		$('#addSrepeat').hide();
		$('#addSrepeatCancel').show();
	});
	
	$('#repeatCancel').unbind('click');
	$('#repeatCancel').on('click', function(){
		$('#repeatValue').val(0);
	});
	
	$('#addSrepeatCancel').unbind('click');
	$('#addSrepeatCancel').on('click', function(){
		$('#repeatValue').val(0);
		$('#addSrepeat').show();
		$('#addSrepeatCancel').hide();
	});
}
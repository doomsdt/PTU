function setTaskAdd(){
	$('#addSsubmit').on('click', function(){
		var paramId;
		
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();

		if($('#topTitle').attr('value')==0)	{	
			paramId = $('#userId').val();
			var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + 
							"&user=" + paramId;
		}
		
		else {		
			paramId = $(".glName").filter(function(){ return $(this).text() == $('#topTitle').text() }).parent().attr('id');
			var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + 
							"&group=" + paramId;	
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
	});
}

function setTaskDel(id){
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
				if($('#topTitle').attr('value')==0)
					UpdateDate(id);
				else
					UpdateDate(id);
			}
		});
		
	});
}
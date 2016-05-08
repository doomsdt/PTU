
function initCal(y,m,start_day){
	var today = new Date().getDay();
	var end_day = new Date();
	end_day.setDate(start_day.getDate() + (6-today));		//end datetime of this week

	$('#calTime').empty();

	for(var i=0;i<15;i++){
		$('#calTime').append("<div class = 'times box_center'>" + (i+9) +"</div>");
	}

	for(var i=0;i<7;i++){
		$('#addS'+i).val(y + "" + get_number_str(m) + "" + get_number_str(start_day.getDate()+i));
	}

	$('.addSday').unbind('click');
	$('.addSday').bind('click', function(){
		var date = new Date($(this).attr('value').slice(0,4) + '-' + $(this).attr('value').slice(4,6) + '-' + $(this).attr('value').slice(6,8));
		$('#schdDate').text(date.getMonth()+1 + ". " + date.getDate());
		$('#addSdate').val(date.getFullYear()+""+get_number_str(date.getMonth()+1)+""+get_number_str(date.getDate()));
	});

}

function initGroups(){
	$.ajax({
		type: 'POST',
		url: '/listGroup',
		success: function(data){
			var _tmp = JSON.parse(data);
			$('#groupList div').remove();
			
			for(var key in _tmp){
				$('#groupList').append("<div class='glElement' id="+ _tmp[key]._id +"><p class='glLeader'>"+_tmp[key].leader
						+"</p><p class='glName'>"+_tmp[key].name+"</p></div>");
			}
		}
	});
}

function setTitle(year,month,startDay){
	var endDay = new Date(startDay.getFullYear(),startDay.getMonth(),startDay.getDate()+6);

	$('.prevWeek').text('<');
	$('.curWeek').text(startDay.getFullYear() + '.' + get_number_str(startDay.getMonth()+1)
		+ '.' + get_number_str(startDay.getDate()) + ' ~ ' + endDay.getFullYear() + '.' + get_number_str(endDay.getMonth()+1)
	+ '.' + get_number_str(endDay.getDate()));

	$('.nextWeek').text('>');

	$('.prevWeek').unbind('click');
	$('.nextWeek').unbind('click');

	$('.prevWeek').bind('click',function(){
		startDay.setDate(startDay.getDate()-7);
		resetCalendar(startDay.getFullYear(),startDay.getMonth()+1,startDay);
	});

	$('.nextWeek').bind('click',function(){
		startDay.setDate(startDay.getDate()+7);
		resetCalendar(startDay.getFullYear(),startDay.getMonth()+1,startDay);
	})
}

function resetCalendar(year,month,startDay){
	setTitle(year,month,startDay);
	initCal(year,month,startDay);
	initGroups();
	setEvent();
}

function setEvent(){
	UpdateDate();
	setGroupAdd();

	$('#addSsubmit').unbind('click');
	$('#addSsubmit').bind('click', function(){
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();

		var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + "&user=F" + $('#userId').attr('value');
		$.ajax({
			type: "POST",
			url: '/createTask',
			data: formData,
			success: function(){
				UpdateDate();
			}
		});
		$('.schdTimes').val(''); $('#addScont').val('');
	});


}

function UpdateDate(){

	$.ajax({
		type: "POST",
		url: '/list',
		data: "startDate=" + $('#addS0').val() + "&endDate=" + $('#addS6').val(),
		success: function(data) {
			var bef = 540;
			var befDate, curDate;
			var _tmp = JSON.parse(data);
			$('.calDayCol div').remove();

			for(var key in _tmp){
				curDate = _tmp[key].date;
				if(curDate != befDate) bef = 540;
				var st = Number(_tmp[key].startTime.slice(0,2))*60 + Number(_tmp[key].startTime.slice(2,4));
				var ed = Number(_tmp[key].endTime.slice(0,2))*60 + Number(_tmp[key].endTime.slice(2,4));
				var date = new Date(_tmp[key].date.slice(0,4) + '-' + _tmp[key].date.slice(4,6) + '-' + _tmp[key].date.slice(6,8));
				if(_tmp[key].date>=$('#addS0').val() && _tmp[key].date<=$('#addS6').val()){
					var t = $("<div class='task box_center' id=" + _tmp[key].date +'' + _tmp[key].startTime + "><input type='button' value='X' class='taskDel'>" + _tmp[key].contents + '</div>');
					$('#calMain_day'+date.getDay()).append(t);
					$(t).css("margin-top", st-bef+"px").css("height", ed-st-2+"px");
					bef = ed;
				}
				befDate = _tmp[key].date;
			}

			$('.taskDel').unbind('click');
			$('.taskDel').bind('click', function(){
				$.ajax({
					type: "POST",
					url: "/removeTask",
					data: "contents=" + $(this).parent().text() + "&date=" + $(this).parent().attr('id').slice(0,8) + "&startTime=" + $(this).parent().attr('id').slice(8,12),
					success: function(){
					}
				});
				$(this).parent().remove();
			});
		}
	});

}


function setGroupAdd(){
	$('#newGroupSubmit').unbind('click');
	$('#newGroupSubmit').bind('click',function(){
		console.log('clicked');
		$.ajax({
			type: 'POST',
			url: '/createGroup',
			data: "name=" + $('#newGroupName').val() + "&leader=" + $('#newGroupName').attr('name'),
			success: function(){
				console.log('group has created successfully');
			}
		});
	});
	
	$('#newMemberSubmit').unbind('click');
	$('#newMemberSubmit').bind('click',function(){
		console.log('clicked');
		$.ajax({
			type: 'POST',
			url: '/updateGroup',
			data: "name=" + $('#newGroupName').val() + "&member_id=" + $('#newMemberName').val(),
			success: function(){
				console.log("name=" + $('#newGroupName').val() + "&member_id=" + $('#newMemberName').val());
			}
		});
	});
}

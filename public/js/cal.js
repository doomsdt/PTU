var groupFlag = false;

function initCal(y,m,start_day){	//draw week calendar
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

function initGroups(){		//get GROUP LIST and show
	$.ajax({
		type: 'POST',
		url: '/listGroup',
		success: function(data){
			var _tmp = JSON.parse(data);
			$('#groupList div').remove();
			
			$('#groupList').append("<div class='glBox'><div class='glElement' id='glMine'><p class='glName'> 내 시간표 </p></div></div></br>");
			
			for(var key in _tmp){
				var leader;
				$.ajax({
					type:'POST',
					url: '/listMember',
					data: 'id=' + _tmp[key].leader,
					async: false,
					success: function(ret){
						leader = JSON.parse(ret)[0].name;
						
					}
				});
				$('#groupList').append("<div class='glBox'><div class='glElement' id="+ _tmp[key]._id +"><p class='glLeader'>"+leader
						+"</p><p class='glName'>"+_tmp[key].name+"</p><p><a class='divLink'></a></p></div><input type='button' value='+' class='glJoin'></div></br>");

			}
		
			$('.glElement').not('#glMine').on('click', function(err){
				$('#topTitle').text($(this).find('p.glName').text());
				$('#topTitle').attr('value',1);
				UpdateDate(null,$(this).attr('id'));
			});
			
			$('#glMine').on('click', function(err){
				$('#topTitle').text($(this).find('p.glName').text());
				$('#topTitle').attr('value',0);
				UpdateDate($("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id'),null);
			});

			$('.glJoin').on('click',function(){
				$.ajax({
					type: 'POST',
					url: '/updateGroup',
					data: "id=" + $(this).siblings(".glElement").attr('id') + "&member_id=" + $("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id'),
					success: function(){

					}
				});
			});
		}
	});
}

function setTitle(year,month,startDay){		//switch week
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

function resetCalendar(year,month,startDay){	//reset all
	setTitle(year,month,startDay);
	initCal(year,month,startDay);
	initGroups();
	setEvent();
}

function setEvent(){	//set NEW TASK event
	//UpdateDate();
	UpdateUser();
	setGroupAdd();

	$('#addSsubmit').unbind('click');
	$('#addSsubmit').bind('click', function(){
		var st = get_number_str($('#addSstH').val()) + "" + get_number_str($('#addSstM').val());
		var ed = get_number_str($('#addSedH').val()) + "" + get_number_str($('#addSedM').val());
		var cont = $('#addScont').val();

		if($('#topTitle').attr('value')==0)
			var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + 
							"&user=" + $("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id');
		else{
			var formData = "date=" + $('#addSdate').val() + "&startTime=" + st + "&endTime=" + ed + "&contents=" + cont + 
							"&group=" + $(".glName").filter(function(){ return $(this).text() == $('#topTitle').text() }).parent().attr('id');
					
		}
		$.ajax({
			type: "POST",
			url: '/createTask',
			data: formData,
			success: function(){
				//UpdateDate();
			}
		});
		$('.schdTimes').val(''); $('#addScont').val('');
	});

	// Temporal
	$('#tmpNewUserSubmit').on('click',function(){
		$.ajax({
			type : 'POST',
			url : '/createMember',
			data : 'name=' + $('#tmpNewUser').val(),
			success : function(){
				UpdateUser();
			}
		});
	});
	
	$('#tmpTmp').on('click',function(){
		$(this).val($("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id'));
	})

}

function UpdateDate(userId,groupId){		//get TASK LIST and show

	if(groupId){
		$.ajax({
			type: "POST",
			url: '/listGroupMembers',
			data: "groupId=" + groupId,
			success: function(ret){
				$.ajax({
					type: "POST",
					url: '/list',
					data: "startDate=" + $('#addS0').val() + "&endDate=" + $('#addS6').val() +"&members=" + 
					JSON.stringify(JSON.parse(ret)[0].members) + "&group=" + groupId,
					success: function(data){
						var bef = 540;
						var befDate, curDate;
						var _tmp = JSON.parse(data);
						$('.calDayCol div').remove();
			
						for(var i=0;i<_tmp.length;i++){
							var curTask = _tmp[i];
							if(curTask.user){
								for(var j=1;i+j<_tmp.length;j++){
									var nextTask = _tmp[i+j];
									if(nextTask.user){
										if(curTask.date == nextTask.date && curTask.endTime >= nextTask.startTime){
											curTask.endTime = nextTask.endTime;
											i++;
										}
									}
								}
							}
							curDate = curTask.date;
							if(curDate != befDate) bef = 540;
							var st = Number(curTask.startTime.slice(0,2))*60 + Number(curTask.startTime.slice(2,4));
							var ed = Number(curTask.endTime.slice(0,2))*60 + Number(curTask.endTime.slice(2,4));
							var date = new Date(curTask.date.slice(0,4) + '-' + curTask.date.slice(4,6) + '-' + curTask.date.slice(6,8));
							if(curTask.date>=$('#addS0').val() && curTask.date<=$('#addS6').val()){
								var t = $("<div class='task box_center' id=" + curTask.date +'' + curTask.startTime + 
										"></div>");
								
								if(curTask.group){
									$(t).text(curTask.contents);
									$(t).css("background-color","#CC3D3D");
								}
								
								$('#calMain_day'+date.getDay()).append(t);
								$(t).css("margin-top", st-bef+"px").css("height", ed-st-2+"px");
																				
								bef = ed;
							}
							befDate = _tmp[i].date;
						}
					}
				});
			}
		});
	}
	else{
		$.ajax({
			type: "POST",
			url: '/list',
			data: "startDate=" + $('#addS0').val() + "&endDate=" + $('#addS6').val() + "&userId=" + userId,
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
				
			}
		});		
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

function UpdateUser(){
	var _tmp;
	$.ajax({
		type : 'POST',
		url : '/listMember',
		success : function(data){
			_tmp = JSON.parse(data);
			for(var key in _tmp){
				$('#tmpUserName').append($('<option>', {
					value : _tmp[key].name,
					text : _tmp[key].name,
					id : _tmp[key]._id
				}));
			}
		}
	});
	
}

function setGroupAdd(){		//set NEW GROUP and MEMBER event
	$('#newGroupSubmit').unbind('click');
	$('#newGroupSubmit').bind('click',function(){

		$.ajax({
			type: 'POST',
			url: '/createGroup',
			data: "name=" + $('#newGroupName').val() + "&leader=" + $("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id'),
			success: function(){

			}
		});
	});

}

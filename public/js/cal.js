var groupFlag = false;

function initCal(y,m,start_day){	//draw week calendar

	$('#calTime').empty();

	for(var i=0;i<15;i++){
		$('#calTime').append("<div class = 'times box_center'><span>" + (i+9) +"</span></div>");
	}
	var dt = start_day;
	for(var i=0;i<7;i++){
		
		$('#day'+i).find('.yoilDate').text((dt.getMonth()+1) + '.' + dt.getDate() + ' ');
		$('#addS'+i).val(dt.getFullYear() + "" + get_number_str(dt.getMonth()+1) + "" + get_number_str(dt.getDate()));
		dt.setDate(dt.getDate()+1);
	}
	dt.setDate(dt.getDate()-7);

	$('.addSday').on('click', function(){
		var date = new Date($(this).attr('value').slice(0,4) + '-' + $(this).attr('value').slice(4,6) + '-' + $(this).attr('value').slice(6,8));
		$('#schdDate').text(date.getMonth()+1 + ". " + date.getDate());
		$('#addSdate').val(date.getFullYear()+""+get_number_str(date.getMonth()+1)+""+get_number_str(date.getDate()));
	});

}


function setTitle(year,month,startDay){		//switch week
	var endDay = new Date(startDay.getFullYear(),startDay.getMonth(),startDay.getDate()+6);

	$('#prevWeek').text('<');
	$('#curWeek').text(startDay.getFullYear() + '.' + get_number_str(startDay.getMonth()+1)
		+ '.' + get_number_str(startDay.getDate()) + ' ~ ' + endDay.getFullYear() + '.' + get_number_str(endDay.getMonth()+1)
	+ '.' + get_number_str(endDay.getDate()));

	$('#nextWeek').text('>');

	$('#prevWeek').unbind('click');
	$('#prevWeek').on('click',function(){
		startDay.setDate(startDay.getDate()-7);
		resetCalendar(startDay.getFullYear(),startDay.getMonth()+1,startDay);
	});

	$('#nextWeek').unbind('click');
	$('#nextWeek').on('click',function(){
		startDay.setDate(startDay.getDate()+7);
		resetCalendar(startDay.getFullYear(),startDay.getMonth()+1,startDay);
	});
}

function initCalendar(year,month,startDay){
	$('.alert').hide();
	$('#logoutButton').hide();
	$('#groupControl').hide();
	$('#addSrepeatCancel').hide();
	$(function(){
		$('#datepicker').datepicker();
		$('#datepicker').datepicker('option','dateFormat', 'yy-mm-dd');
	});
	setTitle(year,month,startDay);
	initCal(year,month,startDay);
	UpdateUser();
	var paramId = $('#userId').val();
	
	if($('#userId').val())
		UpdateDate(paramId);
	setEvent();
	
}

function resetCalendar(year,month,startDay){	//reset all
	setTitle(year,month,startDay);
	initCal(year,month,startDay);
	if($('#topTitle').attr('value')==0)
		var paramId = $('#userId').val();
	else
		var paramId = $(".glName").filter(function(){ return $(this).text() == $('#topTitle').text() }).parent().attr('id');
	
	UpdateDate(paramId);
	setEvent();
	
}

function setEvent(){	//set NEW TASK event
	setGroupFind();
	setGroupAdd();
	setTaskAdd();
	setRepeat();
	setLogout();

	// Temporal
	$('#tmpNewUserSubmit').on('click',function(){
		$.ajax({
			type : 'POST',
			url : '/createMember',
			data : 'name=' + $('#tmpNewUser').val(),		
			success : function(){
				UpdateUser(paramId);
			}
		});
	});
	
	$('#tmpUserName').change(function(){
		$('#userId').val($("#tmpUserName option[value="+$('#tmpUserName').val()+"]").attr('id'));
		$('#userName').val($("#tmpUserName option[value="+$('#tmpUserName').val()+"]").text());
		setUserInfo();
		
	});

}


function UpdateDate(paramId){		//get TASK LIST and show
	if($('#topTitle').attr('value')==1){
		$.ajax({
			type: "POST",
			url: '/listGroupMembers',
			data: "groupId=" + paramId,
			success: function(ret){
				var m = JSON.parse(ret)[0].members;
				m.push(JSON.parse(ret)[0].leader);
				$.ajax({
					type: "POST",
					url: "/listGroup",
					data: "members=" + JSON.stringify(m),
					success : function(retu){
						var _tmp = JSON.parse(retu);
						var groupArr = [];
						for(var key in _tmp)
							groupArr.push(_tmp[key]._id);
						
						$.ajax({
							type: "POST",
							url: '/list',
							data: "startDate=" + $('#addS0').val() + "&endDate=" + $('#addS6').val() +"&members=" + 
							JSON.stringify(m) + "&groups=" + JSON.stringify(groupArr),
							success: function(data){
								var bef = 540;
								var befDate, curDate;
								var _tmp = JSON.parse(data);
								$('.calDayCol div').remove();
					
								for(var i=0;i<_tmp.length;i++){
									var curTask = _tmp[i];
									if(curTask.group!=paramId){
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
												"><span class='taskCon'></span>"+ 
												"<input type='hidden' class='taskRst' value="+ curTask.repStartDate + ">" +
												"<input type='hidden' class='taskRed' value="+ curTask.repEndDate + ">" +
												"<input type='hidden' class='taskRv' value="+ curTask.repeat + ">" +
												"<input type='hidden' class='taskRId' value="+ curTask.rId + ">" +
												+"</div>");
										
										if(curTask.group==paramId){
											$(t).append("<a href='#' class='close taskDel' aria-label='close'>&times;</a>");
											$(t).find('.taskCon').text(curTask.contents);
											$(t).css("background-color","#CC3D3D");
										}
										
										$('#calMain_day'+date.getDay()).append(t);
										$(t).css("margin-top", st-bef+"px").css("height", ed-st-2+"px");
																						
										bef = ed;
									}
									befDate = _tmp[i].date;
								}
								setTaskDel(paramId);
							}
						
						});
					}
				});
				
			}
		});
	}
	else{		//중복 로직
		$.ajax({
			type: "POST",
			url: '/listMember',
			data: "id=" + paramId,
			success: function(ret){	
				$.ajax({
					type: "POST",
					url: '/list',
					data: "startDate=" + $('#addS0').val() + "&endDate=" + $('#addS6').val() + "&userId=" + paramId + "&groups=" + JSON.stringify(JSON.parse(ret)[0].groups),
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
								var t = $("<div class='task box_center' id=" + _tmp[key].date +'' + _tmp[key].startTime + 
										"><a href='#' class='close taskDel' aria-label='close'>&times;</a><span class='taskCon'>" + _tmp[key].contents + '</span>'+ 
										"<input type='hidden' class='taskRst' value="+ _tmp[key].repStartDate + ">" +
										"<input type='hidden' class='taskRed' value="+ _tmp[key].repEndDate + ">" +
										"<input type='hidden' class='taskRv' value="+ _tmp[key].repeat + ">" +
										"<input type='hidden' class='taskRId' value="+ _tmp[key].rId + ">" +
										+'</div>');
								
								if(_tmp[key].group){
									$(t).find('.taskDel').remove();
									$(t).css("background-color","#CC3D3D");
								}
								
								$('#calMain_day'+date.getDay()).append(t);
								$(t).css("margin-top", st-bef+"px").css("height", ed-st-2+"px");
								bef = ed;
							}
							befDate = _tmp[key].date;
						}
						setTaskDel(paramId);
					}
				});		
			}
		});
	}
	
	
}

function UpdateUser(){
	var _tmp;
	$.ajax({
		type : 'POST',
		url : '/listMember',
		success : function(data){
			$('#tmpUserName option').remove();
			_tmp = JSON.parse(data);
			for(var key in _tmp){
				$('#tmpUserName').append($('<option>', {
					value : _tmp[key].name.replace(/\s*/gi, ""),
					text : _tmp[key].name.replace(/\s*/gi, ""),
					id : _tmp[key].uid
				}));
			}
		}
	});
	
}


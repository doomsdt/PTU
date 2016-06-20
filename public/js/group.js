
function initGroups(gName){		//get GROUP LIST and show
	if(!$('#topTitle').text())
		$('#topTitle').attr('value',0);
	$.ajax({
		type: 'POST',
		data: 'groupName=' + gName,
		url: '/listGroup',
		success: function(data){
			var _tmp = JSON.parse(data);
			$('#groupControl').hide();
			$('#groupList').show();
			$('#groupList div').remove();
			$('#groupList br').remove();
			
			//$('#groupList').append("<div class='glBox'><div class='glElement btn btn-warning' id='glMine'><p class='glName'> 내 시간표 </p></div></div>");
			
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
				$('#groupList').append("<div class='glBox'><div class='btn btn-primary glElement' id="+ _tmp[key]._id +"><p class='glLeader'>"+leader
						+"</p><p class='glName'>"+_tmp[key].name+"</p><p><a class='divLink'></a></p></div></div>");

			}
			
			setGroupSelect();

		}
	});
}

function setGroupSelect(){
	//$('.glElement').not('#glMine').unbind('click');
	$('.glElement').on('click', function(err){
		$('#groupName').val($(this).find('p.glName').text());
		$('#groupId').val($(this).attr('id'));
		
		$('#topTitle').text($('#groupName').val());
		$('#topTitle').attr('value',1);
		
		UpdateDate($('#groupId').val());
		$('#groupList').hide();
		setGroupControl();
	});
	
	$('#glMine').unbind('click');
	$('#glMine').on('click', function(err){
		$('#topTitle').text("내 시간표");
		$('#topTitle').attr('value',0);
		$('#groupControl').hide();
		UpdateDate($('#userId').val());
	});
}

function setGroupControl(){
	var permission=0;
	var groupId = $('#groupId').val();
	var userId = $('#userId').val();
	
	$('#groupControl').show();
	$('#groupJoin').hide();
	$('#groupQuit').hide();
	$('#groupDel').hide();
	$('#groupControlName').text($('#groupName').val());
	$.ajax({
		type : "POST",
		url : "/listGroupMembers",
		data : "groupId=" + groupId,
		success : function(data){
			
			var _tmp = JSON.parse(data);
			if(_tmp[0].leader == userId)
				permission=2;
			else{
				for(var key in _tmp[0].members){
					if(_tmp[0].members[key] == userId)
						permission=1;
				}
			}
			if(permission==0)
				$('#groupJoin').show();
			else if(permission==1){
				$('#groupQuit').show();
			}else{
				$('#groupDel').show();
			}
			$('#groupJoin').unbind('click');
			$('#groupJoin').on('click',function(){
				$.ajax({
					type: 'POST',
					url: '/updateGroup',
					data: "groupId=" + groupId + "&memberId=" + userId,
					success: function(){
					alertSuccess("그룹에 가입하였습니다!");
					$('#groupJoin').hide();
					$('#groupQuit').show();
					}
				});
			});
			$('#groupQuit').unbind('click');
			$('#groupQuit').on('click',function(){
				$.ajax({
					type: 'POST',
					url: '/quitGroup',
					data: "groupId=" + groupId + "&memberId=" + userId,
					success: function(){
						alertWarning("그룹에서 탈퇴하였습니다!");
						$('#groupJoin').show();
						$('#groupQuit').hide();
					}
				});
			});
			$('#groupDel').unbind('click');
			$('#groupDel').on('click',function(){
				$.ajax({
					type: 'POST',
					url: '/removeGroup',
					data: 'leader=' + userId + '&groupId=' + groupId,
					success: function(){			
						alertWarning("그룹을 삭제하였습니다!");
						$('#groupDel').hide();
						$('#topTitle').attr('value',0);
						UpdateDate(userId);
					}			
				});
			});
		}
	});
	
	$('#groupControlMembers div').remove();
	
	$.ajax({
		type: 'POST',
		url: '/listGroupMembers',
		data: 'groupId=' + groupId,
		success: function(data){
			var _tmp = JSON.parse(data)[0].members;
			_tmp.push(JSON.parse(data)[0].leader);
			$.ajax({
				type: 'POST',
				url: '/listMember',
				data: 'members=' + JSON.stringify(_tmp),
				success : function(ret){
					var _temp = JSON.parse(ret);
					for(var key in _temp){
						$('#groupControlMembers').append('<div>'+_temp[key].name+'</div>');
					}
				}
			});
		}
	});
}

function setGroupFind(){
	$('#groupFind').unbind('click');
	$('#groupFind').on('click', function(){
		if(!($('#groupFindName').text())){
			initGroups($('#groupFindName').val());
		}
	});
}

function setGroupAdd(){		//set NEW GROUP and MEMBER event
	$('#newGroupSubmit').unbind('click');
	$('#newGroupSubmit').on('click',function(){
		if($('#newGroupName').val() == "") alertWarning("그룹명을 입력하세요.");
		else{
			$.ajax({
				type: 'POST',
				url: '/createGroup',
				data: "name=" + $('#newGroupName').val() + "&leaderId=" + $('#userId').val(),
				complete: function(data){
					alertSuccess("그룹을 생성하였습니다.");
					var gId = data.responseText;
					$.ajax({
						type: 'POST',
						url: '/updateMember',
						data: 'memberId=' + $('#userId').val() + '&groupId=' + gId,
						success : function(){							
						}
					});
					
				}
			});
		}
	});

}
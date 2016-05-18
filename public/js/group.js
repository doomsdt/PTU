
function initGroups(gName){		//get GROUP LIST and show
	if(!$('#topTitle').text())
		$('#topTitle').attr('value',0);
	$.ajax({
		type: 'POST',
		data: 'groupName=' + gName,
		url: '/listGroup',
		success: function(data){
			var _tmp = JSON.parse(data);
			$('#groupList div').remove();
			$('#groupList br').remove();
			
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
				$('#groupList').append("<div class='glBox'><div class='btn btn-primary glElement' id="+ _tmp[key]._id +"><p class='glLeader'>"+leader
						+"</p><p class='glName'>"+_tmp[key].name+"</p><p><a class='divLink'></a></p></div><input type='button' value='+' class='btn btn-sm glJoin'></div></br>");

			}
		
			$('.glElement').not('#glMine').on('click', function(err){
				$('#topTitle').text($(this).find('p.glName').text());
				$('#topTitle').attr('value',1);
				UpdateDate($(this).attr('id'));
			});
			
			$('#glMine').on('click', function(err){
				$('#topTitle').text($(this).find('p.glName').text());
				$('#topTitle').attr('value',0);
				UpdateDate($('#userId').val());
			});

			$('.glJoin').on('click',function(){
				var groupId = $(this).siblings(".glElement").attr('id');
				var memberId = $('#userId').val();
				$.ajax({
					type: 'POST',
					url: '/updateGroup',
					data: "id=" + groupId + "&member_id=" + memberId,
					success: function(){
						$.ajax({
							type: 'POST',
							url: '/updateMember',
							data: 'id=' + memberId + '&groupId=' + groupId,
							success : function(){
								
							}
						});
					}
				});
			});
		}
	});
}


function setGroupFind(){
	$('#groupFind').on('click', function(){
		if(!($('#groupFindName').text())){
			initGroups($('#groupFindName').val());
		}
	});
}

function setGroupAdd(){		//set NEW GROUP and MEMBER event
	$('#newGroupSubmit').on('click',function(){

		$.ajax({
			type: 'POST',
			url: '/createGroup',
			data: "name=" + $('#newGroupName').val() + "&leader_id=" + $('#userId').val(),
			success: function(data){
				alertSuccess("그룹을 생성하였습니다.");
				console.log(data);
			}
		});
	});

}
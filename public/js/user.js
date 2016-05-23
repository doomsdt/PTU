
function setLogout(){
	$('#logoutButton input').unbind('click');
	$('#logoutButton input').on('click',function(){
		FB.logout(function(response){
			$('#logoutButton').hide();
			$('#loginButton').show();
			statusChangeCallback(response);
		});
	});
}

function signInWithFacebook(){
	FB.api('/me?fields=name,picture.width(800).height(800)', function(res) {
		$('#userId').attr('value',res.id);
	    $('#userName').attr('value',res.name);
	    $('#picUrl').attr('value',res.picture.data.url);
		
		$.ajax({
			type : "POST",
			url : "/userIn",
			data : "fId=" + res.id,
			success : function(data){
				if(data==0){				
					$.ajax({
						type: "POST",
						url : "/createMember",
						data : 'uid=' + res.id + "&name=" + res.name + "&picUrl=" + res.picture.data.url,
						success : function(){
							alertSuccess("가입을 축하합니다!");
						}
					});							
				}				
			}
		});	
		setUserInfo();
		UpdateDate(res.id);
	});
	
}


function setUserInfo(){
	//$('#picUrl').val("https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/11218871_791961790922545_8076800936888519048_n.jpg?oh=58408a125b2f882969f1e964678913c4&oe=57E0AE45");
	$('#userInfoName').text($('#userName').attr('value'));
	$('#userInfoPic').attr('src',$('#picUrl').attr('value'));
	
	$('#userInfoMgroup div').remove();
	$('#userInfoJgroup div').remove();
	
	$.ajax({
		type:"POST",
		data:"leaderId=" + $('#userId').val(),
		url:"/listGroup",
		success:function(data){
			var _tmp = JSON.parse(data);
			for(var key in _tmp){
				$('#userInfoMgroup').append("<div class='glElement btn btn-default' id=" + _tmp[key]._id +"><p class='glName'>"+_tmp[key].name+"</p></div>");
			}			
		}
	});
	
	$.ajax({
		type:"POST",
		data:"userId=" + $('#userId').val(),
		url:"/listMemberGroups",
		success:function(data){
			var arr = JSON.parse(data)[0].groups;
			$.ajax({
				type:"POST",
				data:"groups=" + JSON.stringify(arr),
				url:"/listGroup",
				success:function(ret){
					var _tmp = JSON.parse(ret);
					for(var key in _tmp){
						if(_tmp[key].leader != $('#userId').val())
							$('#userInfoJgroup').append("<div class='glElement btn btn-default' id=" + _tmp[key]._id +"><p class='glName'>"+_tmp[key].name+"</p></div>");
					}
					setGroupSelect();
				}
			});
		}
	});
}
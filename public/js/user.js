
function setLogout(){
	
	$('#logoutButton input').on('click',function(){
		FB.logout(function(response){
			$('#logoutButton').hide();
			$('#loginButton').show();
			statusChangeCallback(response);
		});
	});
}

function signInWithFacebook(){
	FB.api('/me?fields=name,picture,friends', function(res) {
		$('#userId').attr('value',res.id);
	    $('#userName').attr('value',res.name);
	    $('#picUrl').attr('value',res.picture.data.url);
		
		$.ajax({
			type : "POST",
			url : "/userIn",
			data : "fId=" + res.id,
			success : function(data){
				console.log(data);
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
		
	});
	setUserInfo();
	console.log('sUI call');
}


function setUserInfo(){
	console.log('setUserInfo run');
	//$('#picUrl').val("https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/11218871_791961790922545_8076800936888519048_n.jpg?oh=58408a125b2f882969f1e964678913c4&oe=57E0AE45");
	$('#userInfoName').text($('#userName').val());
	$('#userInfoPic').attr('src',$('#picUrl').val());
	
	$('#userInfoMgroup li').remove();
	$('#userInfoJgroup li').remove();
	
	$.ajax({
		type:"POST",
		data:"leaderId=" + $('#userId').val(),
		url:"/listGroup",
		success:function(data){
			var _tmp = JSON.parse(data);
			for(var key in _tmp){
				$('#userInfoMgroup').append("<li>"+_tmp[key].name+"</li>");
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
						$('#userInfoJgroup').append("<li>"+_tmp[key].name+"</li>");
					}
				}
			});
		}
	});
}
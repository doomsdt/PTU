
function setLogout(){
	
	$('#logoutButton input').on('click',function(){
		FB.logout(function(response){
			$('#logoutButton').hide();
			$('#loginButton').show();
			statusChangeCallback(response);
		});
	});
}

function signInWithFacebook(fId){
	$.ajax({
		type : "POST",
		url : "/userIn",
		data : "fId=" + fId,
		success : function(data){
			console.log(data);
			if(data==0){
				FB.api('/me?fields=name,picture,friends', function(res) {
					$.ajax({
						type: "POST",
						url : "/createMember",
						data : '_id= ObjectId("' + fId + '")&pic=' + res.picture.data.url + "&name=" + res.name,
						success : function(){
							
						}
					});
				});				
			}
		}
		
	});
}
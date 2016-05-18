
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
		}
		
	});
}

function setLogout(){
	
	$('#logoutButton input').on('click',function(){
		FB.logout(function(response){
			$('#logoutButton').hide();
			$('#loginButton').show();
			statusChangeCallback(response);
		});
	});
}
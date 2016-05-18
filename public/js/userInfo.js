
function setLogout(){
	$('#logoutButton input').hide();
	$('#logoutButton input').on('click',function(){
		FB.logout(function(response){
			$('#logoutButton').hide();
			$('#loginButton').show();
		});
	});
}
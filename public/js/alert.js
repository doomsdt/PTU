function alertSuccess(message){
	$('.alert-success span').text(message);
	$('.alert-success').show();
	setTimeout(function() {
	        $(".alert-success").hide();
	}, 2000);
}
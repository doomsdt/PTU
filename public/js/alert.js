function alertSuccess(message){
	$('.alert-success span').val(message);
	$('.alert-success').show();
	setTimeout(function() {
	        $(".alert-success").hide();
	}, 2000);
}
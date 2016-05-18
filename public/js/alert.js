function alertSuccess(message){
	$('.alert-success span').text(message);
	$('.alert-success').show();
	setTimeout(function() {
	        $(".alert-success").hide();
	}, 2000);
}

function alertWarning(message){
	$('.alert-warning span').text(message);
	$('.alert-warning').show();
	setTimeout(function() {
	        $(".alert-warning").hide();
	}, 2000);
}
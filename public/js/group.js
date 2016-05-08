
function setGroupAdd(){
	$('#newGroupSubmit').unbind('click');
	$('#newGroupSubmit').bind('click',function(){
		console.log('clicked');
		$.ajax({
			type: 'POST',
			url: '/createGroup',
			data: "name=" + $('#newGroupName').val() + "&leader=" + $('#newGroupName').attr('name'),
			success: function(){
				console.log('group has created successfully');
			}
		});
	});
}
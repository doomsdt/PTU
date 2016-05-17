//make number to 2-word string  ex) 1 -> "01"
function get_number_str(num){
	if(num<10)
		num = '0' + num;
	return num;
}

//get the last day of year-month
function get_day_max(y,m){
	var i = 29, cday;
	while(i<32){
		cday = new Date(y,m,i);
		if (cday.getFullYear()!=y || cday.getMonth()!=m) break;
		i++;
	}
	return i-1;
}

//get a starting day of this week
function _startDay(){
	var today = new Date().getDay();
	var start_day = new Date();
	start_day.setDate(start_day.getDate() - today);
	
	return start_day;
}
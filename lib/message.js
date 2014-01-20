exports.get_message = function(acc_latest,len){
  var msg = '';

  if (acc_latest.length == len) {
	var sum = 0;

	for (i = len-1; i >= 0; i--) {
	  sum += acc_latest[i];
	}

	var avg = sum/len;

	if (avg >= .9) {msg = 'Perfect!';}
	else if (avg >= .7) {msg = 'Good Werk!';}
	else if (avg >= .5) {msg = 'OK!';}
  }

  return msg;
}

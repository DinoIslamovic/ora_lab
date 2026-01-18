var logInBtn = document.getElementById("login_link");
var logOutBtn = document.getElementById("logout_link");
var profileBtn = document.getElementById("profile_link");


const hide_show2 = async () => {
    //console.log("activated!!");
	var checkLogIn = new XMLHttpRequest();
	checkLogIn.open('GET', 'checkLogIn', true);
	checkLogIn.onload = function() {
		if(checkLogIn.responseText == "da") {
			logInBtn.hidden = true;
			logOutBtn.hidden = false;
			profileBtn.hidden = false;
		}
		else {
			logInBtn.hidden = false;
			logOutBtn.hidden = true;
			profileBtn.hidden = true;
		}
	}
	checkLogIn.send()
}
	
setInterval(hide_show2, 25);
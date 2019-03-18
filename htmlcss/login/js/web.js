//使高度一致
var doresize = function(){
	var login_h = ($(window).height() - $("#login_header").height() - $("#login_body").height() - $("#login_footer").height())/2;
	if(login_h > 17 || login_h < 10)
	   login_h = 17;
	$("#login_header").css("margin-top", login_h);
}
var doBackResize = function(){
	var login_h = $(window).height() - $("#login_header").height() - $("#back_body").height() -27;
	if(login_h < 17 || login_h < 10)
	   login_h = 17;
	$("#login_header").css("margin-top", login_h);
}


function getWidth()
{
	var sw=0;
	if (!navigator.userAgent.match(/mozilla/i) && ! navigator.userAgent.match(/webkit/i) )
	sw = Math.max( $(window).innerWidth(), window.innerWidth) + 16;
	else if(isIEBrowser() == 1)
	sw = $(window).width() + 16;
	else if(isIEBrowser() == 2)
	sw = $(window).width() + 16;
	else
	sw=$(window).width();
	return sw;
}
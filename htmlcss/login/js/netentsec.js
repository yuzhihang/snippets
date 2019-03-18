var block_settimeout;

//未初始化
var READY_STATE_UNINITIALIZED = 0;
//正在装载
var READY_STATE_LOADING = 1;
//已载入
var READY_STATE_LOADED = 2;
//正在交互
var READY_STATE_INTERACTIVE = 3;
//完成
var READY_STATE_COMPLETE = 4;
/**
 * 获取XMLHttpRequest对象
 */
function getXMLRequest() {
    http_request = false;
    //开始初始化XMLHttpRequest对象
    if (window.XMLHttpRequest) { //Mozilla 浏览器
        http_request = new XMLHttpRequest();
        if (http_request.overrideMimeType) {//设置MiME类别
            http_request.overrideMimeType('text/xml');
        }
    } else if (window.ActiveXObject) { // IE浏览器
        try {
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                http_request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    if (!http_request) { // 异常，创建对象实例失败
		window.alert(WEBLOGIN_CUSTOM_ERRORCONFIG.requestObjError);
        return false;
    } else {
        return http_request;
    }
}

/**
	*	删除ajax超时连接
	*/
function connecttoFail() {
    if (req) {
    		req.abort();
    }
}

/**
	*	登录成功页面定时心跳
	*/
var heartbeatCyle = 0;
var heartbeat;
var req;
function sendHeartbeat(){
		window.clearInterval(firstHeartbeat);
		req = getXMLRequest();
		if (req) {
      	req.onreadystatechange = function() {
            if (req.readyState == READY_STATE_COMPLETE) {
                if (req.status == 200) {
                		if(ajaxTimeout){
                				clearTimeout(ajaxTimeout);
                		}
                    heartbeatCyle = req.responseText*1000;
                    delete req;
                    req = null;
                    if(heartbeat){
                    		window.clearInterval(heartbeat);
                    }
                    if(heartbeatCyle > 0){
                    		heartbeat = setInterval("sendHeartbeat()", heartbeatCyle);
                    }
                }else{
                		if(heartbeat){
                    		window.clearInterval(heartbeat);
                    }
                		heartbeat = setInterval("sendHeartbeat()", 60000);
                }
            }
      	}
        req.open("post", '/login', true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
        		var param = "login_type=heartbeat";
            req.send(param);
            //判断一段时间后ajax连接仍然存在，则强制关闭，该时间最好小于 heartbeat cycle；
            ajaxTimeout = setTimeout(connecttoFail, 58000);
        } catch (e) {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.requestError);
        }
		}
}			

/**
 * 移动版不提供心跳增强关闭浏览器下线功能
 */
function noSendHeartbeat(){
		var req = getXMLRequest();
		if (req) {
      	req.onreadystatechange = function() {
            if (req.readyState == READY_STATE_COMPLETE) {
                if (req.status == 200) {
                		
                }else{
                		
                }
            }
      	}
        req.open("post", '/login', true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
        		var param = "login_type=noheartbeat";
            req.send(param);
        } catch (e) {
            
        }
		}
}			

/**
 * 
 *AJAX发送请求
 *@param url 要访问的地址
 *@param param 请求参数
 *@callback 回调函数,处理请求回应
 *@sync是否同步 true,false
 *@type返回结果类型 text,xml
 */
function getShortMessagePasswordByAjax(url, param, callback, sync, type) {
    var req = getXMLRequest();
    if (req) {
        req.onreadystatechange = function() {
            if (req.readyState == READY_STATE_COMPLETE) {
                if (req.status == 200) {
                    var response;
                    //console.dir(req);
                    if (type == "text") {
                        response = req.responseText;
                    } else if (type == "xml") {
                        response = req.responseXML;
                    }

                    /*
                     SEND_SUCCESS=0,       //发送成功，返回值0
                     SEND_WHITEPHONE=1,         //手机号不在白名单
                     SEND_COUNTLIMIT=2,         //每天发送短信个数限制
                     SEND_POLICYERR=3,       //认证策略中没有配置短信服务器
                     SEND_NOSERVER=4,     //没有这个服务器
                     SEND_ERRCONTENT=5,    //短信内容配置错误
                     SEND_ERRSOCKET=6,     //创建socket错误
                     SEND_ERRSERVER=7,     //服务器配置错误
                     SEND_ERRRWSOCK=8,      //网络读写错误
                     SEND_ERRRECV=9,       //返回错误
                     SEND_ERRPARAM=10,      //参数非法，返回值为-9000
                     SEND_NEEDPARAM=11,     //缺少参数，返回值为-9001
                     SEND_FAIL=12,          //发送失败，返回值为-9002
                     SEND_ERRPWD=13,        //密码错误，返回值为-9003
                     SEND_STOP=14,           //发送终止，返回值为-9009
                     SEND_FREQUENCY_FAST=15, //发送频率过快，请稍后再试
                     SEND_UNKNOWN=16        //未知错误*/
										
                    var msg;
                    switch (response) {
                        case '0':
                            if(document.getElementById('assure_phone') && document.getElementById('assure_phone').value != ''){
                            	var telephone = document.getElementById('assure_phone').value;
                            }else{
                            	if(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id) && document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id).value != '') {
                                    var telephone = document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id).value;
                                } else {
                                    var telephone = document.getElementById('wifi_username').value;
                                }                                
                            }
                            
                            telephone = decodeURIComponent(telephone);
							msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.successMsg.replace('{telephone}', telephone);
                            break;
                        case '1':
							msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.illegalError;
                            break;
                        case '2':
							msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.limitError;
                            break;
                        case '3':
							msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.serverError;
                            break;
                        case '4':
                            msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.noserverError;
                            break;
                        case '5':
                            msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.msgSetError;
                            break;
                        case '15':
                            msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.frequencyError;
                            break;
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                        case '10':
                        case '11':
                        case '12':
                        case '13':
                        case '14':
                        case '15':
                        default:
                            msg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.failure;
                    }
                    if (response != '0') {
                        if(document.getElementById('terminal') && document.getElementById('terminal').value == 'mobile'){
								document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#FFFFFF';
						}else{
								document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#3D9CE2';
						}
						document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).value = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.text;						
                        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).disabled = false;
                        SetCookie('retry_clock', 'begin');
                        clearTimeout(block_settimeout);
                        refreshCaptcha();
                    }
                    alert(msg);

                    delete req;
                    req = null;
                }
            }
        }
        req.open("post", url, sync);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
            req.send(param);
        } catch (e) {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.requestError);
        }
    }
}

function checkCaptchaAndGetcodeByAjax(url, param, callback, sync, type) {
		var req = getXMLRequest();
    if (req) {
        req.onreadystatechange = function() {
            if (req.readyState == READY_STATE_COMPLETE) {
            		
                if (req.status == 200) {
                    var response;
                    //console.dir(req);
                    if (type == "text") {
                        response = req.responseText;
                    } else if (type == "xml") {
                        response = req.responseXML;
                    }
                    
                    if(response == 'true'){
                    		SetCookie('retry_clock', 'begin');
							retry_clock();
							if (GetCookie('retry_clock') == 59) {
								var form = document.getElementById('loginForm');
								//form.login_type.value = "getcode";
								var params = 'login_type=getcode&username=' + encodeURIComponent(form.username.value) + '&assure_phone=' + (form.assure_phone ? form.assure_phone.value : '') + '&page_language=' + (form.page_language ? form.page_language.value :'zh');
								getShortMessagePasswordByAjax('/login', params, '', true, 'text');
							}
                    }else{
						alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.checkCaptchaError);
                    	refreshCaptcha();
                    }
                    delete req;
                    req = null;
                }
            }
        }
        req.open("post", url, sync);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
            req.send(param);
        } catch (e) {
        	alert(WEBLOGIN_CUSTOM_ERRORCONFIG.requestError);
        }
    }
}

function get_short_message_password() {
    var form = document.getElementById('loginForm');
    var divUsername = document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id);
    var username = trim(divUsername.value);
    if (!isNotEmpty(trim(username))){
		divUsername.focus();
		if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.emptyError, 'add')
		} else {
			 if(WEBLOGIN_CONFIG.basic.check_assure == 1) {
				 alert(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.emptyError);
			 } else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.emptyError);
			 }
		}
		return false;
    } else {
		errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id);
	}
    
    if(form.show_assure.value == 'block'){
		//开启担保人功能
		//判断账号
		if (username.length > 40) {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.lengthError);
			return false;
		}
		if(!/^[A-Za-z\d\u4E00-\u9FA5_]+$/.test(username)) {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalAccountError);
			return false;
		}
		//判断担保人手机号
		if(form.assure_phone && !CheckUtil.checkMobile(form.assure_phone.value)){
			form.assure_phone.focus();
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalPhoneError);
			return false;
		}
    }else{
		//关闭开启担保人功能
		if(form.assure_phone) {
			form.assure_phone.value = '';
		}
		//判断登录账号手机号
		if(!CheckUtil.checkMobile(username)){
			divUsername.focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalPhoneError, 'add');
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalPhoneError);
			}
			return false;
		} else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id);
		}
    }
        
    if(form.show_captcha.value == 'block'){
    	//开启验证码功能
		if(trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.id).value) == ''){
			document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.id, WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.emptyError, 'add');
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.emptyError);
			}
			return false;
		}else{
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.id);
			checkCaptchaAndGetcodeByAjax('/login/checkCaptcha.php', 'username=' + encodeURIComponent(username) + '&captcha=' + document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.id).value, '', true, 'text');
			return false;
		}
    }else{
		//关闭验证码功能
		SetCookie('retry_clock', 'begin');
		retry_clock();
		var retry_clock_cookie = GetCookie('retry_clock');
		if (retry_clock_cookie == 59 || retry_clock_cookie == null) {
			//form.login_type.value = "getcode";
			var params = 'login_type=getcode&username=' + encodeURIComponent(username) + '&assure_phone=' + (form.assure_phone ? form.assure_phone.value : '') + '&page_language=' + (form.page_language ? form.page_language.value :'zh');
			getShortMessagePasswordByAjax('/login', params, '', true, 'text');
		}else{
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.captcha.responseCaptchaError);
		}
    }
}

function autoPushOffline(url, param, callback, sync, type) {
		var req = getXMLRequest();
    if (req) {
        req.onreadystatechange = function() {
            if (req.readyState == READY_STATE_COMPLETE) {
            		
                if (req.status == 200) {
                    var response;
                    //console.dir(req);
                    if (type == "text") {
                        response = req.responseText;
                    } else if (type == "xml") {
                        response = req.responseXML;
                    }
                    
                    if(response == 'true'){
                    }else{
                    }
                    delete req;
                    req = null;
                }
            }
        }
        req.open("post", url, sync);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        try {
            req.send(param);
        } catch (e) {           
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.requestError);
        }
    }
}

function refreshCaptcha(){
    var img = document.images['captcha'];
    if(img){
    	img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
    }
}

function switch_client(ctype) {		
	//local is the source url
	var local = window.location.href;
	
	//To get the filepath
	var position = local.indexOf('/', 10);
	var new_local = local.substring(position);
    
    //ctype is the destination type of webpage
    if (ctype == 'pc') {
    		// From 'mobile' to jump to 'pc'
    		window.location.href = new_local.replace('mobile_index.html', 'index.html');
    }
    if (ctype == 'mobile') {
    		if(new_local.indexOf('mobile_change_password.html') > 0){
    				// From 'mobile_change_password' to jump to 'mobile'
    				window.location.href = new_local.replace('mobile_change_password.html', 'mobile_index.html');
    		}else if(new_local.indexOf('mobile_get_password.html') > 0){
    				// From 'mobile_get_password' to jump to 'mobile'
    				window.location.href = new_local.replace('mobile_get_password.html', 'mobile_index.html');
    		}else{
    				// From 'pc' to jump to 'mobile'
    				window.location.href = new_local.replace('index.html', 'mobile_index.html');
    		}
    }
    if (ctype == 'mobile_change_password') {
    		// From 'mobile' to jump to 'mobile_change_password'
    		window.location.href = new_local.replace('mobile_index.html', 'mobile_change_password.html');
    }
    if (ctype == 'mobile_get_password') {
    		// From 'mobile' to jump to 'mobile_get_password'
    		window.location.href = new_local.replace('mobile_index.html', 'mobile_get_password.html');
    }
}

function click_readme() {
    //var button = document.getElementById('submit_button_1');
    //if (document.getElementById('read').checked == true) {
   //     button.className = 'middle_form_login_c2_e';
   // } else {
   //     button.className = 'middle_form_login_c2';
   // }
	
}

function click_readpage() {
	if(WEBLOGIN_CONFIG.basic.hide_read == 0 && WEBLOGIN_CONFIG.basic.read_index != -10) {
		Read.run({isRead: true,  URL: WEBLOGIN_CONFIG.basic.read_index_real.replace("/push/", "/")});
	}
}

function change_password_shift(type) {
    if (type == "1") {
        document.getElementById('remember_div').style.display = 'none';
        if(document.getElementById('remember_div_r')){
        		document.getElementById('remember_div_r').style.display = 'none';
        }
        document.getElementById('submit_button').style.display = 'none';
        document.getElementById('change_password_href').style.display = 'none';
        document.getElementById('change_password_href_return').style.display = 'block';
        document.getElementById('change_button').style.display = 'block';
        document.getElementById('change_password_input').style.display = 'block';
        document.getElementById('change_password_input_r').style.display = 'block';
        if(document.getElementById('show_captcha') && document.getElementById('show_captcha').value == 'block'){
						document.getElementById('captcha').style.display = 'none';
				}
				if(document.getElementById('short_message') && document.getElementById('short_message').value == 'block'){
						document.getElementById('get_short_message').style.display = 'none';
				}
    } else {
        document.getElementById('remember_div').style.display = 'block';
        if(document.getElementById('show_read') && document.getElementById('show_read').value == 'block'){	
		        if(document.getElementById('remember_div_r')){
		        		document.getElementById('remember_div_r').style.display = 'block';
		        }
        }
        document.getElementById('submit_button').style.display = 'block';
        document.getElementById('change_password_href').style.display = 'block';
        document.getElementById('change_password_href_return').style.display = 'none';
        document.getElementById('change_button').style.display = 'none';
        document.getElementById('change_password_input').style.display = 'none';
        document.getElementById('change_password_input_r').style.display = 'none';
        if(document.getElementById('show_captcha') && document.getElementById('show_captcha').value == 'block'){
						document.getElementById('captcha').style.display = 'block';
				}
				if(document.getElementById('short_message') && document.getElementById('short_message').value == 'block'){
						document.getElementById('get_short_message').style.display = 'block';
				}
    }
}

function login_page_function_shift(type){
    if (type == "1") {
    		//hide some parts
    		if(document.getElementById('remember_div')){
    				document.getElementById('remember_div').style.display = 'none';
    		}
    		if(document.getElementById('read_div')){
    				document.getElementById('read_div').style.display = 'none';
    		}
    		if(document.getElementById('login_button_div')){
    				document.getElementById('login_button_div').style.display = 'none';
    		}
		    if(document.getElementById('assure_phone_div')){
						document.getElementById('assure_phone_div').style.display = 'none';
				}
				if(document.getElementById('get_password_button_div')){
						document.getElementById('get_password_button_div').style.display = 'none';
				}
				if(document.getElementById('captcha_div')){
						document.getElementById('captcha_div').style.display = 'none';
				}
    		//show some parts
    		if(document.getElementById('new_password_div')){
    				document.getElementById('new_password_div').style.display = '';
    		}
    		if(document.getElementById('retry_password_div')){
    				document.getElementById('retry_password_div').style.display = '';
    		}
    		if(document.getElementById('change_password_button_div')){
    				document.getElementById('change_password_button_div').style.display = '';
    		}
    		if(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id) && document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).className == 'txt_login txt_ls') {
					document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).className = 'txt_login';
				}
    } else if(type == '2') {
    		//show some parts
        if(document.getElementById('remember_div')){
    				document.getElementById('remember_div').style.display = '';
    		}
    		if(document.getElementById('login_button_div')){
    				document.getElementById('login_button_div').style.display = '';
    		}
    		if(document.getElementById('show_read') && document.getElementById('show_read').value == 'block'){
    				document.getElementById('read_div').style.display = '';
    		}
    		if(document.getElementById('show_assure') && document.getElementById('show_assure').value == 'block' && document.getElementById('assure_phone_div')){
						document.getElementById('assure_phone_div').style.display = '';
				}
    		if(document.getElementById('show_captcha') && document.getElementById('show_captcha').value == 'block' && document.getElementById('captcha_div')){
						document.getElementById('captcha_div').style.display = '';
				}
				if(document.getElementById('short_message') && document.getElementById('short_message').value == 'block'){
						document.getElementById('get_password_button_div').style.display = '';
				}
    		//hide some parts
    		if(document.getElementById('new_password_div')){
    				document.getElementById('new_password_div').style.display = 'none';
    		}
    		if(document.getElementById('retry_password_div')){
    				document.getElementById('retry_password_div').style.display = 'none';
    		}
    		if(document.getElementById('change_password_button_div')){
    				document.getElementById('change_password_button_div').style.display = 'none';
    		}
    		if(document.getElementById('short_message') && document.getElementById('short_message').value == 'block'){
						document.getElementById('get_password_button_div').style.display = '';
						if(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id) && document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).className == 'txt_login') {
							document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).className = 'txt_login txt_ls';
						}
				}
    } 
    if(navigator.userAgent.indexOf("MSIE 6.0")>0){
    		if(document.getElementById('username_div')){
    				document.getElementById('username_div').className = "change_password_public_div";
    		}
    		if(document.getElementById('password_div')){
    				document.getElementById('password_div').className = "change_password_public_div";
    				document.getElementById('password_div').style.width = "380px";
    		}
    		if(document.getElementById('assure_phone_div')){
    				document.getElementById('assure_phone_div').className = "change_password_public_div";
    		}
    }
}

//判断是否为空
function isNotEmpty(s)
{
    var whitespace = " \t\n\r";
    var i;
    if ((s == null) || (s.length == 0))
    {
        return false;
    }
    for (i = 0; i << s.length; i++)
    {
        var c = s.charAt(i);
        if (whitespace.indexOf(c) == -1)
        {
            return false;
        }
    }
    return true;
}

//获得Cookie解码后的值
function GetCookieVal(offset)
{
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return unescape(document.cookie.substring(offset, endstr));
}

//设定Cookie值
function SetCookie(name, value, expires)
{
    var expdate = new Date();
    var argv = SetCookie.arguments;
    var argc = SetCookie.arguments.length;
    if(expires == null || expires == ''){
    		expires = 30 * 24 * 3600;	
    }
    var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    if (expires != null)
        expdate.setTime(expdate.getTime() + (expires * 1000));
    document.cookie = name + "=" + escape(value) + ((expires == null) ? "" : ("; expires=" + expdate.toGMTString()))
            + ((path == null) ? "" : ("; path=" + path)) + ((domain == null) ? "" : ("; domain=" + domain))
            + ((secure == true) ? "; secure" : "");
}

//删除Cookie
function DelCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

//获得Cookie的原始值
function GetCookie(name)
{
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen)
    {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return GetCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

//设置页面个域的值
function setSave()
{ 
   $(document).keydown(function(event) { 
        if (event.keyCode == 13) { //捕获回车事件         
            var login_panel01 = (WEBLOGIN_CONFIG.basic.check_template == 0) ? document.getElementById('middle_message_form') : document.getElementById('login_panel01');
            var pass_btn = document.getElementById('change_password_button_div');
            var login_panel02 = document.getElementById('login_panel02');
            var login_panel04 = (WEBLOGIN_CONFIG.basic.check_template == 0) ? document.getElementById('wx_captcha') : document.getElementById('login_panel04');
            var login_panel05 = document.getElementById('login_panel05');
            var login_panel08 = document.getElementById('login_panel08');

            if(WEBLOGIN_CONFIG.basic.check_template == 2 && login_panel02 && login_panel02.style.display != 'none' && pass_btn && pass_btn.style.display != 'none') {//模板2修改密码
                $("#change_password_button_div input").click();
            } else if (WEBLOGIN_CONFIG.basic.check_template !=2 && pass_btn && pass_btn.style.display != 'none'){//修改密码
                $("#change_password_button_div input").click();
            } else if(login_panel04 && login_panel04.style.display!='none' && login_panel01.style.display =='none') {//微信认证

                if(WEBLOGIN_CONFIG.basic.check_template == 0) {
                    submitbutton('qrcode_captcha_login'); 
                } else {
                    $("#qrcode_captcha_div input").click(); 
                }
            } else if(login_panel05 && login_panel05.style.display!='none') {//一键免认证
                $("#samemac_button_div input").click();                        
            } else if(login_panel08 && login_panel08.style.display!='none') {//无账号认证
                $("#noaccount_button_div input").click();                        
            } else {
                $("#login_button_div input").click();
            }
        } 
    }); 

    //页面加载时，判断是否是短信获取密码
    if (document.getElementById('short_message') && document.getElementById('short_message').value == 'block') {
        //如果retry_clock为begin，则说明计时器未工作；否则执行计时器
        if (GetCookie('retry_clock') === 'begin') {
			if(document.getElementById('terminal') && document.getElementById('terminal').value == 'pc'){
				document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#3D9CE2';        			
				document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).value = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.text;
				document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).disabled = false;
			}
        } else {
			//关闭浏览器或刷新页面时，重置倒计时
			//cookie记录开始时间
            var retry_clock_start = GetCookie('retry_clock_start');
            //cookie值
            var retry_clock = GetCookie('retry_clock');
            if(retry_clock == '' || retry_clock_start == ''){
            		setTimeout("retry_clock()", 500);
            }else{
				var now = new Date();
				now = now.getTime();
				var diff = now - retry_clock_start;
				diff = Math.floor(diff/1000);
				if(retry_clock - diff > 0){
					retry_clock = retry_clock - diff;
					SetCookie('retry_clock', retry_clock, retry_clock);
					var now = new Date();
					SetCookie('retry_clock_start', now.getTime(), retry_clock);
					setTimeout("retry_clock()", 500);
				}
            }
        }
    }

    user_name = GetCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id);
    pass_word = GetCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id);
    save_user_name = GetCookie('save_user');
    save_pass_word = GetCookie('save_pass');
    if (user_name == null)
    {
        user_name = '';
    }

    if (pass_word == null)
    {
        pass_word = '';
    }
    document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value = user_name;
    document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).value = pass_word;

    if (document.getElementById('save_user') != null) {
        document.getElementById('save_user').checked = save_user_name;
    }

    if (document.getElementById('save_pass') != null) {
        document.getElementById('save_pass').checked = save_pass_word;
    }
    
    var form = document.getElementById('loginForm');
	var formInputs = form.getElementsByTagName('input');
	for(var i=0;i<formInputs.length;i++){
		placeHolder(formInputs[i],true);
	}
	detectNoAuth();
}
var check_qrcode = false;
function detectNoAuth() {
	$.ajax({
		type: "POST",
		url: "/login",
		data: "login_type=getuserinfo",	
		dataType: 'text',
		success: function(msg){
            msg = jQuery.parseJSON(msg);
            if(msg.wx_original_id && $("#terminal").val() == 'pc'){
                if(msg.type == '2' && msg.model == '2' && msg.model_extra == '2' && msg.vauth == '2'){
                    if (typeof WEBLOGIN_CONFIG != 'undefined' && WEBLOGIN_CONFIG.basic.check_template == 0) {
                        $("#wechat").show();
                        $("#wechatCaptcha").hide();
                        $(".change_password_public_div").hide();
                        if(WEBLOGIN_CONFIG.basic.show_mobile == 1 && WEBLOGIN_CONFIG.basic.check_captcha == 1) {
                            $("#captcha_div").show();
                        }
                        WEBLOGIN_CONFIG.basic.show_web == 0 && $("#qrcode_img_default").addClass("qrcode_image_big_class");
                        qrcodeInit();
                    }else{
                        $("#login_panel03").show();
                        $("#login_panel04").hide();
                        check_qrcode = true;
                        // $("#qrcode_img_default").addClass("qrcode_image_big_class");
                        qrcodeInit();
                    }
                }else{
                    if (typeof WEBLOGIN_CONFIG != 'undefined' && WEBLOGIN_CONFIG.basic.check_template == 0) {
                        $("#wechat").hide();
                        $("#wechatCaptcha").show();
                        $(".change_password_public_div").show();
                        $("#new_password_div").hide();
                        $("#retry_password_div").hide();
                        if(WEBLOGIN_CONFIG.basic.show_mobile == 0 || WEBLOGIN_CONFIG.basic.check_captcha == 0) {
                            $("#captcha_div").hide();
                        }

                        $("#qrcode_captcha_img").attr('src','/images/qrcode/'+msg.wx_original_id+'_qrcode.jpg');
                    }else{
                        $("#login_panel03").hide();
                        $("#login_panel04").show();
                        check_qrcode = false;
                        $("#qrcode_captcha_img").attr('src','/images/qrcode/'+msg.wx_original_id+'_qrcode.jpg');
                    }
                }
            }
			if(msg.is_samemac_continue) {
				//是一键免认证
				$("#login_type").val("onekeyauth"); //赋值第一次成功认证的认证类型

				var button_text = WEBLOGIN_CUSTOM_ERRORCONFIG.noaccount.buttonText;
				if (typeof WEBLOGIN_CONFIG != 'undefined') {
					if(typeof WEBLOGIN_CONFIG.basic.onekey_auth_button != "undefined" && WEBLOGIN_CONFIG.basic.onekey_auth_button != "") {
						button_text = WEBLOGIN_CONFIG.basic.onekey_auth_button;
					}
				} else {
					WEBLOGIN_CONFIG = {basic:{check_template: 0}};
				}
				//屏蔽输入框
				if(WEBLOGIN_CONFIG.basic.check_template == 1) {//模板1
					$("#login_panel01").hide();
					$("#login_panel02").css("display", "block");
					$("#login_panel03").hide();
					$("#login_panel04").hide();
					$("#remember_div").hide();
					$("#read_div").hide();
					$("#change_password_button_div").hide();
					$("#change_password_href").hide();

					$("#login_panel02").css("padding-top", "100px");
					$("#login_panel02").css("border-bottom", "none");

					$("#login_button_div").css("display", "block");
                    $("#login_button_div").css("text-align", "center");
					$(".btn_login").val(button_text);
					$(".btn_login").css('font-size', '16px');
					$(".btn_login").css('width', '268px');
				} else if(WEBLOGIN_CONFIG.basic.check_template == 0) {//模板0
					$("#middle_message_form").css("display", "block");
					$("#username_div").hide();
					$("#assure_phone_div").hide();
					$("#password_div").hide();
					$("#captcha_div").hide();
					$("#get_password_button_div").hide();
					$("#remember_div").hide();
					$("#read_div").hide();
					$("#change_password_href").hide();
					$("#wechat").hide();
					$("#wechatCaptcha").hide();
					$(".change_password_public_div").hide();

					//默认模板
					$(".middle_form_username_c").hide();
					$(".middle_form_username_head_c").hide();
					$(".middle_form_username_input_tail_c").hide();
					$("input[type=text]").hide();
					$("input[type=password]").hide();
					$(".middle_form_password_c").hide();
					$(".middle_form_password_head_c").hide();
					$(".middle_form_password_input_tail_c").hide();
					$("#change_password_input").hide();
					
					//手机端
					$("#mobile_message_form").hide();
					$("#wxnotice").hide();
					$(".signup-switch").hide();
					$("#macnoauth").show();
					
					//默认模板
					$(".input-wrapper").hide();
					$(".signin-misc-wrapper.clearfix").hide();

					$("#submit_button_1").val(button_text);
					$(".sign-button-text").html(button_text);
					$(".middle_form_login_c2").css('background', 'url(/images/weblogin/default/get_mobile_password_1.gif) no-repeat');
					$(".middle_form_login_c2").css('width', '223px');
					$(".middle_form_login_c2").css('margin-top', '100px');
				} else if(WEBLOGIN_CONFIG.basic.check_template == 2) {//显示菜单
					$(".icon-wifi-gray").show();
					$(".icon-wifi-gray").click();
					$("#samemac_button_div .btn_login").val(button_text);
					$("#samemac_button_div .btn_login").css('width', '268px');
				}
			}else{
				if (typeof WEBLOGIN_CONFIG != 'undefined' && WEBLOGIN_CONFIG.basic.check_template == 2) {
					var i = 0;
					$(".icon").each(function(){
						if($(this).css('display') != 'none') {
							i++;
						}
					});
					if(i > 1) {
						$(".icon-wifi-gray").hide();
					} else {
						if($("#terminal").val() == 'pc') {
							$("#login_panel06").hide();
						} else if($("#terminal").val() == 'mobile'){
							$("#login_panel05").hide();
						}					
					}
				} else {
					$("#login_type").val("");
				}
			}
		}
	});
}

/**
 * APP下载跳转
 */
function appStatistic(obj, os, dw) {	
		var param = '';
		if(obj.id != null && obj.id != '') {
				if(param != '') param += '&';
				param += 'on='+encodeURIComponent(trim(obj.id));
		}
		if(os >= 0) {
				if(param != '') param += '&';
				param += 'os='+(parseInt(os)+1);
		}
		if(dw >= 0) {
				if(param != '') param += '&';
				param += 'dw='+dw;
		}
		if(obj.href != '' && obj.href != 'javascript:void(0);') {
				if(param != '') param += '&';
				param += 'ft='+encodeURIComponent(trim(obj.href));
		}
		
		if(param != '') {
			 window.location.href = 'http://'+WEBLOGIN_CONFIG.basic.shost+':90/appdownload/index.php?'+param;
		}
		return false;
}

function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

function retry_clock() {
    var retry_clock = (GetCookie('retry_clock') === 'begin') ? 60 : GetCookie('retry_clock');
    if (retry_clock > 0) {
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#696969';
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).value = (WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.requestingText).replace('{clock}', retry_clock) ;
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).disabled = true;
        block_settimeout = setTimeout("retry_clock()", 1000);
        retry_clock = retry_clock - 1;
        SetCookie('retry_clock', retry_clock, retry_clock);
        var now = new Date();
				SetCookie('retry_clock_start', now.getTime(), retry_clock);
    } else {
        if(document.getElementById('terminal') && document.getElementById('terminal').value == 'mobile'){
    		document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#FFFFFF';
		}else{
			document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).style.color = '#3D9CE2';
		}
		document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).value = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.text;
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.passwdbutton.id).disabled = false;
        SetCookie('retry_clock', 'begin');
        clearTimeout(block_settimeout);
    }
}

function noaccount_auto_jump() {
	secs = secs-1;
	if(secs == 0){  
		clearInterval(time);
		//跳转
		submitbutton('noaccount_login');
	}else{   
		$("#back_ad_txt span").html(secs);  
	}  
}

function errorDisplay(id, errormsg, action) {
	if(action == 'add') {
		$("#"+id).css("border-color", "#E7380C");	
		$("#error_"+id+"_div span").html(errormsg);
	} else {
        $("#"+id).css("border-color", "#EDF5FD");	
		$("#error_"+id+"_div span").html("");
	}
}

function submitbutton(type)
{
    var form = document.getElementById('loginForm');

    /**关闭页面 退出登录**/
    isLogoutOnUnload = 'a3';
    if (type == 'logout_unload')
    {
        form.login_type.value = 'logout_unload';
        document.getElementById('loginForm').submit();
        return false;
    }
    if (type == 'logout')
    {
        form.login_type.value = 'logout';
        document.getElementById('loginForm').submit();
        return false;
    }
    if (type == 'login')
    {
		if(document.getElementById("login_type").value == "onekeyauth") {//一键免认证登录
			document.getElementById('loginForm').submit();	
			return false; 
		}

      if (document.getElementById('show_tip') && document.getElementById('read')) {
          if ((document.getElementById('show_tip').value  == 'block' || document.getElementById('show_tip').value  == '1') && document.getElementById('read').checked == '') {
			  alert(WEBLOGIN_CUSTOM_ERRORCONFIG.web.readcheck);
              return false;
          }
      }
      if (!isNotEmpty(trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value)))
      {
      	  document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).focus();
		    var tmpEmptyMsg = WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.emptyError;
			if(form.login_type.value == 'sms') {
				tmpEmptyMsg = WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.emptyError;
			}

		  if(WEBLOGIN_CONFIG.basic.check_template == 2) {
		      errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id, tmpEmptyMsg, 'add')
		  } else {
			alert(tmpEmptyMsg);
		  }
          return false;
      } else {
		  errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id);
	  }

      if(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value.length > 128){
      	  document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).focus();
		  if(WEBLOGIN_CONFIG.basic.check_template == 2) {
		      errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.lengthError, 'add')
		  } else {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.lengthError);
		  }
          return false;
      } else {
		  errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id);
	  }

		if(form.login_type.value == 'sms' && !CheckUtil.checkMobile(trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value))){
			document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalPhoneError, 'add');
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.illegalPhoneError);
			}
			return false;
		} else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.sms.account.id);
		}


      if (!isNotEmpty(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).value))
      {
          document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).focus();
		  if(WEBLOGIN_CONFIG.basic.check_template == 2) {
		      errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id, WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.emptyError, 'add')
		  } else {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.emptyError);
		  }
          return false;
      } else {
	      errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id);
	  }
      form.login_type.value = 'login';
      var username = trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value);
      document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id).value = username;
      var password = document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).value;

      if (document.getElementById('save_user') == null) {
          var save_user = false;
      } else {
          var save_user = document.getElementById('save_user').checked;
      }
      if (document.getElementById('save_pass') == null) {
          var save_pass = false;
      } else {
          var save_pass = document.getElementById('save_pass').checked;
      }

      if (save_user == true && save_pass == true)
      {
          SetCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id, username);
          SetCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id, password);
          SetCookie('save_user', save_user);
          SetCookie('save_pass', save_pass);
      }
      else if (save_user == true)
      {
          SetCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id, username);
          SetCookie('save_user', save_user);
          DelCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id);
          DelCookie('save_pass');
      } else
      {
          DelCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.account.id);
          DelCookie(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id);
          DelCookie('save_user');
          DelCookie('save_pass');
      }
      document.getElementById('password').value = md6(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.web.passwd.id).value);
      form.password1.value = '';

        // $('#uri').after('<input type=hidden id="original_url" name="original_url">');
        var url = $("#uri").val();
        var pos = url.indexOf("&");
        if(-1 != pos) {
            url = url.substr(0, pos-1);    
        }

        $("#uri").val(url);
        $("#qrcode_uri").val(url);
        // $("#uri").attr("disabled", 'disabled');  

      document.getElementById('loginForm').submit();

      DelCookie('retry_clock');
      return false;
    }
    
    if (type == 'changepass')
    {
        if (!isNotEmpty(trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id).value)))
        {
            document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.emptyError, 'add')
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.emptyError);
			}
            return false;
        } else {
		    errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id);
		}

		if(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id).value.length >128){
      	  document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id).focus();
		  if(WEBLOGIN_CONFIG.basic.check_template == 2) {
		      errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.lengthError, 'add')
		  } else {
			alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.lengthError);
		  }
          return false;
		} else {
			  errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id);
		}

        if (!isNotEmpty(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id).value))
        {
            document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.emptyError, 'add')
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.emptyError);
			}
            return false;
        } else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id);
		}

        if (!isNotEmpty(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).value))
        {
            document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.emptyError, 'add')
			} else {					
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.emptyError);
			}
            return false;
        } else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id);
		}

        if (!isNotEmpty(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id).value))
        {
            document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.emptyError, 'add')
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.emptyError);
			}
            return false;
        } else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id);
		}
  
        if (document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).value != document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id).value)
        {
			document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id, WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.confirmError, 'add')
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.confirmError);
			}
            return false;
        } else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id);
		}

        if (document.getElementById('check_passwd').value == 1) {
        		msg = "";
            var newps = document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).value;
            var oldps = document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id).value;
            var name = trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.account.id).value);
            if (document.getElementById('pass_check1').value == 1 && newps == name) {
                msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_check1;
            }
            if (document.getElementById('pass_check2').value == 1 && newps == oldps) {
                msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_check2;
            }
            if (document.getElementById('pass_check3').value == 1) {
                var pass_checklong = document.getElementById('pass_checklong').value;
                if (newps.length < pass_checklong) {
                    msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_check3 + pass_checklong;
                }
            }
            if (document.getElementById('pass_checknum').value == 1 && !newps.match(/([0-9])+/)) {
                msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_checknum;
            }
            if (document.getElementById('pass_checkletter').value == 1 && !newps.match(/([a-zA-Z])+/)) {
                msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_checkletter;
            }
            if (document.getElementById('pass_checkcharacter').value == 1 && !newps.match(/([!@#$%^&*()])+/)) {
                msg = WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.pass_checkcharacter;
            }
            
            if(msg != "") {
                if(WEBLOGIN_CONFIG.basic.check_template == 2) {
                    errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id, msg, 'add')
                } else {
                    alert(msg);
                }
                return false;    
            }
			
        }

        form.login_type.value = 'changepass';
        document.getElementById('password').value = md6(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.passwd.id).value);
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).value = md6(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.newpasswd.id).value);
        document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.changepasswd.renewpasswd.id).value = "";
        form.password1.value = '';
        document.getElementById('loginForm').submit();
        return false;
    }
    
    if(type == 'qrcode_captcha_login'){
    	if (!isNotEmpty(trim(document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.id).value)))
        {
			document.getElementById(WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.id).focus();
			if(WEBLOGIN_CONFIG.basic.check_template == 2) {
				errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.id, WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.emptyError, 'add')
			} else {
				alert(WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.emptyError);
			}            
            return false;
        } else {
			errorDisplay(WEBLOGIN_CUSTOM_ERRORCONFIG.wechatcaptcha.id);
		}
        
        form.login_type.value = 'captcha_login';
        document.getElementById('loginForm').submit();
        return false;
    }
	
	if(type == "noaccount_login") {//无账号登录		
		$('#uri').after('<input type=hidden id="original_url" name="original_url">');
        $("#original_url").val($("#uri").val());
        $("#uri").attr("disabled", 'disabled');  
		document.getElementById('loginForm').submit();	
		return false; 
	}
}

/**
 * @name placeHolder
 * @class 跨浏览器placeHolder,对于不支持原生placeHolder的浏览器，通过value或插入span元素两种方案模拟
 * @param {Object} obj 要应用placeHolder的表单元素对象
 * @param {Boolean} span 是否采用悬浮的span元素方式来模拟placeHolder，默认值false,默认使用value方式模拟
 */
function placeHolder(obj, span) {
    if (!obj.getAttribute('placeholder')) return;
    var imitateMode = span===true?true:false;
    var supportPlaceholder = 'placeholder' in document.createElement('input');
    if (!supportPlaceholder) {
        var defaultValue = obj.getAttribute('placeholder');
        if (!imitateMode) {
            obj.onfocus = function () {
                (obj.value == defaultValue) && (obj.value = '');
                obj.style.color = '';
            }
            obj.onblur = function () {
                if (obj.value == defaultValue) {
                    obj.style.color = '';
                } else if (obj.value == '') {
                    obj.value = defaultValue;
                    obj.style.color = '#ACA899';
                }
            }
            obj.onblur();
        } else {
            function changeHandler() {
                oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
            }
            /**
             * @name getStyle
             * @class 获取样式
             * @param {Object} obj 要获取样式的对象
             * @param {String} styleName 要获取的样式名
             */
            function getStyle(obj, styleName) {
                var oStyle = null;
                if (obj.currentStyle)
                    oStyle = obj.currentStyle[styleName];
                else if (window.getComputedStyle)
                    oStyle = window.getComputedStyle(obj, null)[styleName];
                return oStyle;
            }

            var placeHolderCont = document.createTextNode(defaultValue);
            var oWrapper = document.createElement('span');
            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
            oWrapper.className = 'wrap-placeholder';
            oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
            oWrapper.style.fontSize = '13px';// getStyle(obj, 'fontSize');
            oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
            oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop')) ? getStyle(obj, 'marginTop'): 1 + 'px';
            oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
			var left = getStyle(obj, 'marginLeft');
			left = left == 'auto' ?0:left;
            //oWrapper.style.width = obj.offsetWidth - parseInt(left) + 'px';
            oWrapper.style.height = obj.offsetHeight + 'px';
            oWrapper.style.lineHeight = obj.nodeName.toLowerCase()=='textarea'? '':obj.offsetHeight + 'px';
            oWrapper.appendChild(placeHolderCont);
            obj.parentNode.insertBefore(oWrapper, obj);
            oWrapper.onclick = function () {
                obj.focus();
            }
						//绑定input或onpropertychange事件
            if (typeof(obj.oninput)=='object') {
                obj.addEventListener("input", changeHandler, false);
            } else {
                obj.onpropertychange = changeHandler;
            }
            
        }
    }
}


function Fempty(v) {
    if (v != null && (typeof(v) == 'object' || typeof(v) == 'function'))
        return false;
    return (("" == v || undefined == v || null == v) ? true : false);
}

function FaddEvent(e, evt, fn, isID) {
    if (!Fempty(e.attachEvent) && (typeof(e.attachEvent) == "function" || typeof(e.attachEvent) == "object"))
        e.attachEvent("on" + evt, fn);
    else if (!Fempty(e.addEventListener) && (typeof(e.addEventListener) == "function" || typeof(e.addEventListener) == "object"))
        e.addEventListener(evt, fn, false);
}

function logout_unload() {
    if (isLogoutOnUnload === 'a1') {
        sendAjaxRequest('/login', 'login_type=logout_unload&t='+Math.random(), '', true, 'text');			
		alert(WEBLOGIN_CUSTOM_ERRORCONFIG.logout.offlineTip);
    } else {
		return true;
    }
}

function logout_beforeunload() {
//    if (isLogoutOnUnload == 'a0')
//        return true;
    if (isLogoutOnUnload == 'a1') {        
		alert(WEBLOGIN_CUSTOM_ERRORCONFIG.logout.confirmClosePageTip);
    }
}

// let all browser support placeholders
function initPlaceHolders(){
    if('placeholder' in document.createElement('input')){ //如果浏览器原生支持placeholder
        return ;
    }
    function target (e){
        var e=e||window.event;
        return e.target||e.srcElement;
    };
    function _getEmptyHintEl(el){
        var hintEl=el.hintEl;
        return hintEl && g(hintEl);
    };
    function blurFn(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var    emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            //el.__placeholderTimer=setTimeout(function(){//在360浏览器下，autocomplete会先blur再change
                if(el.value) emptyHintEl.style.display='none';
                else emptyHintEl.style.display='';
            //},600);
        }
    };
    function focusFn(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            emptyHintEl.style.display='none';
        }
    };
    if(document.addEventListener){//ie
        document.addEventListener('focus',focusFn, true);
        document.addEventListener('blur', blurFn, true);
    }
    else{
        document.attachEvent('onfocusin',focusFn);
        document.attachEvent('onfocusout',blurFn);
    }

    var elss=[document.getElementsByTagName('input'),document.getElementsByTagName('textarea')];
    for(var n=0;n<2;n++){
        var els=elss[n];
        for(var i =0;i<els.length;i++){
            var el=els[i];
            var placeholder=el.getAttribute('placeholder'),
                emptyHintEl=el.__emptyHintEl;
            if(placeholder && !emptyHintEl){
                emptyHintEl=document.createElement('span');
                emptyHintEl.innerHTML=placeholder;
                emptyHintEl.className='emptyhint';
                emptyHintEl.onclick=function (el){return function(){try{el.focus();}catch(ex){}}}(el);
                if(el.value) emptyHintEl.style.display='none';
                el.parentNode.insertBefore(emptyHintEl,el);
                el.__emptyHintEl=emptyHintEl;
            }
        }
    }
}
//FaddEvent(window, 'beforeunload', logout_unload, false);
//FaddEvent(window, 'unload', logout_unload, false);

//added for 认证前登陆页面

(function(){
		function doLayout() {
			$("#welcomeContainer").css('display', 'block');
		}

		var timer;
		var secs = 10;
		var isFinished = false;

		function auto_jump() {
			secs = secs-1;
			if(secs == 0){  
				clearInterval(timer);
				$("#welcomeContainer").fadeOut("slow");
				isFinished  = true;
			}else{   
				$("#welcome_time span").html(secs);
			}  
		}  

	  function initContainer() {
	  	if(document.getElementById('page_language') && document.getElementById('page_language').value == 'en'){
  				$("body").append(
						"<div id='welcomeContainer'>" + 
							"<div id='welcomeFrame'>" + 
						  "<iframe id='welcomeWin' style='width:100%; height:100%;overflow-x:hidden' frameborder='no' scrolling='scroll'></iframe>" + 
						  "</div>" +
					      "<input id='welcome_btn_go' type='button' class='welcome_btn_go' value='online' />" + 
							"<div id='welcomeTimeContainer' >" +
								"<div id='welcome_time' class='welcome_btn_time'>After <span>1</span> seconds, the page will automatically jump</div>" + 
							"</div>" +
						"</div>");
  		}else{
  				$("body").append(
						"<div id='welcomeContainer'>" + 
						"<div id='welcomeFrame'>" + 
						  "<iframe id='welcomeWin' style='width:100%; height:100%;overflow-x:hidden' frameborder='no' scrolling='scroll'></iframe>" + 
						"</div>" +
					      "<input id='welcome_btn_go' type='button' class='welcome_btn_go' value='继续上网' />" + 
							"<div id='welcomeTimeContainer' >" +
								"<div id='welcome_time' class='welcome_btn_time'><span>1</span> 秒后，页面将自动跳转</div>" + 
							"</div>" +
						"</div>");
  		}
		}
		function run(config) {
			if(!config.isWelcome) {
				return;
			} else {
				initContainer();
				doLayout();
			}
			//刷新窗口
			var obj = document.getElementById('welcomeWin');
			obj.src=config.url;

			if(config.timeOut && config.timeOut>0) {
				secs = config.timeOut;
				$("#welcome_time span").html(config.timeOut);
				//设置倒计时
				timer = setInterval('Welcome.auto_jump()', 1000);
				$("#welcome_btn_go").css('display', 'none');
				
			} else {
				$("#welcome_btn_go").click( function () {$("#welcomeContainer").css('display', 'none');isFinished  = true;});
				$("#welcomeTimeContainer").css('display', 'none');
			}
			$(window).resize(function(e) {
				if (isFinished) {
					return;
				}
				doLayout();
				obj.src=config.url;
			});					

		}
		window.Welcome = {
			run: run,
			auto_jump: auto_jump
		}
	})();
// Welcome.run({isWelcome: true,  timeOut: 30, url: '/push/t/ff0db2940ca536256d20eeadd5ed12a1/original.html'});

// for 上网时长
(function () {
	var _config = {};

	if(document.getElementById('page_language') && document.getElementById('page_language').value == 'en'){
		var strTotalOnlineTime = '总在线时间: ';
		var strQuotaTotalOnlineTime = '上网时长限额: ';
		var strRemainTotalOnlineTime = '上网剩余时间: ';
		var strTotalOnlineLonginNum = '已经上网次数: ';
		var strQuotaTotalOnlineLonginNum = '上网次数限额: ';
		var strRemainTotalOnlineTime = '剩余时间: ';
	} else {
		var strTotalOnlineTime = '总在线时间: ';
		var strQuotaTotalOnlineTime = '上网时长限额: ';
		var strRemainTotalOnlineTime = '上网剩余时间: ';
		var strTotalOnlineLonginNum = '已经上网次数: ';
		var strQuotaTotalOnlineLonginNum = '上网次数限额: ';
		var strRemainTotalOnlineTime = '剩余时间: ';
	}


	function formatTime(seconds) {
		var days = Math.floor(seconds / 86400);
		var hours = Math.floor((seconds - days*86400) / 3600);
		var minutes = Math.floor((seconds - days*86400- hours*3600) / 60);
		var secs = Math.floor(seconds - days*86400- hours*3600 - minutes*60);
		if(document.getElementById('page_language') && document.getElementById('page_language').value == 'en'){
				var str = '';
				if(days > 1) {
					str = str+days+'days';
				} else {
					str = str+days+'day';
				}
				
				if(hours > 1) {
					str = str+hours+'hours';
				} else {
					str = str+hours+'hour';
				}
				
				if(minutes > 1) {
					str = str+minutes+'minutes';
				} else {
					str = str+minutes+'minute';
				}
				
				if(secs > 1) {
					str = str+secs+'seconds';
				} else {
					str = str+secs+'second';
				}
				return str;
		} else {
			
			var str = "{d}天{h}小时{m}分钟{s}秒";
			str = str.replace('{d}', days);
			str = str.replace('{h}', hours);
			str = str.replace('{m}', minutes);
			str = str.replace('{s}', secs);
			return str;
		}
	}
	function getEI(id) {
		return document.getElementById(id);
	}

	function onlineLonginTime() {		
		getEI('totalOnlineTime').innerHTML = formatTime(_config.totalOnlineTime);
		getEI('quotaTotalOnlineTime').innerHTML = formatTime(_config.quotaTotalOnlineTime);
		getEI('remainTotalOnlineTime').innerHTML = formatTime(_config.remainTotalOnlineTime);
	}

	function onlineLoginNum() {
		getEI('totalOnlineLoginNum').innerHTML = _config.totalOnlineLonginNum;
		getEI('quotaTotalOnlineLoginNum').innerHTML = _config.quotaTotalOnlineLonginNum;
	}

	function refreshOnlineTime() {
		
		_config.remainTotalOnlineTime--;
		_config.remainTotalOnlineTime = _config.remainTotalOnlineTime <=0 ? 0:_config.remainTotalOnlineTime;

		_config.totalOnlineTime++;

		if(_config.remainTotalOnlineTime<=0) {
			submitbutton('logout');
		}
		getEI('remainTotalOnlineTime').innerHTML = formatTime(_config.remainTotalOnlineTime);
		getEI('totalOnlineTime').innerHTML = formatTime(_config.totalOnlineTime);
	}
	/**
			totalOnlineTime: 2000,    在线时长
			quotaTotalOnlineTime:0,   时长阈值
			totalOnlineLonginNum: 10,     登录次数
			quotaTotalOnlineLonginNum:0   登录次数阈值
			hiddenCallback: callback      未开启功能是隐藏的函数
	**/
	function run(config) {

		_config = config;
		_config.remainTotalOnlineTime = _config.quotaTotalOnlineTime - _config.totalOnlineTime;

		if(_config.quotaTotalOnlineLonginNum<=0 && _config.quotaTotalOnlineTime <= 0) {						
			
			_config.hiddenCallback();
		}
		if(_config.quotaTotalOnlineLonginNum>0) {
			onlineLoginNum()
		} else {
			for(var i=0; i<2; i++) {
			
				getEI('onlineLoginNumTr_'+i).style.display = 'none'
			}
		}
		if(_config.quotaTotalOnlineTime>0) {
			onlineLonginTime();
			setInterval(refreshOnlineTime, 1000);
		} else {
			for(var i=0; i<3; i++) {
			
				getEI('onlineTimeTr_'+i).style.display = 'none'
			}
		}
	}

	window.NsOnline = {
		onlineLonginTime: onlineLonginTime,
		onlineLoginNum : onlineLoginNum,
		refreshOnlineTime: refreshOnlineTime,
		run: run,
		version: '1.0.0'
	}

})();

(function(){
		function doLayout() {
			$("#readContainer").css('display', 'block');

			function getWidth() {
				var sw=0;
				return $(window).width();
			}

			function getHeight() {
				return $(window).height();
			}
			var height = 601;
			var width = 801;
			var top = (getHeight() - height) / 2;
			var left = (getWidth() - $("#readContainer").width()) / 2;
			$("#readContainer").css('left', left);
			$("#readContainer").css('top', top);
		
		}

	  function initContainer() {
	  	if(document.getElementById('page_language') && document.getElementById('page_language').value == 'en'){
  				$("body").append(
						"<div id='readContainer'>" + 
						  "<iframe id='readWin' style='width:100%; height:550px;overflow-x:hidden' frameborder='no' scrolling='scroll'></iframe>" + 
					      "<input id='read_btn_go' type='button' class='read_btn_go' value='agree' />" + 
						"</div>");
  		}else{
  				$("body").append(
						"<div id='readContainer'>" + 
						  "<iframe id='readWin' style='width:100%; height:550px;overflow-x:hidden' frameborder='no' scrolling='scroll'></iframe>" + 
					      "<input id='read_btn_go' type='button' class='read_btn_go' value='同意' />" + 
						"</div>");
  		}
		}
		function run(config) {
			if(!config.isRead) {
				return;
			} else {
				initContainer();
				doLayout();
			}
			//刷新窗口
			var obj = document.getElementById('readWin');
			obj.src=config.URL;			

			$("#read_btn_go").click( function () {$("#readContainer").css('display', 'none');isFinished  = true;});
		}
		window.Read = {
			run: run
		}
	})();
	
	function requestSig(){
    if(document.getElementById('goMobile')){
            document.getElementById('goMobile').hidden = true;
    }
    if(document.getElementById('goPC')){
            document.getElementById('goPC').hidden = true;
    }
    sendSigAjaxRequest('/nsblockpush?type=nat', '', function(res){
				var result;
        if(typeof(JSON) == 'undefined'){
            result = eval("("+res+")");
        }else{
            result = JSON.parse(res);
        }
        var start = parseInt(result.starttime) * 1000;
        var end = parseInt(result.endtime) * 1000;
        
        var datestart = new Date(start);
        var yearstart = datestart.getFullYear();
        var monthstart = datestart.getMonth()+1;
        var daystart = datestart.getDate();
        var hourstart = datestart.getHours();
        var minutestart = datestart.getMinutes();
        var secondstart = datestart.getSeconds();
        if(hourstart < 10){
            hourstart = '0' + hourstart;
        }
        if(minutestart < 10){
            minutestart = '0' + minutestart;
        }
        
        var dateend = new Date(end);
        var yearend = dateend.getFullYear();
        var monthend = dateend.getMonth()+1;
        var dayend = dateend.getDate();
        var hourend = dateend.getHours();
        var minuteend = dateend.getMinutes();
        var secondend = dateend.getSeconds();
        if(hourend < 10){
            hourend = '0' + hourend;
        }
        if(minuteend < 10){
            minuteend = '0' + minuteend;
        }
        
        document.getElementById('start').innerHTML = yearstart + '年' + monthstart + '月' +  daystart +  '日  ' + hourstart + ':' +  minutestart;
        document.getElementById('end').innerHTML = yearend + '年' + monthend + '月' +  dayend +  '日  ' + hourend + ':' +  minuteend;
        
        if(document.getElementById('goMobile')){
      		document.getElementById('goMobile').hidden = true;
      	}
      	if(document.getElementById('goPC')){
      		document.getElementById('goPC').hidden = true;
      	}
    }, true, 'text');
 };

function init(){
		//如果wx_retry_clock为begin，则说明计时器未工作；否则执行计时器
    if (GetCookie('wx_retry_clock') === 'begin') {
				document.getElementById('get_password_button').value = '短信获取密码';
    		document.getElementById('get_password_button').disabled = false;
    } else {
    		//关闭浏览器或刷新页面时，重置倒计时
    		//cookie记录开始时间
        var wx_retry_clock_start = GetCookie('wx_retry_clock_start');
        //cookie值
        var wx_retry_clock = GetCookie('wx_retry_clock');
        if(wx_retry_clock == '' || wx_retry_clock_start == ''){
        		setTimeout("wx_retry_clock()", 500);
        }else{
        		var now = new Date();
            now = now.getTime();
            var diff = now - wx_retry_clock_start;
            diff = Math.floor(diff/1000);
            if(wx_retry_clock - diff > 0){
            		wx_retry_clock = wx_retry_clock - diff;
            		SetCookie('wx_retry_clock', wx_retry_clock, wx_retry_clock);
				        var now = new Date();
								SetCookie('wx_retry_clock_start', now.getTime(), wx_retry_clock);
								setTimeout("wx_retry_clock()", 500);
            }
        }
    }
}

function wx_retry_clock() {
    var wx_retry_clock = (GetCookie('wx_retry_clock') === 'begin') ? 60 : GetCookie('wx_retry_clock');
    if (wx_retry_clock > 0) {
        document.getElementById('get_password_button').style.color = '#CDCDCD';
        var button_value = wx_retry_clock + "秒后重新获取";
        document.getElementById('get_password_button').value = button_value;
        document.getElementById('get_password_button').disabled = true;
        block_settimeout = setTimeout("wx_retry_clock()", 1000);
        wx_retry_clock = wx_retry_clock - 1;
        SetCookie('wx_retry_clock', wx_retry_clock, wx_retry_clock);
        var now = new Date();
				SetCookie('wx_retry_clock_start', now.getTime(), wx_retry_clock);
    } else {
        document.getElementById('get_password_button').style.color = '#FFFFFF';
        document.getElementById('get_password_button').value = '短信获取密码';
        document.getElementById('get_password_button').disabled = false;
        SetCookie('wx_retry_clock', 'begin');
        clearTimeout(block_settimeout);
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
function getWXShortMessagePasswordByAjax(url, param, callback, sync, type) {
		$.ajax({
				type: "POST",
				url: "/login",
				data: param,
				success: function(response){
			      var msg;
            switch (response) {
                case '0':
                    var telephone = document.getElementById('nsWXPhone').value;
                    telephone = decodeURIComponent(telephone);
                    msg = "密码已成功发送至手机" + telephone + "，请检查";
                    break;
                case '1':
                    msg = "您输入的手机号码不能进行短信认证，如有需要，请联系管理员";
                    break;
                case '2':
                    msg = "已超过每天发送短信个数限制";
                    break;
                case '3':
                    msg = "认证策略中没有配置短信服务器";
                    break;
                case '4':
                    msg = "找不到服务器";
                    break;
                case '5':
                    msg = "短信内容配置错误";
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
                    msg = "发送失败";
            }
            if (response != '0') {
                document.getElementById('get_password_button').style.color = '#FFFFFF';
                document.getElementById('get_password_button').value = '短信获取密码';
                document.getElementById('get_password_button').disabled = false;
                SetCookie('wx_retry_clock', 'begin');
                clearTimeout(block_settimeout);
                refreshCaptcha();
            }
            alert(msg);
			  }
		});
}

//获取短信密码
function getWXPassword(){
		var f = document.getElementById('registerForm');
		if(!CheckUtil.checkEmpty(f.nsWXPhone.value)){
				alert("请填写手机号");
				return false;
		}
		if(!CheckUtil.checkMobile(f.nsWXPhone.value)){
				alert("请填写正确的手机号");
				return false
		}
		
		SetCookie('wx_retry_clock', 'begin');
    wx_retry_clock();
    if (GetCookie('wx_retry_clock') == 59) {
        f.login_type.value = "getcode";
        var params = {code_type:'2',login_type: 'getcode', username: encodeURIComponent(f.nsWXPhone.value), assure_phone: f.nsWXPhone.value};
        getWXShortMessagePasswordByAjax('/login', params, '', true, 'text');
    }
}

//生成客户端唯一标识ID
function getClientID(){
		var client_id = GetCookie('client_id');
		if(client_id == '' || client_id == null){
				client_id = new Date().getTime().toString();
				client_id = client_id.substring(4, 10);
				var r = Math.floor(Math.random()*(999-100)+ 100).toString();
				client_id = r + client_id;
				SetCookie('client_id', client_id);
		}
		return client_id;
}

//获取二维码图片
function getQRCodeByAjax() {
		var client_id = getClientID();
		$.ajax({
				type: "POST",
				url: "/login",
				data: {login_type: 'getqrcode', client_id: client_id},
				dataType: 'json',
				success: function(response){
						if(response.scene_id){
								var qrcode_image_default = document.getElementById("qrcode_img_default");
								var qrcode_image_div = document.getElementById("qrcode_div");
								
								var scene_id = response.scene_id;
								var img_url = response.qrcode;
								var img_class = qrcode_image_default.className;
								
								var img = '<img id="qrcode_img" onload="replaceQrcodeImgAfterLoadSuccess(\''+scene_id+'\');" onerror="replaceQrcodeImgAfterLoadFailure();"  src="'+img_url+'" class="'+img_class+'">';
								qrcode_image_div.innerHTML = img;
						}else{
								replaceQrcodeImgAfterLoadFailure();
						}
			  }
		});
}

//生成二维码初始化
function qrcodeInit(){
		time_int = 0;
		getQRCodeByAjax();
}

//二维码加载成功后，替换默认图片
function replaceQrcodeImgAfterLoadSuccess(scene_id){		
		var qrcode_image_default_div = document.getElementById("qrcode_default_div");
		var qrcode_image_div = document.getElementById("qrcode_div");
		
		qrcode_image_default_div.style.display = "none";
		qrcode_image_div.style.display = "block";
		
		//判断当前是否有验证进程已经存在
		if(GetCookie('checkQRcodeFlag')){
				var contab = setInterval(function(){
						if(!GetCookie('checkQRcodeFlag')){
								clearInterval(contab);
								checkQRCodeByAjax(scene_id);
						}
				}, 1000);
				return ;
		}else{
				checkQRCodeByAjax(scene_id);
		}
}

//二维码加载失败后，替换默认图片
function replaceQrcodeImgAfterLoadFailure(){
		var qrcode_image_default_div = document.getElementById("qrcode_default_div");
		var qrcode_image_div = document.getElementById("qrcode_div");
		
		qrcode_image_default_div.style.display = "block";
		qrcode_image_div.style.display = "none";
	
		var qrcode_image_default = document.getElementById("qrcode_img_default");
		var qrcode_image_notice = document.getElementById("displaychat");
		
		if(document.getElementById('qrcode_page_language').value=="zh") {
			qrcode_image_default.src = "/images/weblogin/pre_qrcode_failure.gif";
			qrcode_image_notice.innerHTML = "二维码获取失败<br>请刷新后重新扫描";

		} else {
			qrcode_image_default.src = "/images/weblogin/en_pre_qrcode_failure.gif";
			qrcode_image_notice.innerHTML = "Two dimensional code failed to get <br> refresh and re scan";
		}		

		qrcode_image_default.onclick = function(){
				reloadQRCodeImg();
		}
		
}

//获取二维码失败后重新获取二维码
function reloadQRCodeImg(){
		var qrcode_image_default = document.getElementById("qrcode_img_default");
		var qrcode_image_notice = document.getElementById("displaychat");
		
		if(document.getElementById('qrcode_page_language').value=="zh") {
			qrcode_image_default.src = "/images/weblogin/pre_qrcode.gif";

		} else {
			qrcode_image_default.src = "/images/weblogin/en_pre_qrcode.gif";
		}
		
		qrcode_image_default.onclick = function(){}
		
		if(document.getElementById('page_language').value == 'en') {
				qrcode_image_notice.innerHTML = WEBLOGIN_CONFIG.notice.qrcode_content_eng;
		} else {
				qrcode_image_notice.innerHTML = WEBLOGIN_CONFIG.notice.qrcode_content;
		}
		
		DelCookie('client_id');
		qrcodeInit();
}

//二维码时间过长，失效后动作
function AfterQRCodeOverdue(){
		var qrcode_image_default_div = document.getElementById("qrcode_default_div");
		var qrcode_image_div = document.getElementById("qrcode_div");
		
		qrcode_image_default_div.style.display = "block";
		qrcode_image_div.style.display = "none";
	
		var qrcode_image_default = document.getElementById("qrcode_img_default");
		var qrcode_image_notice = document.getElementById("displaychat");
		if(document.getElementById('qrcode_page_language').value=="zh") {
			qrcode_image_default.src = "/images/weblogin/pre_qrcode_dead.gif";
			qrcode_image_notice.innerHTML = "二维码已过期<br>请刷新后重新扫描";
		} else {
			qrcode_image_default.src = "/images/weblogin/en_pre_qrcode_dead.gif";
			qrcode_image_notice.innerHTML = "The two-dimensional code has expired <br> please refresh and re scan";
		}
		qrcode_image_default.onclick = function(){
				reloadQRCodeImg();
		}
		
		return false;
}

//验证扫描二维码后的用户是否上线
var time_int = 0;
function checkQRCodeByAjax(scene_id) {
		//alert('check')
		if(time_int > 11){
				AfterQRCodeOverdue();
				return false;
		}
		
		SetCookie('checkQRcodeFlag', true, 12);
		$.ajax({
				type: "POST",
				url: "/login",
				data: {login_type: 'checkqrcode', scene_id: scene_id},
				dataType: 'json',
				success: function(response){
			      if(response.open_id){
		        		DelCookie('checkQRcodeFlag');
		        		afterQRCodeTickScan(response, scene_id)
		        }else{
		        		time_int++;
		        		checkQRCodeByAjax(scene_id);
		        }
			  }
		});
}

//用户成功扫描二维码并已经上线后动作
function afterQRCodeTickScan(response, scene_id) {
		var open_id = response.open_id;
		var nickname = response.nickname;
		$("#qrcode_username").val(open_id);
		$("#qrcode_scene_id").val(scene_id);
		$("#qrcode_nickname").val(nickname);
		$("#qrcodeForm").submit();
}

//注册动作
function registerInfo(){
		var f = document.getElementById('registerForm');
		f.login_type.value = "register";
		var webauthtype=document.createElement("hidden");
		webauthtype.id='webauthtype';
		webauthtype.name='webauthtype';
		webauthtype.value = "5";
		f.appendChild(webauthtype);
		
		//获取页面中显示的注册信息
		var params = f.params.value;
		var params_arr = [];
		if(params != ''){
				params_arr = params.split(",");
		}
				
		//获取注册信息中的必填项
		var required_params = f.required_params.value;
		var required_params_arr = []
		if(required_params != ''){
				required_params_arr = required_params.split(",");
				if(f.check_password && f.check_password.value == '1'){
						params_arr.push('password1');
						required_params_arr.push('password1');
				}
		}
		
		//校验信息的有效性
		for(var i=0, len=params_arr.length; i<len; i++){
				var p = params_arr[i];
				var p_value = document.getElementById(p).value;
				var p_placeholder = document.getElementById(p).placeholder;
				
				switch(params_arr[i]){
						case 'nsWXPhone':
								if(CheckUtil.checkQuired(required_params_arr, p) && !CheckUtil.checkEmpty(p_value)){
										alert("请填写手机号");
										return false;
								}
								if(CheckUtil.checkEmpty(p_value) && !CheckUtil.checkMobile(p_value)){
										alert("请填写正确的手机号");
										return false
								}
								if(f.check_password.value == '1'){
										if(trim(f.password1.value) == ''){
												alert("请填写短信密码");
												return false;
										}
										document.getElementById('password').value = md6(f.password1.value);
								}
						break;
						case 'nsWXIDNumber':
								if(CheckUtil.checkQuired(required_params_arr, p) && !CheckUtil.checkEmpty(p_value)){
										alert("请填写身份证号");
										return false;
								}
								if(CheckUtil.checkEmpty(p_value) && !CheckUtil.checkIdentityCard(p_value)){
										alert('请填写正确的身份证号');
										return false;
								}
						break;
						case 'nsWXBirthday':
								if(CheckUtil.checkQuired(required_params_arr, p) && !CheckUtil.checkEmpty(p_value)){
										alert("请填写生日");
										return false;
								}
								if(CheckUtil.checkEmpty(p_value) && !CheckUtil.checkDate(p_value)){
										alert('请填写正确的生日日期');
										return false;
								}
						break;
						case 'nsADEmail':
								if(CheckUtil.checkQuired(required_params_arr, p) && !CheckUtil.checkEmpty(p_value)){
										alert("请填写电子邮件地址");
										return false;
								}
								if(CheckUtil.checkEmpty(p_value) && !CheckUtil.checkEmail(p_value)){
										alert('请填写正确的电子邮件地址');
										return false;
								}
						break;
						case 'nsWXSex':
								for(var i=0; i<f.sex.length; i++){
									if(f.sex[i].checked){
										document.getElementById('nsWXSex').value = f.sex[i].value;
									}
								}
						break;
						default:
								if(CheckUtil.checkQuired(required_params_arr, p) && !CheckUtil.checkEmpty(p_value)){
										var tip = "请填写" + p_placeholder;
										alert(tip);
										return false;
								}
								if(CheckUtil.checkEmpty(p_value) && !CheckUtil.checkString(p_value)){
										var tip = p_placeholder + "只能输入字母、数字、中文、下划线";
										alert(tip);
										return false
								}
						break;								
				}
		}
		f.submit();
}

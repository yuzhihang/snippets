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
		if(window.XMLHttpRequest) { //Mozilla 浏览器
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {//设置MiME类别
				http_request.overrideMimeType('text/xml');
			}
		}else if (window.ActiveXObject) { // IE浏览器
			try {
					http_request = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						http_request = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
			}
			if (!http_request) { // 异常，创建对象实例失败
				window.alert("不能创建XMLHttpRequest对象实例.");
				return false;
			}else{
				return http_request;
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
function sendAjaxRequest(url, param, callback,sync,type) {
	var req = getXMLRequest();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == READY_STATE_COMPLETE) {
				if( req.status == 200){
					var response;
					if(type=="text"){
						response = req.responseText;
					}else if(type=="xml"){						
						response = req.responseXML;
					}
					
					//alert(response);
					
					delete req;
					req = null;
				}
			} 
		}
		req.open("post",url,sync);
		req.setRequestHeader('If-Modified-Since', '0'); //清除缓存
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		try{
			req.send(param);
		}catch(e){
			alert("发送请求出错。");
		}
	}
}

function sendSigAjaxRequest(url, param, callback,sync,type) {
	var req = getXMLRequest();
	if(req) {
		req.onreadystatechange = function() {
			if(req.readyState == READY_STATE_COMPLETE) {
				if( req.status == 200){
					var response;
					if(type=="text"){
						response = req.responseText;
					}else if(type=="xml"){						
						response = req.responseXML;
					}
					
					//alert(response);
					callback(response);
					delete req;
					req = null;
				}
			} 
		}
		req.open("get",url,sync);
		req.setRequestHeader('If-Modified-Since', '0'); //清除缓存
		req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		try{
			req.send(param);
		}catch(e){
			alert("发送请求出错。");
		}
	}
}

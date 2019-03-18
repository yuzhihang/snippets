    /**
     * 微信连Wi-Fi协议3.1供运营商portal呼起微信浏览器使用
     */
    var loadIframe = null;
    var noResponse = null;
    var callUpTimestamp = 0;
     
    function putNoResponse(ev){
         clearTimeout(noResponse);
    }   
    
    function errorJump(){
        var now = new Date().getTime();
        if((now - callUpTimestamp) > 4*1000){
         return;
        }
        alert('该浏览器不支持自动跳转微信请手动打开微信\n如果已跳转请忽略此提示');
    }

    myHandler = function(error) {
        errorJump();
    };

    function createIframe(){
        var iframe = document.createElement("iframe");
        iframe.style.cssText = "display:none;width:0px;height:0px;";
        document.body.appendChild(iframe);
        loadIframe = iframe;
    }
    //注册回调函数
    function jsonpCallback(result){
        var svg = document.getElementById('svg');
        if(svg){
            svg.style.display = 'none';
        }
        if(result && result.success){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("iphone") != -1 || ua.indexOf("ipod") != -1 || ua.indexOf("ipad") != -1) {   //iPhone             
                var versionArr = ua.match(/os (.*?) like mac os/i)[1].split('_');
                if ((parseInt(versionArr[0]) == 11 && parseInt(versionArr[1]) >= 3) || parseInt(versionArr[0]) > 11 ) {
                    var aLink = document.createElement('a');
                    aLink.href = '/login/ios_jump.html?weixin_jump_url=' + encodeURIComponent(result.data);
                    document.body.appendChild(aLink);
                    aLink.click();
                } else {
                    document.location = result.data;
                }
            } else {
                
                // if('false'=='true'){
                //     alert('[强制]该浏览器不支持自动跳转微信请手动打开微信\n如果已跳转请忽略此提示');
                //     return;
                // }
                
                createIframe();
                callUpTimestamp = new Date().getTime();
                loadIframe.src = result.data;
                noResponse = setTimeout(function () {
                    errorJump();
                }, 3000);
            }              
        }else if(result && !result.success){
            alert(result.data);
        }
    }
    function GetQueryString(name) {  
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);
        var context = "";  
        if (r != null)  
             context = r[2];  
        reg = null;  
        r = null;  
        return context == null || context == "" || context == "undefined" ? "" : decodeURIComponent(context);
    }
    var _WIFI_SSID = GetQueryString('ssid');
    var _WIFI_ANDROID_SETTINGS = GetQueryString('android_settings');
    //var _WIFI_LOGINPAGE_CONFIG_HREF = _WIFI_LOGINPAGE_SSID_LIST[_WIFI_SSID] || '';

    function Wechat_GotoRedirect(phone){

        var appId = GetQueryString('appid');
        var extend = 'type_wxwifi.tool_mobile'+ ((phone && typeof phone != 'undefined') ?'.phone_'+ phone : '');
        var timestamp = new Date().getTime();
        var shopId = GetQueryString('shopid');
        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
        var origin = document.location.origin;
        if(origin.substr(0, 5) == 'https') {
            origin=origin.replace('https', 'http');
            origin=origin.replace('4430', '90');
        }
        var authUrl = origin + '/login';
        
        var mac = GetQueryString('mac');
        var ssid = GetQueryString('ssid');
        var secretkey = GetQueryString('secretkey');
        var sign = $.md5(appId + extend + timestamp + shopId + authUrl + mac + ssid + secretkey);
        
        //将回调函数名称带到服务器端
        //var url = "https://wifi.weixin.qq.com/operator/callWechatBrowser.xhtml?appId=" + appId + "&extend=" + extend + "&timestamp=" + timestamp + "&sign=" + sign;  
        
        //如果sign后面的参数有值，则是新3.1发起的流程
        //if(authUrl && shopId){        
            var url = "https://wifi.weixin.qq.com/operator/callWechat.xhtml?appId=" + appId 
                                                                            + "&extend=" + extend 
                                                                            + "&timestamp=" + timestamp 
                                                                            + "&sign=" + sign
                                                                            + "&shopId=" + shopId
                                                                            + "&authUrl=" + encodeURIComponent(authUrl)
                                                                            + "&mac=" + mac
                                                                            + "&ssid=" + encodeURIComponent(ssid);
            
        //}           
        
        //通过dom操作创建script节点实现异步请求  
        var script = document.createElement('script');  
        script.setAttribute('src', url);  
        document.getElementsByTagName('head')[0].appendChild(script);
        var svg = document.getElementById('svg');
        if(svg){
            svg.style.display = 'inline-block';
        }
    }
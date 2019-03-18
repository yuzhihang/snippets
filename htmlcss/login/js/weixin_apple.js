//for 微信认证是portal弹窗
(
	function() {
		function run() {
			var iframe = document.createElement('iframe');
			iframe.id = 'testforweixin';
			iframe.name = 'testforweixin';
			iframe.width = 0;
			iframe.height = 0;
			iframe.frameBorder = 0;
			iframe.style.display = "none";
			
			var href_url = window.location.href;
            var pos = href_url.indexOf("/p")

			var _url = href_url.substring(0, pos);
			var url =  _url + "/weixin/register.php";
			iframe.src = url;
			
			if(0) {
			    alert(href_url);
			    alert(_url);
			    alert(url);
			}

			var count =0;
			var fn = function() { 
				/*function iframe_reload() {
					if(count == 0) {
						iframe.src = url + "?count=2";
						count++;
						//alert('onload');
					}
                }
                setTimeout("iframe_reload()", 3000);*/
			};
			if (iframe.attachEvent) {
				iframe.attachEvent('onload', fn);
			} else {
				iframe.onload = fn;
			}
			//document.body.insertBefore(iframe, document.body.firstChild);
			document.body.appendChild(iframe);
		}

		window.weinxinplugin = {
			run: run
		}

		weinxinplugin.run();
	}
)();
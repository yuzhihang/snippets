WEBLOGIN_CUSTOM_ERRORCONFIG = {
    requestError: '发送请求出错',
	requestObjError: '不能创建XMLHttpRequest对象实例！',
    web: {
        account: {
            id: 'username',
            emptyError: '请输入登录账号！',
            lengthError: '登录账号不能超过128个字符！'
        },
        passwd: {
            id: 'password1',
            emptyError: '请输入密码！'
        },
		readcheck: '您需要阅读并同意此上网服务条款'
    },
    sms: {
        account: {
            id: 'username',
            emptyError: '请填写手机号！',
            lengthError: '登录账号不能超过40个字符',
            illegalAccountError: '登录账号只能输入字母、数字、中文、下划线',
            illegalPhoneError: '请填写正确格式的手机号！'
        },
        passwdbutton: {
			id: 'get_password_button',
			text: '获取密码',
            successMsg: '密码已成功发送至手机{telephone},请检查',
            illegalError: '您输入的手机号码不能进行短信认证，如有需要，请联系管理员',
            limitError: '已超过每天发送短信个数限制',
            serverError: '认证策略中没有配置短信服务器',
            noserverError: '找不到服务器',
            msgSetError: '短信内容配置错误',
            frequencyError: '发送频率过快，请稍后再试',
            failure: '发送失败',
			requestingText: '{clock}秒后重新获取'
        },
        captcha: {
            id: 'captcha_value',
            emptyError: '请输入验证码！',
            responseCaptchaError: '验证码获取失败，请重新刷新页面获取！',
            checkCaptchaError: '验证码错误！'
        }
    },
	noaccount: {
		buttonText: '已经认证过，点击继续上网'
	},
    changepasswd: {
        account: {
            id: 'username',
            emptyError: '请输入用户名！'
        },
        passwd: {
            id: 'password1',
            emptyError: '请输入密码！'
        },
        newpasswd: {
            id: 'new_password',
            emptyError: '请输入新密码！'
        },
        renewpasswd: {
            id: 'retype_newpassword',
            emptyError: '请输入确认密码！'
        },
        pass_check1: '新密码不允许等于用户名',
        pass_check2: '新密码不允许等于旧密码',
        pass_check3: '新密码最小长度为',
        pass_checknum: '新密码必须包含数字',
        pass_checkletter: '新密码必须包含字母',
        pass_checkcharacter: '新密码必须包含特殊字符（shift+数字）',
        sameError: '新密码与老密码相同，请重新输入！',
        confirmError: '新密码与确认密码不符，请重新输入！'
    },
    passwdcomplexity: {
        error1: '密码复杂度不够，必须包含大小写字母、数字、特殊字符，并且长度不小于8位，请重新输入',
        error2: '密码不能为连续的数字',
        error3: '密码不能为连续的字母',
        error4: '密码不能为重复的数字或字母',
        error5: '密码只能是数字和字母的组合'
    },
    wechatcaptcha: {
        id: 'wx_captcha',
        emptyError: '请输入微信验证码！'
    },
    logout:{
        offlineTip: '您已经下线!'
    }
};
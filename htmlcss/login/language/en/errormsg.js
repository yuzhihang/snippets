WEBLOGIN_CUSTOM_ERRORCONFIG = {
    requestError: 'Send the request error!',
	requestObjError: 'Failed to create the XMLHttpRequest object!',
    web: {
        account: {
            id: 'username',
            emptyError: 'Please enter the login account!',
            lengthError: 'Login account cannot be more than 128 characters!'
        },
        passwd: {
            id: 'password1',
            emptyError: 'Please enter the password!'
        },
		readcheck: 'Please read and accept the service rule'
    },
    sms: {
        account: {
            id: 'username',
            emptyError: 'Please enter the telephone number!',
            lengthError: 'Login account cannot be more than 40 characters!',
            illegalAccountError: 'Login account can only enter letters, Numbers, Chinese character, underlined!',
            illegalPhoneError: 'please enter the correct format phone number!'
        },
        passwdbutton: {
			id: 'get_password_button',
			text: 'SMS Password',
            successMsg: 'The password has been successfully sent to mobile phones {telephone}, please check',
            illegalError: 'You enter the phone number cannot be message authentication, if necessary, please contact your administrator',
            limitError: 'For more than a day send SMS number limit',
            serverError: 'No configuration message server authentication strategy',
            noserverError: 'Can not find a server',
            msgSetError: 'Message content configuration errors',
            frequencyError: 'Send too many times,try again later please',
            failure: 'Send failure!',
			requestingText: 'After {clock} seconds to obtain again'
        },
        captcha: {
            id: 'captcha_value',
            emptyError: 'Please enter the verification code!',
            responseCaptchaError: 'The verification code failed to fetch. Please refresh the page again!',
            checkCaptchaError: 'Verification code error!'
        }
    },
	noaccount: {
		buttonText: 'click to login'
	},
    changepasswd: {
        account: {
            id: 'username',
            emptyError: 'Please enter the login account!'
        },
        passwd: {
            id: 'password1',
            emptyError: 'Please enter the password!'
        },
        newpasswd: {
            id: 'new_password',
            emptyError: 'Please enter the new password!'
        },
        renewpasswd: {
            id: 'retype_newpassword',
            emptyError: 'Please enter the confirmation password!'
        },
        pass_check1: 'The new password is not allowed to equal the user name',
        pass_check2: 'The new password is not allowed to be equal to the old password',
        pass_check3: 'The minimum length of the new password is ',
        pass_checknum: 'The new password must contain numbers',
        pass_checkletter: 'The new password must contain letters',
        pass_checkcharacter: 'The new password must contain special characters(shift+number)',
        sameError: 'The new password is the same as the old password, please enter again!',
        confirmError: 'The new password and confirm password does not conform to, please enter again!'
    },
    passwdcomplexity: {
        error1: 'Password complexity is not enough, must contain lowercase letters, Numbers, special characters, and length of not less than 8 bits, please enter again!',
        error2: 'Password can\'t for consecutive Numbers!',
        error3: 'Password cannot be consecutive letters!',
        error4: 'Password cannot be duplicate Numbers or letters!',
        error5: 'The password can only be a combination of Numbers and letters!'
    },
    wechatcaptcha: {
        id: 'wx_captcha',
        emptyError: 'Please enter the wechat captcha!'
    },
    logout:{
        offlineTip: 'You are offline!'
    }
};
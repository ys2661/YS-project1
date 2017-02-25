
;
(function($, window, undefined) {
    var rss = window.rss;
    var localInfo = window.localInfo;
    var reqClientType = localInfo.reqClientType;
    
    var userInfo = {
		oldUserAccount: "",
		oldAuthCode: "",
		newAccountType: "",
		newUserAccount: "",
		newAuthCode: "",
		EmailType:""
	};  
	    	
	//用户账户信息
	var userAcctInfoData = {};

    var openAuthenDialog = function(param) {
        var accountInfoArr = [];
        var htmlStr = '';
        var useraccount = param.queryCond;
        var type = param.optType;
        var desc = param.desc;
        var userID = "";
        
        // 用户账号归属 站点号
        var accountSiteID = param.siteID;
        
        if (type == "bind" || type == "change" || type == "unbind") {
            getAccountInfo(useraccount, 2, function(data) {
                accountInfoArr = data;
            },localInfo.accountType);
        } else if (type == "secondAuth" || type == "identifyVerify") {
            getAccountInfo(useraccount, 0, function(data, userID) {
                accountInfoArr = data;
                localInfo.userID = userID;
            },localInfo.accountType);
        }
        //绑定时，如果该帐号没有绑定任何手机和邮箱时，则使用密码验证
        if (type == "bind" && accountInfoArr.length == 0) {
            $("<div>").Dialog({
                title : rss.verifyLoginPwd,
                btnRight : {
                    text : param.rBtnTxt,
                    fn : function() {
                        var self = this;
                        var pwd = $("#password").val();
                        var accountType = localInfo.accountType;
                        verifyPwd(accountType,useraccount, pwd, function() {
                            self.hide();
                            var oldAccountObj = {
                                oldAccountType : 0,
                                oldUserAccount : useraccount,
                                password : pwd
                            };
                            param.callbackFn.call(this, oldAccountObj);
                        });

                    }
                },
                btnLeft : {
                    text : rss.cancel_btn,
                    fn : function() {
                    }
                },
                dialogStyle: localInfo.msgDialogStyle,
                html : '<span>'+rss.huaweiAccount_colon_space + getExpressPhone(useraccount) + '</span><div class="dinput"><span><input id="password" type="password" placeholder="'+rss.inputLingPwd+'"></span></div><p id="error_info"></p>'

            }).Dialog('show');

        } else {
        	if (desc && desc.length > 0)
        	{
        		htmlStr += '<div id="authenDialog"><p class="inptips2">' + desc + '</p>';
        	}
        	else
        	{
        		htmlStr += '<div id="authenDialog"><p class="inptips2" style="margin-top:-30px;"></p>';
        	}
            
            htmlStr += '<div id="getAuthCodeBtn" intervaltime="60" class="dbtn2 sbtn r"><span>'+rss.sendAuthCode+'</span><div id="authCodeError"></div></div>';
            htmlStr += '<div id="accountDiv" class="sdrop"><p id="selector_error_info"></p></div>';

            var items = [];
            if (accountInfoArr) {
                $.each(accountInfoArr, function(n, value) {   
                        var item = {
                            value : JSON.stringify({
                            	type:value.accountType,
                            	account:value.userAccount
                            }),
                            label : getExpressPhone(value.userAccount)
                        };
                        items.push(item);            
                });
            }

            htmlStr += '<div class="dinput"><input type="text" id="oldAuthCode" placeholder="'+rss.inputAuthCodeTip+'"></div><p id="oldAuthCode_error_info"></p></div>';
            
            // 1、	所有验证身份处增加“没有收到验证码？”
            htmlStr += getNoAuthCodeLinkDiv();
            
            if (type == "secondAuth") {
                htmlStr += '<br/>';
                htmlStr += '<div class="auth-checkbox"><p class="inptips2">'+rss.rememberBrowser+'<input type="checkbox" id="rememberClientFlag"></p></div>';
                htmlStr += '<p class="inptips2">'+rss.rememberBrowserTip+'</p>';
            }
            var option = {
                title : rss.authentication,
                btnRight : {
                    text : param.rBtnTxt,
                    fn : function() {
                        var self = this;
                        
                        // span中的东西仅仅用于展示
                        // var oldUserAccount = $("#accountDiv span").text().trim();
                        if (!ec.form.validator($("#authenDialog"), true)) {  
                            return false;
                        }

                        if (type == "unbind") {
                            var oldAuthCode = $("#oldAuthCode").val();
                            var typeAndAccount = $.parseJSON($("#accountDiv input").val());
                            var delUserAccount = useraccount;                      
                            var delAccountType = 1;
                            delAccountType = getAccountType(delUserAccount);

                            var paramObj = {
                                oldAccountType : typeAndAccount.type,
                                oldUserAccount : typeAndAccount.account,
                                oldAuthCode : oldAuthCode,
                                delAccountType : delAccountType,
                                delUserAccount : delUserAccount
                            };

                            param.callbackFn(paramObj, function() {
                                self.hide();
                            });
                        } else if (type == "secondAuth") {
                            var remember_client_flag = "off";
                            if ($("#rememberClientFlag:checked").length > 0) {
                                remember_client_flag = "on";
                            }
                            var paramObj = {
                                remember_client_flag:remember_client_flag,
                                opType:"1"
                            };
                            param.callbackFn(paramObj,function() {
                                self.hide();
                            });
                        } else if (type == "identifyVerify") {
                        	var newAuthCode = $("#oldAuthCode").val();
                        	var paramObj = {
                    			authcode:newAuthCode,
                    			opType:"8"
                        	};
                            param.callbackFn(paramObj,function() {
                                self.hide();
                            });
                        } else {
                            var oldAuthCode = $("#oldAuthCode").val();
                            var typeAndAccount = $.parseJSON($("#accountDiv input").val());
                            chkAuthCode(typeAndAccount.account, typeAndAccount.type,oldAuthCode, 3, function(data) {
                                self.hide();
                                param.callbackFn.call(this, data);
                            });
                        }

                    }
                },
                btnLeft : {
                    text : param.lBtnTxt,
                    fn : function() {
                    }
                },
                html : htmlStr,
                dialogStyle: localInfo.msgDialogStyle,
                beforeAction : function() {
                	if (localInfo.beforeAction)
                	{
                    	if (typeof(localInfo.beforeAction) == "function")
                    	{
                    		localInfo.beforeAction();
                    	}
                	}
                	
                    $('#accountDiv').DropList({
                        items : items,
                        onChange : function(key, value) {
                            $("#oldUserAccount").val(value);
                            if(value.indexOf("@")>=0)
                            {
                            	$("#oldAuthCode").attr("placeholder",rss.emailAuthCode);
                            }
                            else
                            {
                            	$("#oldAuthCode").attr("placeholder",rss.smsAuthCode);
                            }
                        }
                    });
                    var self = this;
                    self.disabled();
                    $("#oldAuthCode").on("keyup change", function() {
                        if ($("#oldAuthCode").val().trim() != "") {
                            self.enable();
                            return false;
                        } else {
                            self.disabled();
                        }
                    });

                    $("#getAuthCodeBtn").on("click",function(e) {
                        if ($("#getAuthCodeBtn").attr("disabled")) {
                            return false;
                        }
                        if (!ec.form.validator($("#accountDiv"), true)) {
                            return false;
                        }
                        
                        // 这里得到了json字符串，将其转换为json对象
                        var typeAndAccount = $.parseJSON($("#accountDiv input").val());
                        var param = {
                            phoneOrEmail : typeAndAccount.account,                            
                            authCodebtn : $("#getAuthCodeBtn")
                        };
                        if (localInfo.userID) {
                            param.userID = localInfo.userID;
                        }
                        if (type == "secondAuth") {
                            param.reqType = 6;
                            param.account = useraccount;
                            param.siteID = accountSiteID;
                            param.operType = 2;
                            param.accountType = getAccountType(useraccount);
                        }else if(type == "identifyVerify") {
                            param.account = useraccount;
                            param.siteID = accountSiteID;
                            param.type = type;
                            param.reqType = 3;
                            param.accountType = typeAndAccount.type;
                            param.operType = 2;  //操作类型
                        }else {
                            param.reqType = 3;
                            param.account = typeAndAccount.account;
                            param.accountType = typeAndAccount.type;
                        }
                        
                        getAuthCode(param);

                    });

                }
            };
            $("<div>").Dialog(option).Dialog('show');
            
            // 账号列表展示完之后，针对placeholder进行特殊处理
            var curAccount=$("#accountDiv span").text();
        	if(curAccount.indexOf("@")>=0)
        	{
        		$("#oldAuthCode").attr("placeholder",rss.emailAuthCode);
        	}
        	else
        	{
        		$("#oldAuthCode").attr("placeholder",rss.smsAuthCode);
        	}

            checkAuthCodeInput($("#oldAuthCode"), "#oldAuthCode_error_info");
        }

    };

    function verifyPwdDialog(param) {
    	var dialogMsg = param.dialogMsg;
        var userAccount = param.userAccount;
        param.forgetHtml = param.forgetHtml||""; 
        $("<div>").Dialog({
                title : rss.verifyLoginPwd,
                btnRight : {
                    text : param.rBtnTxt,
                    fn : function() {
                        var self = this;
                        var pwd = $("#password").val();                        
                        var accountType = param.accountType;
                        var thirdAccount = param.thirdAcc;
                        verifyPwd(accountType,userAccount, pwd, function() {
                            self.hide();
                            var accountObj = {
                                userAccount : userAccount,
                                password : pwd,
                                accountType:accountType,
                                thirdAcc:thirdAccount
                            };
                            param.callbackFn.call(this, accountObj);
                        });

                    }
                },
                btnLeft : {
                    text : rss.cancel_btn,
                    fn : function() {
                    }
                },
                html : '<span>'+rss.huaweiAccount_colon_space + getExpressPhone(dialogMsg) + '</span><div class="dinput"><span><input id="password" type="password" placeholder="'+rss.inputLingPwd+'"></span></div><p id="error_info"></p>'+param.forgetHtml

            }).Dialog('show');
    }

    function getAuthCode(paraData) {
        var userID = paraData.userID;
        var account = paraData.account;
        var phoneOrEmail = paraData.phoneOrEmail;
        var accountType = paraData.accountType;
        var $btn = paraData.authCodebtn;
        var reqType = paraData.reqType;
        var accountSiteID = paraData.siteID;
        var operType = "0";
        operType = paraData.operType;
        var method = "";
        var param;
        var sendAccountType = 1;
        if (phoneOrEmail.indexOf("@") != -1) {
            sendAccountType = 1;
            method = "getEMailAuthCode";
            param = {
                userID : userID,
                accountType : accountType,
                reqClientType : reqClientType,
                emailReqType : reqType,
                operType : operType,
                email : phoneOrEmail,
                siteID : accountSiteID,
                "pageToken" : localInfo.pageToken,
                languageCode:localInfo.lang
            };
        } else {
            sendAccountType = 2;
            method = "getSMSAuthCode";
            param = {
                accountType : accountType,
                userAccount : account,
                reqClientType : reqClientType,
                mobilePhone : phoneOrEmail,
                operType : operType,
                smsReqType : reqType,
                siteID : accountSiteID,
                "pageToken" : localInfo.pageToken,
                languageCode:localInfo.lang
            };
            if(paraData.type=="identifyVerify") {
            	param.userAccount = phoneOrEmail;
            	param.smsReqType = "3"; //录入前
            }
        }

        ajaxHandler(method, param, function(data) {

            var flag = data.isSuccess;
            if (flag == "1") {
                $btn.attr("disabled");
                if (param.email) {
                	showSuccess($("#authCodeError"), rss.emialHasSendTo.format(param.email));
                } else {
                	showSuccess($("#authCodeError"), rss.phoneMegHasSendTo.format(getExpressPhone(param.mobilePhone)));
                }
                
                $btn.addClass("auth_code_grey");
                jsInnerTimeout($btn, rss.resend);

            } else {
                $btn.removeAttr("disabled");
                if (data.errorCode == "10000001") {
                    showError($("#authCodeError"), rss.error_10000001_1, "left");
                } else if (data.errorCode == "10000002") {
                    showError($("#authCodeError"), rss.error_10000002);
                } else if (data.errorCode == "10000004") {
                    showError($("#authCodeError"), rss.error_10000004);
                } else if (data.errorCode == "70001102") {
                    if (sendAccountType == 1 || sendAccountType == 5) {
                        showError($("#authCodeError"), rss.error_70001102_0);
                    } else if (sendAccountType == 2 || sendAccountType == 6) {
                        showError($("#authCodeError"), rss.error_70001102_1);
                    }

                } else if (data.errorCode == "70001104") {
                    if (sendAccountType == 1 || sendAccountType == 5) {
                        showError($("#authCodeError"), rss.error_70001104_0, "left");
                    } else if (sendAccountType == 2 || sendAccountType == 6) {
                        showError($("#authCodeError"), rss.error_70001104_1, "left");
                    }
                } else if (data.errorCode == "70001201") {
                    showError($("#authCodeError"), rss.error_70001201_0);
                } else if (data.errorCode == "70001101") {
                    showError($("#authCodeError"), rss.error_70001101);
                } else if (data.errorCode == "70001401") {
                    showError($("#authCodeError"), rss.error_70001401);
                } else if (data.errorCode == "70002001") {
                    showError($("#authCodeError"), rss.error_70002001);
                } else if (data.errorCode == "70002002") {
                    showError($("#authCodeError"), rss.error_70002002);
                } else if (data.errorCode == "70002028") {
                    showError($("#authCodeError"), rss.error_70002028);
                } else if (data.errorCode == "70002046") {
                    showError($("#authCodeError"), rss.error_70002046);
                } else if (data.errorCode == "70002030") {
                    showError($("#authCodeError"), rss.error_70002030);
                } else {
                    showError($("#authCodeError"), rss.error_70002030);
                }
            }
        }, function(data) {
            showError($("#authCodeError"), rss.getAuthCodeError);
        }, true, "json");
    }
    
    /* 修改密码弹框  */
    function updatePassword(param) {
    	$("<div/>").Dialog({
    		title: rss.changePwd,
    		btnRight: {
    			text: rss.ok,
    			fn: function() {
    				var self = this;
    				if (!ec.form.validator($("#newPassword"), true)
    					|| !ec.form.validator($("#confirmPassword"), true)) {
    					return false;
    				}
    				var newPassword = $("#newPassword").val();
    				var paramObj = {
						newPassword:newPassword,
						opType : "9"
    				};
    				param.callbackFn(paramObj, function() {
                        self.hide();
                    });
    			}
    		},
    		btnLeft: {
    			text: rss.cancel_btn,
    			fn: function() {}
    		},
    		beforeAction: function() {
    			ec.form.input.label.defaults.ifRight="10px";
    		    ec.form.input.label($("#newPassword"),rss.newPwd);
    		    ec.form.input.label($("#confirmPassword"),rss.confirmPwd);  
    			validatorPassword.call(this);
    		},
    		dialogStyle: localInfo.msgDialogStyle,
    		html:'<p class="risk">' +rss.risk_motify_pwd+ '</p>' + 
    			 '<div class="dinput"><input id="newPassword" type="password"></div><p id="new_pwd_error_info"></p>' +
    			 '<div class="dinput"><input id="confirmPassword" type="password"></div><p id="confirm_pwd_error_info"></p>'
    	}).Dialog('show');
    }
    
    function validatorPassword() {
		var newPassword = $("#newPassword"),
		confirmPassword = $("#confirmPassword"),
		self = this;
 		
 		this.disabled();
		
		//validate new password
		ec.form.validator.bind(newPassword, {
			type : [ "require", "length", "password"],
			trim : false,
			validOnChange : true,
			compareTo : confirmPassword,
			min : 8,
			max : 32,
			msg_ct : "#new_pwd_error_info",
			msg : {
				require : rss.common_js_inputpwd,
				length : rss.common_js_pwdlimit,
				password:rss.pwdInputTip,
				pwdEqual : rss.common_js_pwdnotsame
			}
		});
		
		//validate confirm password
		ec.form.validator.bind(confirmPassword, {
			type : [ "require", "eq" ],
			trim : false,
			validOnChange : true,
			compareTo : newPassword,
			msg_ct : "#confirm_pwd_error_info",
			msg : {
				require : rss.common_js_confirmpwd,
				eq : rss.common_js_pwdnotsame
			}
		});
		
		newPassword.on("blur", function() {
		}).on("keyup", function(e) {
			updateBtnState();
		});
		confirmPassword.on("blur", function() {
		}).on("keyup", function(e) {
			updateBtnState();
		});
		
		function validatorPassword() {
			$("#new_pwd_error_info").empty();
			$("#confirm_pwd_error_info").empty();
			
			ec.form.validator($(this), true);
			updateBtnState();
		}

		function updateBtnState() {
			if (newPassword.val() && confirmPassword.val()) {
				self.enable();
			} else {
				self.disabled();
			}
		}
 	}

    function chkAuthCode(userAccount,oldAccountType,authCode, authOprType, callback) {
        var param = {
            accountType : oldAccountType,
            userAccount : userAccount,
            authCode : authCode,
            authOprType : authOprType,
            reqClientType : reqClientType,
            "pageToken" : localInfo.pageToken
        };

        ajaxHandler("chkAuthCode", param, function(data) {
            var isSuccess = data.isSuccess;
            var errorCode = data.errorCode;
            if (isSuccess == "1") {
                var oldAccountObj = {
                    oldAccountType : oldAccountType,
                    oldUserAccount : userAccount,
                    oldAuthCode : authCode,
                    reqClientType : reqClientType
                };
                callback(oldAccountObj);

            } else {
                if (errorCode == "10000001") {
                    showError($(".errortip"), rss.authCodeError);
                } else if (errorCode == "10000002") {
                    showError($(".errortip"), rss.error_10000002);
                } else if (errorCode == "10000004") {
                    showError($(".errortip"), rss.error_10000004);
                } else if (errorCode == "70001201") {
                    showError($(".errortip"), rss.error_70001201_1);
                } else if (errorCode == "70001401") {
                    showError($(".errortip"), rss.error_70001401);
                } else if (errorCode == "70002039") {
                    showError($(".errortip"), rss.error_70002039);
                } else if (errorCode == "70002058") {
                    showError($(".errortip"), rss.error_70002058);
                } else if (errorCode ==  "70002057") {
                     showError($(".errortip"), rss.error_70002057_1);
                }
                
                else {
                    showError($(".errortip"), rss.authCodeError);
                }

            }
        }, function() {
        }, true, "json");
    }
    
    function checkAuthCodeInput($authCode, msg_ct) {

        ec.form.validator.bind($authCode, {
            type : ["require", "length", "number"],
            trim : false,
            min : 4,
            max : 8,
            validOnChange : true,
            msg_ct : msg_ct,
            msg : {
                require : rss.inputAuthCodeTip,
                length : rss.authCodeLength,
                number : rss.authCodeLength
            }
        });

        ec.form.validator.register("number", function(b_val, a) {
            var regx = /^([0-9])+$/g;
            var ret = regx.test(b_val);
            return ret ? true : false;
        });
    }

    function getAccountInfo(userAcct, isGetAll, callback,accountType) {
        var dataParms = {
            "userAccount" : userAcct,
            "reqClientType" : reqClientType,
            "isGetAll" : isGetAll,
            "pageToken" : localInfo.pageToken,
            "accountType" : accountType
        };
        ajaxHandler("getUserAccInfo", dataParms, function(data) {
            var isSuccess = data.isSuccess, errorCode = data.errorCode;
            if (isSuccess == "1") {
                callback(data.userAcctInfoList, data.userID);
            } else {
                callback([]);
            }
        }, function() {
        }, false, "json");
    }

    function verifyPwd(accountType, userAccount, password, callback) {
        var param = {
            accountType : accountType,
            userAccount : userAccount,
            password : password,
            reqClientType : localInfo.reqClientType,
            "pageToken" : localInfo.pageToken
        };

        ajaxHandler("verifyPassword", param, function(data) {
            var flag = data.isSuccess;
            if (flag == "1") {
                callback();
            } else {
                if (data.errorCode == "10000001") {
                    showError($(".errortip"), rss.error_10000001_2);
                } else if (data.errorCode == "10000002") {
                    showError($(".errortip"), rss.error_10000002);
                } else if (data.errorCode == "10000004") {
                    showError($(".errortip"), rss.error_10000004);
                } else if (data.errorCode == "70001201") {
                    showError($(".errortip"), rss.error_70001201_2);
                } else if (data.errorCode == "70001401") {
                    showError($(".errortip"), rss.error_70001401);
                } else if (data.errorCode == "70002057") {
                    showError($(".errortip"), rss.error_70002057_2);
                } else if (data.errorCode == "70002058") {
                    showError($(".errortip"), rss.error_70002058_1);
                } else {
                    showError($(".errortip"), rss.verifyPwdError);
                }
            }
        }, function(data) {
            showError($(".errortip"), rss.verifyPwdError);
        }, true, "json");
    }
    
    var authCodeLabel = '<div class="dbtn2 sbtn r" id="getAuthCodeBtn1" act="getVerificationCode" intervaltime="60"><span>' + rss.getAuthCode + '</span><p id="authCodeError"></p></div>';
    //验证并更新密码
    function loginAuthAndUpdatePwd(param) {
    	$("<div/>").Dialog({
    		title: rss.authentication,
    		btnRight: {
    			text: rss.ok,
    			fn: function() {
    				var self = this;
    				if (!ec.form.validator($("#authAndUpdatediv"), true)) {  
                        return false;
                    }
    				var newPassword = $("#newPassword").val();
    				var newAuthCode = $("#oldAuthCode").val();
    				var paramObj = {
						newPassword:newPassword,
						authcode:newAuthCode,
						opType : param.opType
    				};
    				param.callbackFn(paramObj, function() {
                        self.hide();
                    });
    			}
    		},
    		btnLeft: {
    			text: rss.cancel_btn,
    			fn: function() {}
    		},
    		beforeAction: function() {
    			var self = this;
    			updateUI(param.queryCond, function() {
    				initDropList($("#accountDiv1"));
        			validatorPassword.call(self);
    			}); //查询帐号列表
                self.disabled();
                $("#oldAuthCode").on("keyup change", function() {
                    if ($("#oldAuthCode").val().trim() != "") {
                        self.enable();
                        return false;
                    } else {
                        self.disabled();
                    }
                });

                $("#getAuthCodeBtn1").on("click",function(e) {
                    if ($("#getAuthCodeBtn1").attr("disabled")) {
                        return false;
                    }
                    if (!ec.form.validator($("#accountDiv1"), true)) {
                        return false;
                    }
                    
                    // 这里得到了json字符串，将其转换为json对象
                    var typeAndAccount = $.parseJSON($("#accountDiv1 input").val());
                    var param = {
                        phoneOrEmail : typeAndAccount.account,                            
                        authCodebtn : $("#getAuthCodeBtn1")
                    };
                    if (localInfo.userID) {
                        param.userID = localInfo.userID;
                    }
                    param.account = typeAndAccount.account;
                    param.reqType = 3;
                    param.accountType = typeAndAccount.type;
                    param.operType = 2;  //操作类型
                    getAuthCode(param);
                });
    		},
    		dialogStyle: localInfo.msgDialogStyle,
    		html: '<div id="authAndUpdatediv">' +
			'<p class="risk">' +rss.risk_auth+ '</p>' + 
    		'<div id="accountDiv1"></div>' +
    		authCodeLabel +
			'<div class="dinput" style="width:50%;"><input id="oldAuthCode" type="text" placeholder="' +rss.inputAuthCodeTip+ '"></div><p id="auth_code_error_info"></p>' + 
			
            // 1、	所有验证身份处增加“没有收到验证码？”
            '<div style="width:100%;height:40px;">' 
				+ getNoAuthCodeLinkDiv()
            	+ '</div>' + 
    		
    		'<p class="risk top25">' +rss.risk_motify_pwd+ '</p>' + 
    		'<div class="dinput"><input id="newPassword" type="password" placeholder="' +rss.newPwd+ '"></div><p id="new_pwd_error_info"></p>' +
    		'<div class="dinput"><input id="confirmPassword" type="password" placeholder="' +rss.confirmPwd+ '"></div><p id="confirm_pwd_error_info"></p>' +    
    		'<p id="confirm_pwd_error_info"></p></div>'
    	}).Dialog('show');
    	
    	checkAuthCodeInput($("#oldAuthCode"), "#auth_code_error_info");
    }
    
    function checkAuthCodeBtnState(ele, text) {
		var authEle = ele.find("[act='getVerificationCode']");
		var disabled = authEle.attr("disabled");
		if (disabled) {
			return false;
		}
		return true;
	}

    /* 生成 Drop List */
    function initDropList(jqEle) {
    	var items = [];
    	if (userAcctInfoData && userAcctInfoData.userAcctInfoList) {
    		for (var i = 0; i < userAcctInfoData.userAcctInfoList.length; i++) {
    			if (userAcctInfoData.userAcctInfoList[i].accountState == 1 || userAcctInfoData.userAcctInfoList[i].accountState==0) {
    				items.push({
    					value: JSON.stringify({
    						index:i,
    						type:userAcctInfoData.userAcctInfoList[i].accountType,
    						account:userAcctInfoData.userAcctInfoList[i].userAccount
    					}),
    					label: getExpressPhone(userAcctInfoData.userAcctInfoList[i].userAccount)
    				});
    			}
    		}
    	}
    	
    	userInfo.oldAccountType = userAcctInfoData.userAcctInfoList[0].accountType;
    	userInfo.oldUserAccount = userAcctInfoData.userAcctInfoList[0].userAccount;
    	
    	jqEle.DropList({
    		items: items,
    		onChange: function(key, value) {
    			userInfo.oldAccountType = userAcctInfoData.userAcctInfoList[key.index].accountType;
    			userInfo.oldUserAccount = userAcctInfoData.userAcctInfoList[key.index].userAccount;
    		}
    	});
    }

    function updateUI(userAccount, callback) {
    	getUserAccInfo(userAccount, function(data) {
    		if (data.isSuccess == 1) {
    			initUserInfo(data);
    			callback();
    		}
    	});
    }

    /* 保存帐号信息 */
    function initUserInfo(data) {
    	userAcctInfoData = data;
    	userInfo.oldAccountType = data.userAcctInfoList[0].accountType;
    	userInfo.oldUserAccount = data.userAcctInfoList[0].userAccount;
    }
    
    /* 获取用户帐号信息 */
	function getUserAccInfo(userAccount, callback) {
		var params = {
			userAccount: userAccount,
			reqClientType: reqClientType,
			isGetAll: 0,
			pageToken: localInfo.pageToken
		};
		ajaxHandler("getUserAccInfo", params, function(data) {
 			if (data && data.isSuccess == 1) {
 				callback(data);
 				localInfo.userID = data.userID;
 			} else {
 				
 			}
 		}, function(){}, true, "json");
	}
    

	window.loginAuthAndUpdatePwd = loginAuthAndUpdatePwd;
    window.updatePassword = updatePassword;
    window.openAuthenDialog = openAuthenDialog;
    window.getAuthCode = getAuthCode;
    window.chkAuthCode = chkAuthCode;
    window.getAccountInfo = getAccountInfo;
    window.checkAuthCodeInput = checkAuthCodeInput;
    window.verifyPwd = verifyPwd;
    window.verifyPwdDialog=verifyPwdDialog;

})(jQuery, window);

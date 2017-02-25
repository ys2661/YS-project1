ec.load("ajax", { 
	loadType : "lazy"
});
ec.load("ec.box", {
	loadType : "lazy"
});
ec.account = {};


/**
 * 检查帐号是否存在
 * 不需要验证码的校验
 */
var a = ec.account.checkExist = function(g, f, e, b, d, c) {
	ec.Cache.get("checkExist_ajax", function() {
		return new ec.ajax();
	}).post({
				url :getWebUrlHttps()+"isExsitUser?random="+new Date().getTime(),
				data:{"userAccount":g,"accountType":1,"pageToken":localInfo.pageToken},
				timeout : 12000,
				timeoutFunction : c,
				successFunction : function(data) {
					var resulte=data.existAccountFlag;
					if (resulte=="0") {
						f.attr("acceptValue", g);
						b(f);
					} 
					else if (resulte=="1" || resulte=="2") {	
						d();
					} 
					else
					{
						e();
					}
				},
				errorFunction :function(data){
					var resulte=data.existAccountFlag;
					if (resulte=="0") {
						f.attr("acceptValue", g);
						b(f);
					} 
					else if (resulte=="1" || resulte=="2") {
						d();
					} 
					else
					{
						e();
					}
				}
			});
	};
/**
 * 显示注册协议的页面
 */
ec.account.showAgreement = function() {
	new ec.box($("#agreement_content").val(), {
		boxid : "agreement_box",
		title : rss.js_registeragreement,
		showButton : true,
		boxclass : "ol_box agreement-area",
		remember : true,
		height : 350,
		width : 740,
		autoHeight : false
	}).open();
};


    
$("#selectCountryImg").click(function(){
        openCountryCodeDialog(countryRegions);
        
    });
    
    var countryRegions = [];
    /**
     * 获取国家列表
     */
    function getCountryRegion(){
        var dataParms={
                "pageToken":localInfo.pageToken,
                "lang":localInfo.lang
        };
        
        if(localInfo.countryCode=="us")
        {
        	dataParms.siteID="9";
        }
        
        var strParms="getCountryRegion";
        ajaxHandler(strParms,dataParms,function(data) {
              if(data.isSuccess=="1")
                {
                  countryRegions = data.countryRegions;
                }
          },function(){},false,"JSON");
    }
    
    

    function displayCountry() {
        var inputCountryCode = localInfo.countryCode;
        var ipCountryCode = getIPCountry();
        var defaultCountry = getdefaultCountryByCurrentSiteID();
        var defaultCountryCode = defaultCountry.split("-")[2];
        var country = "";
        
        if(localInfo.createChildFlag=="true")
        {
        	$("#selectedCountry").text(localInfo.localCountryName); 
            $("#regXCountry").text(rss.now_register_x_account.format(localInfo.localCountryName));
            $("#countryRegion").val(localInfo.currentSiteID+"-"+localInfo.countryCode);
        }
        else
        {	
        	
	        if (countryRegions.length>0) {
	        			
	        			var hasFound=false;
	        	
		            	if(inputCountryCode)
		            	{
		            		$.each(countryRegions,function(n,value) { 
		            			if (inputCountryCode.toLowerCase() == value.regionID) {
		                            $("#selectedCountry").text(value.mulitLangRegion); 
		                            $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
		                            hasFound=true;
		                            country = localInfo.currentSiteID+"-"+value.regionID;
		                            replaceAgreeAge(value.ageLimit);
		                            return false;
		                        }
		            		});
		            	}
		            	
		            	if(ipCountryCode && !hasFound)
		            	{
		            		$.each(countryRegions,function(n,value) { 
		            			if (ipCountryCode.toLowerCase() == value.regionID) {
		                            $("#selectedCountry").text(value.mulitLangRegion);
		                            $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
		                            hasFound=true;
		                            country = localInfo.currentSiteID+"-"+value.regionID;
		                            replaceAgreeAge(value.ageLimit);
		                            return false;
		                        }
		            		});
		            	}
		            	
		            	if(defaultCountryCode && !hasFound)
		            	{
		            		$.each(countryRegions,function(n,value) { 
		            			if (defaultCountryCode.toLowerCase() == value.regionID) { 
		                            $("#selectedCountry").text(value.mulitLangRegion); 
		                            $("#regXCountry").text(rss.now_register_x_account.format(value.mulitLangRegion));
		                            hasFound=true;
		                            country = defaultCountry;
		                            replaceAgreeAge(value.ageLimit);
		                            return false;
		                        }
		            		});
		            	}
	
	        }
	    
        }
        
        
        if (countryRegions.length <= 1) {
            $("#selectCountryImg").parent().remove();
        }
        
        $("#countryRegion").val(country);
        
  	   if(countryRegions.length >= 1 && localInfo.countryCode!="us") {
		   $("#chooseCountry").css("display","");
		   $("#chooseCountryShadow").css("display","");
	   }
    }
    
    function getIPCountry() {
        var ipcountry="";
        var dataParms = {
            "pageToken" : localInfo.pageToken,
            "reqClientType" : localInfo.reqClientType
        };
        var strParms = "getIPCountry";
        ajaxHandler(strParms, dataParms, function(data) {
            if (data.isSuccess == "1") {
                if (data.countryCode != "") { //
                    ipcountry = localInfo.currentSiteID+"-"+data.countryCode;
                }   
            }
        }, function() {
        }, false, "JSON");
        return ipcountry;
    }

function openCountryCodeDialog(countryRegions) {
        var htmlStr = '<div class="mask"></div>';
        htmlStr += '<div class="countryDialog" >';
        htmlStr += '<div class="dcent2">';
        $.each(countryRegions, function(index, value) {
            htmlStr += '<div >';    
         /*
            if ($("#countryRegion").val() == currentSiteID+"-"+value.localeID) {      
                     htmlStr += '<div class="item2 selectedBackground">';
                     } else {
                       htmlStr += '<div class="item2">';  
                     }*/
         
            htmlStr += '<div class="item2">';  
            var countryDisplay = value.mulitLangRegion;
            htmlStr += '<span class="split cc">' + countryDisplay + '</span><input type="hidden" value="' + currentSiteID+"-"+value.regionID + '">';
            if ($("#countryRegion").val() == currentSiteID+"-"+value.regionID) {
                htmlStr += '<b data-value="false" class="selected seleInter"></b>';
                $(this).css({
                "background-color":"#ebebeb"
            });
            } else {
                htmlStr += '<b data-value="false" ></b>';
            }
            
            htmlStr += '</div>';
            htmlStr += '</div>';

        });
        htmlStr += '</div>';
        htmlStr += '</div>';
        $("#selectCountryCodeDiv").html(htmlStr);
        
        $(".code-node:last").removeClass("line");

        
        $(window).resize(function(){
        	$(".countryDialog").css({
        		"top":((window.getHeight()/2-$(".countryDialog").outerHeight()/2)>=0?(window.getHeight()/2-$(".countryDialog").outerHeight()/2):0)+"px",
                "left":((window.getWidth()/2-$(".countryDialog").outerWidth()/2)>=0?(window.getWidth()/2-$(".countryDialog").outerWidth()/2):0)+"px",
                "position":"fixed",
                "margin":"0px"
        	});
        });
        
        $(".countryDialog").css({
        	
            "top":((window.getHeight()/2-$(".countryDialog").outerHeight()/2)>=0?(window.getHeight()/2-$(".countryDialog").outerHeight()/2):0)+"px",
            "left":((window.getWidth()/2-$(".countryDialog").outerWidth()/2)>=0?(window.getWidth()/2-$(".countryDialog").outerWidth()/2):0)+"px",
            "position":"fixed",
            "margin":"0px"
        });

        $(".item2").on("click", function(e) {
            $(".countryDialog").find(".selected").removeClass('selected');
            $(this).find("b").addClass('selected');

            var self = $(this);
            setTimeout(function() {
                $("#selectedCountry").text(self.parent().find(".cc").text().trim());
                $("#regXCountry").text(rss.now_register_x_account.format(self.parent().find(".cc").text().trim()));
                var country = self.parent().find("input").val();
      
                $("#selectCountryCodeDiv").html("");
                getAgreementContent(country.split("-")[1]);
                $("#countryRegion").val(country);
                displayAgreeTwoByCD(country.split("-")[1]);
            }, 200);

        });
        
        $(".mask").on("click", function(e) {
            setTimeout(function() {
                $("#selectCountryCodeDiv").html("");
            }, 200);

        });
        
        var $item = $(".item2");
        $item.on("mouseover",function() {
            $(this).addClass("selectedBackground");
        });
        $item.on("mouseout",function() {
            $(this).removeClass("selectedBackground");
        });
    }


// 这个函数的主要功能就是展示  对应的agreeTwo
function displayAgreeTwoByCD(countryCode)
{
    if (countryRegions.length>0) {
        $.each(countryRegions,function(n,value) {                 
              if (countryCode.toLowerCase() == value.regionID) {
            	  replaceAgreeAge(value.ageLimit);
              } 
          });
    }
}


function getdefaultCountryByCurrentSiteID() {
	var defaultCountry = "";
	switch (currentSiteID) {
	case "9":
		defaultCountry = currentSiteID+"-" + "en-us";
		break;
	case "5":
		defaultCountry = currentSiteID+"-" + "zh-hk";
		break;
	case "8":
		defaultCountry = currentSiteID+"-" + "ru-ru";
		break;
	case "7":
		defaultCountry = currentSiteID+"-" + "de-de";
		break;
	case "6":
		defaultCountry = currentSiteID+"-" + "pt-br";
		break;
	case "1":
		defaultCountry = currentSiteID+"-" + "zh-cn";
		break;
	case "3":
		defaultCountry = currentSiteID+"-" + "en-in";
		break;
	}
	return defaultCountry;
}


function sendEmailCode(email){
	var getCodeButton=$("#getValiCode");
	
	var strParms="getEMailAuthCode";
	var dataParms={
		email: email,
		accountType: "1",
		emailReqType: "0",
		languageCode: localInfo.lang,
		siteID:localInfo.currentSiteID,
		reqClientType: localInfo.reqClientType,
		pageToken: localInfo.pageToken
	};
	
	var dialogOptions;
	if (rss.msgDialogOverlayClass)
	{
		dialogOptions = {
			overlayClass: rss.msgDialogOverlayClass// 背景层的样式
		};
	}
	
	ajaxHandler(strParms,dataParms,function(data) {
		  if(data.isSuccess=="1")
			{
			  	showSuccess($("#msg_getPhoneRandomCode"), rss.emailHasSendTo.format(dataParms.email));
			  	//getCodeButton.val(rss.resend);
				getCodeButton.attr("IntervalTime",60);
				getCodeButton.attr("disabled",true);
				getCodeButton.addClass("auth_code_grey");
				jsInnerTimeout();
			}
		  else
		    {
			  switch(data.errorCode) {
			  	case '10000001':
			  	case '70001101':
 				case '70001201': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_10000001);
 					break;
 				}
 				case '70001401': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70001401);
 					break;
 				}
 				case '70002002': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70002002);
 					break;
 				}
 				case '70002001': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70002001);
 					break;
 				}
 				case '70002028': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70002028);
 					break;
 				}
 				case '70002046': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70002046);
 					break;
 				}
 				case '70002030': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70002030);
 					break;
 				}
 				case '70001102': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70001102_0);
 					break;
 				}
 				case '70001104': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_70001104_0);
 					break;
 				}
 				case '10000004': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_10000004);
 					break;
 				}
 				case '10000002': {
 					showError($("#msg_getPhoneRandomCode"), rss.error_10000001);
 					break;
 				}
 				default: {
 					showError($("#msg_getPhoneRandomCode"), rss.error_10000001);
 					break;
 				}
			}
	    }	
	  },function(){},true,"JSON", dialogOptions);
}

function getEmailCode()
{
	var email= $("#username").val();
	
	if(checkEmail(email)) {
		$("#msg_phone").html("");
		$("#msg_phoneRandomCode").html("");
		$("#register_msg").html("");
		
		// 检查邮箱是否存在
		var username= $("#username");
		checkExistAuto(username, "getAuthCodePost");
		//sendEmailCode(email);
	}
	
}

function checkEmail(email) {
	if(email == "") {
		showError($("#msg_email"), rss.js_emptyemail);
		return false;
	}else if(email.length < 5 ||  email.length>50) {
		showError($("#msg_email"), rss.login_js_accountlength);
		return false;
	}else {
		if(!(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9\-]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(email))) {
			showError($("#msg_email"), rss.js_emailfomaterror);
			return false;
		}
		return true;
	}
}

function jsInnerTimeout()
{
	var codeObj=$("#getValiCode");
	
	var intAs=parseInt(codeObj.attr("IntervalTime"));

	intAs--;
	codeObj.attr("disabled",true);
	if(intAs<=-1)
	{
		codeObj.attr("disabled",false);
		codeObj.removeClass("auth_code_grey");
		codeObj.val(rss.resend);
		return true;
	}
	
	codeObj.val(rss.resend_time.format(intAs));
	codeObj.attr("IntervalTime",intAs);
	
	setTimeout("jsInnerTimeout()",1000);
}

function getAgreementContent(country) {
	var agrContentArr =[];
	var dataParms = {
		"pageToken" : localInfo.pageToken,
		"reqClientType" : localInfo.reqClientType,
		//"agrIDs" : localInfo.agrIDs,   注册的话，并不需要传agrIDs，只要countryCode准确，就可以确定要注册那几份协议
		"lang" : localInfo.lang,
		"countryCode":country
	};
	
	var strParms = "getAgreementContent";
	ajaxHandler(strParms, dataParms, function(data) {
		if (data.isSuccess == "1") {
			if (data.agreementContents) {
               $.each(data.agreementContents, function(index,agreement) {
                 agrContentArr.push(agreement);
               });
	        }
			
			// 获取协议成功之后，需要重新刷新注册用的字串
			localInfo.agreementContentsStr=data.agreeForReg;
			
			// 获取协议成功之后，需要重新ageLimit
			localInfo.ageLimit=data.ageLimit;
			
			var htmlStr = "";
			
			var adAgreeOrNot=false;
			
			for (var i = 0; i < agrContentArr.length; i++) {
				
				var agreement = agrContentArr[i];
				
				
					//htmlStr += '<div class="node"><div class="node-title">'+agreement.agrTitle + '</div>' ;//'<a class="reg-more r" target="_blank" href="'+agreement.agrHref+'">'+rss.more_details+'> </a></div>';
					htmlStr += '<div class="node"><div class="node-intro agrLineH">'+agreement.agrBrief+'</div>';
					//htmlStr += '<div class="agree" style="visibility: hidden">';
					//htmlStr += '<b class="tick" style="visibility: hidden" ver="'+agreement.agrVer+'"></b>';
					//htmlStr += rss.agree;
					htmlStr += '<div class="box-shadow-in"></div></div>';
					
					if(agreement.agrID=='10' && agreement.defaultAgreeOrNot)
					{
						adAgreeOrNot=true;
					}
					
			}

			
			$("#agreement").empty();
			$("#agreement").html(htmlStr);
			
			if(adAgreeOrNot)
			{
				$("#adMarketChecked").prop("checked",true);
			}
			
			
			if(localInfo.ageLimit>0)
			{
				$("#clickAgree").text(rss.common_agree_two_age.format(localInfo.ageLimit));
			}
			else
			{
				$("#clickAgree").text(rss.common_agree_two);
			}
			
			
			
			$(".tick").on("click", function() {
				$(this).data("value") == true ? $(this).trigger("turnoff") : $(this).trigger("turnon");
			}).on("turnon", function() {
				$(this).removeClass("off");
				$(this).data("value", true);
				$(this).trigger("change", [true]);
				if($(".tick.off").length == 0) {
					$("#btnSubmit").addClass("sel");
				}
			}).on("turnoff",function() {
				$(this).addClass("off");
				$(this).data("value", false);
				$(this).trigger("change", [false]);
				$("#btnSubmit").removeClass("sel");
			});
		}
	}, function() {
	}, true, "JSON");
}

/**
 * 提示注册协议必须勾选
 */
ec.account.showWarn = function() {
	var strContentHtml="<div style='margin:20px 50px auto 50px;color:red;font-weight:bold;'>"+rss.js_regprotocol+"</div>";
	new ec.box(strContentHtml, {
		boxid : "agreement_box1",
		title : "",
		showButton : false,
		boxclass : "ol_box agreement-area",
		remember : true,
		height : 100,
		width : 350,
		autoHeight : false
	}).open();
};

ec.ready(function() {
		var e = function(g, x) {
			jQuery(g).show().html(x);
		};
		var d = jQuery("#registerForm input[name='formBean.username']");			
		var c = jQuery("#registerForm input[name='formBean.password']");
		var cp = jQuery("#registerForm input[name='checkPassword']");
		var pp = jQuery("#registerForm input[name='parentPassword']");
		var b = jQuery("#registerForm input[name='formBean.authCode']");
		
		var btnSubmit = $("#btnSubmit");
		
		// 待注册的账号
		ec.form.validator.bind(d,
							{
							type : [ "require", "email", "length"],
							min : 5,
							max : 50,
							trim:false,
							validOnChange : true,
							msg_ct : "#msg_email",
							msg : {
								require : rss.js_emptyemail,
								length:rss.login_js_accountlength,
								"default" : rss.js_emailfomaterror
							},
							errorFunction : function(obj,options){
								switch(options.type){
									case "require":
										showErrorToBeSeen(d,$("#msg_email"),rss.js_emptyemail);
										break;
									case "length":
										showErrorToBeSeen(d,$("#msg_email"),rss.login_js_accountlength);
										break;
										
									default:
										showErrorToBeSeen(d,$("#msg_email"),rss.js_emailfomaterror);
										break;
								
								}
							},
							successFunction : function(f) {
								turnErrorToNormal(d);
							}
						});
		
		// 待注册账号的密码
		ec.form.validator.bind(c, {
			type : [ "require", "length","password","pwdformat"],
			trim:false,
			validOnChange : true,
			min : 8,
			max : 32,
			msg_ct : "#msg_password",
			msg : {
				require : rss.js_inputpwd,
				length : rss.modifyUserPwd_input_8_32_chars,
				password:rss.modifyUserPwd_input_8_32_complax_chars_desc,
				pwdformat:rss.common_js_pwd_account_same_reverse
			},
			errorFunction : function(obj,options){
				switch(options.type){
					case "require":
						showErrorToBeSeen(c,$("#msg_password"),rss.js_inputpwd);
						break;
					case "length":
						showErrorToBeSeen(c,$("#msg_password"),rss.modifyUserPwd_input_8_32_chars);
						break;
					case "password":
						showErrorToBeSeen(c,$("#msg_password"),rss.modifyUserPwd_input_8_32_complax_chars_desc);
						break;
					case "pwdformat":
						showErrorToBeSeen(c,$("#msg_password"),rss.common_js_pwd_account_same_reverse);
						break;
				
				}
			},
			successFunction : function(f) {
				turnErrorToNormal(c);
			}
		
		});
		
		// 确认密码输入框,第二次输入的密码
		ec.form.validator.bind(cp, {
			type : [ "require", "eq" ],
			trim:false,
			validOnChange : true,
			compareTo : c,
			msg_ct : "#msg_checkPassword",
			msg : {
				require : rss.js_confirmpwd,
				eq : rss.js_pwdnotsame
			},
			errorFunction : function(obj,options){
				switch(options.type){
					case "require":
						showErrorToBeSeen(cp,$("#msg_checkPassword"),rss.js_confirmpwd);
						break;
					case "eq":
						showErrorToBeSeen(cp,$("#msg_checkPassword"),rss.js_pwdnotsame);
						break;
				}
			},
			successFunction : function(f) {
				turnErrorToNormal(cp);
			}
		});
		/*ec.form.validator.bind(b, {
			type : [ "require", "chinaLang" ],
			min : 4,
			max : 4,
			trim:true,
			validOnChange : true,
			msg_ct : "#msg_randomCode",
			msg : {
				require : rss.js_inputcode,
				chinaLang : rss.js_wrongcode
			},
			successFunction : function(f) {
			}
		});*/
		
		// 验证码
		ec.form.validator.bind(b, {
			type : [ "require", "length", "int"],
			trim:true,
			validOnChange : true,
			max : 8,
			min : 4,
			msg_ct : "#msg_phoneRandomCode",
			msg :{
				"require" : rss.inputsmscode,
				"int" : rss.wrongformatsmscode,
				"default" : rss.wrongformatsmscode
			},
			errorFunction : function(obj,options){
				switch(options.type){
					case "require":
						showErrorToBeSeen(b,$("#msg_phoneRandomCode"),rss.inputsmscode);
						break;
					case "int":
						showErrorToBeSeen(b,$("#msg_phoneRandomCode"),rss.wrongformatsmscode);
						break;
					default:
						showErrorToBeSeen(b,$("#msg_phoneRandomCode"),rss.wrongformatsmscode);
						break;
				}
			},
			successFunction : function(f) {
//				e("#msg_phoneRandomCode","<span class='vam icon-ok'>&nbsp;</span>");
				turnErrorToNormal(b);
			}
		});
		ec.form.input.label.defaults.ifRight="10px";
        ec.form.input.label($('#uniquelyNickname'), rss.notnull);

        if(currentSiteID == "7") {
        	ec.form.validator.bind($("#uniquelyNickname"), {
				type : ["length","nickname"],
				trim:false,
				validOnChange : true,
				min : 0,
				max : 20,
				msg_ct : "#nickError",
				msg : {
					length : rss.nicknameLengthLimit,
					nickname:rss.nicknameerror
				},
				errorFunction : function(obj,options){
					switch(options.type){
						case "length":
							showErrorToBeSeen($("#uniquelyNickname"),$("#nickError"),rss.nicknameLengthLimit);
							break;
						case "nickname":
							showErrorToBeSeen($("#uniquelyNickname"),$("#nickError"),rss.nicknameerror);
							break;
					}
				},
				successFunction : function(f) {
					turnErrorToNormal($("#uniquelyNickname"));
				}
			});
        }/*else if(currentSiteID != "1"){
        	ec.form.validator.bind($("#uniquelyNickname"), {
				type : [ "require", "length","nickname"],
				trim:false,
				validOnChange : true,
				min : 1,
				max : 20,
				msg_ct : "#nickError",
				msg : {
					require : rss.nicknameMissingTip,
					length : rss.nicknameLengthLimit,
					nickname:rss.nicknameerror
				}
			});
        }*/
		ec.ui.hover(d).hover(b).hover(c).hover(cp).hover(pp);
		ec.form.input.label(d, rss.js_accountlength).label(c, rss.js_pwdlength).label(cp,rss.js_pwdlength).label(b, rss.codelength);
		
		if(currentSiteID == "7") {
			ec.form.validator.bind(pp, {
				type : [ "require", "length","password","pwdformat"],
				trim:false,
				validOnChange : true,
				min : 8,
				max : 32,
				msg_ct : "#msg_checkPassword_parent",
				msg : {
					require : rss.js_inputpwd,
					length : rss.modifyUserPwd_input_8_32_chars,
					password:rss.modifyUserPwd_input_8_32_complax_chars_desc,
					pwdformat:rss.common_js_pwd_account_same_reverse
				},
				errorFunction : function(obj,options){
					switch(options.type){
						case "require":
							showErrorToBeSeen(pp,$("#msg_checkPassword_parent"),rss.js_inputpwd);
							break;
						case "length":
							showErrorToBeSeen(pp,$("#msg_checkPassword_parent"),rss.modifyUserPwd_input_8_32_chars);
							break;
						case "password":
							showErrorToBeSeen(pp,$("#msg_checkPassword_parent"),rss.modifyUserPwd_input_8_32_complax_chars_desc);
							break;
						case "pwdformat":
							showErrorToBeSeen(pp,$("#msg_checkPassword_parent"),rss.common_js_pwd_account_same_reverse);
							break;
					}
				},
				successFunction : function(f) {
					turnErrorToNormal(pp);
				}
			});
			ec.form.input.label(pp,rss.js_pwdlength);
		}
		
		d.focus();
		
		btnSubmit.bind("click",submitFun);
		c.bind("keyup",function(){onPwdKeyUp(c[0]);});
		
});


ec.form.validator.register("chinaLang", function(b, a) {
	if (a.allowEmpty && ec.util.isEmpty(b)) {
		return true;
	}
	
	if (b.length != 4) {
		return false;
	}
	else
	{
		return true;
	}
});

ec.form.validator.register("pwdComplax", function(b_val, a) {
	if (a.allowEmpty && ec.util.isEmpty(b_val)) {
		return true;
	}
	
	return isPWDComplex(b_val);
});

ec.form.validator.register("pwdformat", function(b_val, a) {
	if (a.allowEmpty && ec.util.isEmpty(b_val)) {
		return true;
	}
	var username=$("#username").val();
	usernameReverse=username.split("").reverse().join("");
	
	if(b_val.toLowerCase()==username.toLowerCase() || b_val.toLowerCase()==usernameReverse.toLowerCase())
	{
		return false;
	}
	else
	{
		return true;
	}
});

function jsGetAge(strBirthday)
{       
	var r = strBirthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); // 格式检查
    if(r==null) {
  	  return -2;     
    }
	var returnAge;
	var strBirthdayArr=strBirthday.split("-");
	var birthYear = strBirthdayArr[0];
	var birthMonth = strBirthdayArr[1];
	var birthDay = strBirthdayArr[2];
	if(birthYear=="" || birthMonth=="" || birthDay=="") {
		return -2;
	}
	d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	
	if(nowYear == birthYear)
	{
		if(nowMonth<birthMonth)
		{
			returnAge=-1;
		}
		
		if(nowMonth==birthMonth && nowDay<birthDay)
		{
			returnAge=-1;
		}
		
		if(nowMonth==birthMonth && nowDay>=birthDay)
		{
			returnAge=0;
		}
		
		if(nowMonth>birthMonth)
		{
			returnAge = 0;//同年 则为0岁
		}
		
	}
	else
	{
		var ageDiff = nowYear - birthYear ; //年之差
		if(ageDiff > 0)
		{
			if(nowMonth == birthMonth){
				var dayDiff = nowDay - birthDay;//日之差
				if(dayDiff < 0)
				{returnAge = ageDiff - 1;}
				else
				{returnAge = ageDiff ;}
			}else{
				var monthDiff = nowMonth - birthMonth;//月之差
				if(monthDiff < 0)
				{returnAge = ageDiff - 1;}
				else
				{returnAge = ageDiff ;}
			}
		}

	}
	return returnAge;//返回周岁年龄
}


//  如果 submitOrNot是true表示，提交按钮需要进行相关的提示
function checkBirthday(submitOrNot) {
	var birthday = $("#year").val()+"-"+$("#month").val()+"-"+$("#day").val();
	var age = jsGetAge(birthday);
	if(age == -2) {
		showError($("#birthdayError"), rss.chooseDateTip);
		
		if(submitOrNot)
		{
			window.setTimeout(function(){showError($("#register_msg"), rss.chooseDateTip);},100);
		}
		
		return false;
	}
	if(age == -1) {
		showError($("#birthdayError"), rss.birthdayLimitTip);
		if(submitOrNot)
		{
			window.setTimeout(function(){showError($("#register_msg"), rss.birthdayLimitTip);},100);
		}
		return false;
	}
	
	// createChildFlag的作用为如果是儿童账号注册，那么13岁的这个限定就不需要考虑了
	if(age < 13 && localInfo.createChildFlag!="true") {
//		showError($("#birthdayError"), rss.ageLimitTip);
		under13GOChild();
		
		return false;
	} else if(age < 0) {
		showError($("#birthdayError"), rss.age_error);
		if(submitOrNot)
		{
			window.setTimeout(function(){showError($("#register_msg"), rss.age_error);},100);
		}
		return false;
	}
	
	if(getDaysInMonth($("#year").val(), $("#month").val()) > $("#day").val()) {
		showDaydd($("#day").val());
	} else if(getDaysInMonth($("#year").val(), $("#month").val()) < $("#day").val()) {
		showDaydd(getDaysInMonth($("#year").val(), $("#month").val()));
	}
	return true;
}


	//年龄小于13岁，请走儿童账号流程,相关的流程写在这里
	function under13GOChild()
	{
		var htmlStr='<div>' + rss.uc_cantcreateunder13_content + '</div>';
		
	 	$("<div>").Dialog({
			title:rss.uc_cantcreateunder13_title,
			btnLeft:false,
			btnRight:{
				text: rss.iKnowBtn,
				fn:function(){
					this.hide();
				}
			},
			html:htmlStr,
			beforeAction: function(){
				
			}
			
		}).Dialog('show'); 
	 	
	 	// 对应的  id为 websettingurl
	 	$("#websettingurl").attr('href',localInfo.createChildUrl);
	}

/**
 * 确定函数
 * @returns {Boolean}
 */
function submitFun()
{	
	if($("#btnSubmit").attr("class").indexOf("sel") == -1) {
		return;
	}
	
	var registerForm = $("#registerForm");
	if(!ec.form.validator(registerForm, true))
	{
		showError($("#register_msg"), rss.register_info_error);
		return false;
	}
	
	if(currentSiteID=="7" && localInfo.countryCode!="us") {
		if(!checkBirthday(true)) {
			return false;
		}
	}
	
	/*if($(".tick.off").length != 0) {
		ec.account.showWarn();
		return false;
	}*/
 
	if(!checkNickname()) {
		return false;
	}
	postAction();
};

function checkNickname() {
	if(currentSiteID != "7") {
		return true;
	}
   /* if (currentSiteID != "8") {
		if ($("#uniquelyNickname").val().trim() == "") {
			showError($("#nickError"), rss.nicknameMissingTip);
			return false;
		}
	}*/
	if(!$("#uniquelyNickname") || !$("#uniquelyNickname").val() || $("#uniquelyNickname").val()=="") {
		return true;
	}
    if ($("#uniquelyNickname").val().toLowerCase() == "null") {
		showError($("#nickError"), rss.error_70005002);
        return false;
    }

    var uniquelyNickname = $.trim($("#uniquelyNickname").val());
    var bool = /^([^\u4e00-\u9fa5])+$/.test(uniquelyNickname);
    if (!bool || uniquelyNickname.length > 20) {
        showError($("#nickError"), rss.nicknameerror);
        return false;
    }
    return true;
}

function getbirthDate() {
	if(currentSiteID != "7" || localInfo.countryCode=="us") {
		return "";
	}
	var year = $("#year").val();
    var month = $("#month").val();
    var day = $("#day").val();
    if(month.length == 1) {
    	month = "0" + month;
    }
    if(day.length == 1) {
    	day = "0" + day;
    }
    var birth = year+month+day;
    return birth;
}

function getNickName() {
	if(currentSiteID != "7") {
		return "";
	}
	if($("#uniquelyNickname").val()) {
		return $("#uniquelyNickname").val().trim();
	}
}

function getGuardianAccount() {
	if(currentSiteID != "7") {
		return "";
	}
	return localInfo.userAccount;
}


function postAction()
{
	var username = jQuery("#registerForm input[name='formBean.username']");	
	var password = jQuery("#registerForm input[name='formBean.password']");
	var parentPassword = jQuery("#registerForm input[name='parentPassword']");
	var randomCode = jQuery("#registerForm input[name='formBean.randomCode']");
	var authcode = jQuery("#registerForm input[name='formBean.authCode']");

	var countryRegion = $("#countryRegion").val();
	var countryCode = "";
	var siteC = "";
	if(countryRegion.split("-").length > 1) {
		countryCode = countryRegion.split("-")[1];
		siteC = countryRegion;
	}
	
	if(localInfo.createChildFlag=="true")
    {
		siteC=localInfo.currentSiteID+"-"+localInfo.countryCode;
    }
	
	if(localInfo.countryCode=="us" && currentSiteID=="7")
	{
		siteC="7-us";
	}
	
	var pwd=password.val();
	var agreementContentsStr = localInfo.agreementContentsStr;
	
	if(currentSiteID=="7" && $("#adMarketChecked").is(":checked")==false)
	{
		agreementContentsStr=checkAdMarketAgreedAgrContent(agreementContentsStr);
	}
	
	agreementContentsStr = agreementContentsStr.replace(/\$countryCode/g,siteC);
	agreementContentsStr = agreementContentsStr.replace(/\'/g,"\"");
	var strParms="registerCloudAccount";
	var dataParms={
							"userAccount":username.val(),
							"password":pwd,
							"accountType":1,
							"randomAuthCode":randomCode.val(),
							"authCode":authcode.val(),
							"reqClientType":localInfo.reqClientType,
							"registerChannel":localInfo.loginChannel,
							"languageCode":localInfo.lang,
							"countryCode":countryCode,
							"pageToken":localInfo.pageToken,
							"agrVers": agreementContentsStr,
							"thirdLoginFlag":localInfo.thirdLoginFlag==""?false:localInfo.thirdLoginFlag,
							"uniquelyNickname":getNickName(),
							"birthDate":getbirthDate(),
							"guardianAccount":getGuardianAccount(),
							"guardianPassword":parentPassword.val()
						  };
	
	//dataParms.birthDate;
	if(dataParms.guardianAccount && !checkBirthdayWhenCreateChildAcct())
	{
		return;
	}
	
	if(localInfo.currentSiteID=="7" && dataParms.birthDate!="" && dataParms.birthDate!=undefined)
	{
		if(isPastToday(dataParms.birthDate))
		{
			showError($("#register_msg"), rss.rss.birthdayLimitTip);
			return;
		}
	}
	
	var dialogOptions;
	if (rss.msgDialogOverlayClass)
	{
		dialogOptions = {
			overlayClass: rss.msgDialogOverlayClass// 背景层的样式
		};
	}
	
	
	 // 如果成功，并且 是在注册儿童账号，那么进行协议的最后的更新  agreeLetterOfConsent
	 if(localInfo.agreeLetterOfConsent=="false")
	 {
		 var updateSuccessOrNot=false;
		 // 如果没有同意家长同意书，那么这边进行同意
		 updateUserAgrsForParent("[7,13]",function(){
			 updateSuccessOrNot=true;
		 });
		 
		 if(!updateSuccessOrNot)
		 {
			 // 更新家长同意书失败,此时函数整体停止执行。不进行最后的注册。
			 showError($("#register_msg"), rss.uc_error_agreeletterofconsent_error);
			 return;
		 }
	 }
	
	
	ajaxHandler(strParms,dataParms,function(data){
		var strResult=data.isSuccess;
		 if(strResult=="1")
		 {
			 
			 setTimeout(function(){
				 if(localInfo.createChildFlag=="true") {  //表明是创建儿童页面
					 gotoUrl(localHttps + "/portal/userCenter/setting.html" + localInfo.urlQurey);
				 } else {
					 $("#register_msg").show().html("");
					  // 登录
						/*** begin*auto login*****/
						var dataRarmsReg={
								submit:localInfo.submit,
								userAccount:username.val(),
								password:password.val(),
								reqClientType:localInfo.reqClientType,
								loginChannel:localInfo.loginChannel,
								authcode:data.regToken,
								service:htmldecode(localInfo.service),
								loginUrl:localInfo.loginUrl,
								pageToken:localInfo.pageToken
						};
						 
						ajaxHandler("remoteLogin",dataRarmsReg,function(data){			
							if("1"==data.isSuccess)
							{
								gotoUrl(data.callbackURL);
								//window.top.location.href = data.callbackURL;
								return false;
							}
							else
							{
								showErrorReg(data.errorCode);
							}
							
						},function(data){
							
						},false,"JSON");

						/*** end*auto login*****/
					 
					 return true;
				 }
				 
			 }, 2000);

		 }
		 else
		 {
			 showErrorReg(data.errorCode);
		 }
		 
	},function(){
		
	},true,"json", dialogOptions);
}

function isPastToday(ymd) {
	
	 var year = ymd.substring(0, 4);
     var month = ymd.substring(4,6);
     var day = ymd.substring(6,8);
	
    var childrenDay = new Date(year, parseInt(month) - 1, day);
    childrenDay.setFullYear(parseInt(year) + 0);
    var childrenDayTime = childrenDay.getTime();
    var thisDayTime = new Date().getTime();
    return childrenDayTime >= thisDayTime;
}

function showErrorReg(errorCode) {
	if(errorCode=="70001201")
	 {
		 // 系统繁忙，请稍后再试！
		 showError($("#register_msg"), rss.error_70001201_2);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#randomCode").focus();
	 }
	 else if(errorCode=="10000001" || errorCode=="70001101")
	 {
		 // 系统繁忙，请稍后再试！
		 showError($("#register_msg"), rss.error_10000001);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="10002073")
	 {
		 // 密码不符合规则    msg_password 为错误提示规范
		 showError($("#register_msg"), rss.error_10002073);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_10002073);
		 },100);
		// changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70008001")
	 {
		 // 不可是常见密码或弱密码  需要新增密码红框提醒    msg_password
		 showError($("#register_msg"), rss.error_70008001);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_70008001);
		 },100);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#randomCode").focus();
	 }
	 else if(errorCode=="70002070")
	 {
		 // 密码复杂度过低  需要新增密码红框提醒
		 showError($("#register_msg"), rss.error_70002070);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_70002070);
		 },100);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#randomCode").focus();
	 }
	 else if(errorCode=="70001401")
	 {
		 // 系统内部错误
		 showError($("#register_msg"), rss.error_70001401);
		// changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002002")
	 {
		 // 帐号已存在   有待讨论
		 showError($("#register_msg"), rss.error_70002002);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.username']"),$("#msg_email"),rss.error_70002002);
		 },100);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70005003")
	 {
		 // 昵称不符合规范 需要新增密码红框提醒    针对7站点
		 showError($("#register_msg"), rss.error_70005003);
		// changeRandomCode();
		 // uniquelyNickname
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#uniquelyNickname"),$("#nickError"),rss.error_70005003);
		 },100);
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70005002")
	 {
		 // 昵称已经存在     针对欧洲，需要红框提醒  
		 showError($("#register_msg"), rss.error_70005002);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#uniquelyNickname"),$("#nickError"),rss.error_70005002);
		 },100);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70007007")
	 {
		 // 儿童不能同意“家长同意书”      
		 showError($("#register_msg"), rss.error_70007007);
		// changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002003")
	 {
		 //  监护人帐号或者密码错误
		 showError($("#register_msg"), rss.error_70002003);
		// changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70006006")
	 {
		 // 监护人帐号不能为用户名帐号（非邮箱非手机）
		 showError($("#register_msg"), rss.error_70006606);
		// changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70007003")
	 {
		 // 监护人年龄必须大于18岁  
		 showError($("#register_msg"), rss.error_70007003);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70007004")
	 {
		 // 监护人没有同意“家长同意书”
		 showError($("#register_msg"), rss.error_70007004);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70007001")
	 {
		 // 监护人监护的儿童超过上限
		 showError($("#register_msg"), rss.error_70007001);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002067")
	 {
		 // 不在服务区(您所在的地方暂未开通服务)
		 showError($("#register_msg"), rss.error_70002067);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002033")
	 {
		 //  不能注册@inner.up.huawei后缀的邮件地址
		 showError($("#register_msg"), rss.error_70002033);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002018")
	 {
		 // 发送激活邮件失败。
		 showError($("#register_msg"), rss.error_70002018);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002057")
	 {
		 // 验证码已连续错误超过三次
		 showError($("#register_msg"), rss.error_70002057);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002058")
	 {
		 // 密码错误次数过多，请明天再试
		 showError($("#register_msg"), rss.error_70002058);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="70002039")
	 {
		 //  验证码不存在或已过期
		 showError($("#register_msg"), rss.error_70002039);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.authCode']"),$("#msg_phoneRandomCode"),rss.error_70002039);
		 },100);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="10000004")
	 {
		 // 非法操作!
		 showError($("#register_msg"), rss.rss.error_10000004);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else if(errorCode=="10000002")
	 {
		 // 不提供服务!
		 showError($("#register_msg"), rss.error_10000002);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
	 else
	 {
		 // 电子邮箱注册失败！
		 showError($("#register_msg"), rss.js_emailregfail);
		 //changeRandomCode();
		 $("#randomCode").val("");
		 $("#msg_randomCode").show().html("");
	 }
}


function checkExistAuto(f,flagPost)
{
	var e = function(g, x) {
		jQuery(g).show().html(x);
	};
	
	if(f.val().length>50 || f.val().length<5)
	{
//		e("#msg_email",'<span class="vam icon-error">'+rss.login_js_accountlength+'</span>');
		showError($("#msg_email"), rss.login_js_accountlength);
		return;
	}
	
	ec.account.checkExist(
			f.val(),
			f,
			function() {
//				e("#msg_email",'<span class="vam icon-detect">'+rss.js_checking+'</span>');
//				showError($("#msg_email"), rss.js_checking);
				showErrorToBeSeen(jQuery("#registerForm input[name='formBean.username']"),$("#msg_email"), rss.js_checking);
			},
			function() {
//				e("#msg_email","<span class='vam icon-ok' style='display:block'>"+rss.js_usableemail+"</span>");
				showSuccess($("#msg_email"), rss.js_usableemail);
				f.removeClass("error");
				turnErrorToNormal(jQuery("#registerForm input[name='formBean.username']"));
				
				if(flagPost=="getAuthCodePost")
				{
					// 发送邮件
					var email= $("#username").val().trim();
					sendEmailCode(email);
				}

			},
			function() {
//				e("#msg_email","<span class='vam icon-error'>"+rss.js_existemail+"<a target='blank' href='"+getpasswordlink+"&userAccount="+f.val()+"&accountType=1&service="+localInfo.service+"&loginUrl="+localInfo.loginUrl+"&reqClientType="+localInfo.reqClientType+"&loginChannel="+localInfo.loginChannel+"&lang="+rss.lang+"&isDialog="+rss.reg_isDialog+"' style='color:#1155CC'>"+rss.findpwd+"<a/></span>");
//				showError($("#msg_email"), rss.js_existemail);
				showErrorToBeSeen(jQuery("#registerForm input[name='formBean.username']"),$("#msg_email"), rss.js_existemail);
			},
			function() {
//				e("#msg_email","<span class='vam icon-detect'>"+rss.js_timeout+"</span>");
				showError($("#msg_email"), rss.js_timeout);
				f.removeClass("error");
				turnErrorToNormal(jQuery("#registerForm input[name='formBean.username']"));
			});
}


(function(){
	var username= $("#username");
	username.blur(function(){
		$(".seachDiv").css("display","none");
		if(this.value.length>0 && ol.util.isEmail(this.value))
		{
			checkExistAuto(username);
		}
	});

})();


(function(){
	var username= $("#username");
	var seachDiv=$(".seachDiv");
	var seachList=$(".seachDiv ul li");
	var index=-1;
	
	username.keyup(function(){
		
		if(this.value.length>0 && this.value.indexOf("@")>-1)
		{
			var strkey= this.value.split("@")[1];
			var itemsCount=0;
			seachList.each(function(index){
				this.id="searchLi_"+index;
				var thisObj= $("#"+this.id);
				var exmail=thisObj.attr("text");
				
				if(exmail.indexOf(strkey)==-1)
				{
					this.style.display="none";
					$(this).removeClass("showLi");
				}
				else
				{
					itemsCount=itemsCount+1;
					this.style.display="";
					$(this).addClass("showLi");
				}
				exmail=exmail.replace(strkey,"");
				
				var strContent=username.val()+exmail;
				this.innerHTML=strContent;
				
				thisObj.mousedown(function(){
					var strValue= username.val().split("@")[0];
					username.val(strValue+"@"+thisObj.attr("text"));
					seachDiv.css("display","none");
				});
			});
			
			if(itemsCount>0)
			{
				seachDiv.css("display","block");
				$(this).addClass("showLi");
			}
		}
	});
	
	
	 $("#username").bind("keydown",function(evt){
		/**up down key**/
		var liArray=$('.seachDiv ul li.showLi');
		var username= $("#username");
		var seachDiv=$(".seachDiv");
		var thisCurrent= $('.seachDiv ul li.current');
		
		//console.log("liArray.length="+liArray.length);
		
		liArray.each(function(i){
			$(liArray[i]).css("background","#fff");
			$(liArray[i]).removeClass("current");
		});
		
		switch (evt.which) {
        case 38: //上
        	index--;
        	moveSelect(liArray);
            break;
        case 40: //下
        	index++;
        	moveSelect(liArray);
            break;
        case 13: //Enter
        	if(typeof thisCurrent.get(0)!= "undefined" && (thisCurrent.get(0).tagName=="LI" || thisCurrent.get(0).tagName=="li"))
    		{
				var strValue= username.val().split("@")[0];
				username.val(strValue+"@"+thisCurrent.attr("text"));
				seachDiv.css("display","none");
				username.blur();
    		}
        	else
    		{
        		$("#btnSubmit").click();
    		}
            break;
        default:
            return;
    }
	});
	
	var moveSelect=function(liArray)
	{
		if(index<0) index=0;
		if(index>=liArray.length) index=liArray.length-1;
		
		$(liArray[index]).css("background","RGB(173,173,173)");
		$(liArray[index]).addClass("current");
	};
})();

$(document).on("keyup", "#randomCode", function(){
	var randomCode= $(this);
	var randomCodeError=$("#randomCodeError");
	if(typeof(randomCode[0]) !=  "undefined" && randomCode.val().length==4)
	{
		var thisValue=randomCode.val(); //randomCode
		var dataParms={
				randomCode:thisValue,
				session_code_key:"p_reg_email_session_ramdom_code_key",
				pageToken:localInfo.pageToken
		};
		ajaxHandler("authCodeValidate",dataParms,function(data){
			if("1"==data.isSuccess)
			{
//				randomCodeError.removeClass("icon-error");
//				randomCodeError.addClass("icon-ok");
//				randomCodeError.css("display","block");
				showSuccess($("#msg_randomCode"), rss.autoCodeSuccess);
				//$("#btnSubmit").focus();
			}
			else
			{
				chgRandomCode(randomCodeImg[0],localInfo.webssoLoginSessionCode);
//				randomCodeError.removeClass("icon-ok");
				changeRandomCode();
				switch(data.errorCode) 
				{
	 				case '10000201':
					{
//						randomCodeError.html("<span class='vam icon-error'>"+rss.js_wrongcode+"</span>");
	 					showError($("#msg_randomCode"), rss.js_wrongcode);
						break;
					}
	 				case '10000001':
	 				{
//	 					randomCodeError.html("<span class='vam icon-error'>参数错误</span>");
	 					showError($("#msg_randomCode"), rss.error_10000001);
	 					break;
	 				}
	 				case '10000004':
	 				{
//	 					randomCodeError.html("<span class='vam icon-error'>非法操作</span>");
	 					showError($("#msg_randomCode"), rss.error_10000004);
	 					break;
	 				}
	 				default:
	 				{
//	 					randomCodeError.html("<span class='vam icon-error'>不提供服务</span>");
	 					showError($("#msg_randomCode"), rss.error_10000002);
	 					break;
	 				}
				}
				randomCode.focus();
				randomCode.val("");
			}
			
		},function(data){
			
		},false,"JSON");
		
	}
	else if(typeof(randomCode[0]) !=  "undefined" && randomCode.val().length!=4)
	{
		randomCodeError.html("");
	}

});

$(document).keyup(function(evt){
	switch (evt.which) {
	    case 13: //Enter
    		$("#btnSubmit").click();
	        break;
	    default:
	        return;
	}
});


//弹出框
function showSuccessTipDialog(tip1, tip2, tip3, imgPath, btn1, btnLeft, btnRight) {
	var htmlStr = '<div class="dtit">' + tip1 + '</div>';
	htmlStr += '<div class="dcent" style="margin-top: -80px">';
	htmlStr += '<div class="center">';
	htmlStr += '<img class="dimg" src="'+imgPath+'">';
	htmlStr += '<p class="inptips5 mbottom" style="margin-top: -30px">' + tip2 + '</p>';
	htmlStr += '</div>';
	htmlStr += '<p class="inptips3 det-width">' +tip3+ '</p>';
	htmlStr += '<div style="margin-bottom: 50px;margin-top: 30px">';
	htmlStr += '<div class="dbtn3 resendBtn" act="action"  intervaltime="60" id="getActive"><span>'+btn1+'</span><p id="get_authcode_error_info"></p></div>';
	htmlStr += '</div>';
	htmlStr += '</div>';

	var option = {
		title : "",
		btnRight : {
			text : btnRight,
			fn : function() {
				if (isActiveAccount($("#username").val())) {
					 window.location.href=localInfo.loginUrl;
				} else {
					 showError($(".errortip"), rss.verifiedUnfinished);
				}
			}
		},
		btnLeft : {
			text : btnLeft,
			fn : function() {
				this.hide();
			}
		},
		html : htmlStr,
		actions: {
			'action': function() {
				if ($("#getActive").attr("disabled")) {
					return false;
				}
				if (isActiveAccount($("#username").val())) {
					showError($("#get_authcode_error_info"), rss.error_70002019);
					return false;
				}
				getActivateEMailURL($("#username").val(), localInfo.reqClientType, $("#getActive"));
			}
		}
	};
	$("<div>").Dialog(option).Dialog('show');
	$(".userAccount").html($("#username").val());
}

function getAccountInfo(userAcct,isGetAll,callback) {
	var dataParms = {
		"userAccount": userAcct,
		"reqClientType": localInfo.reqClientType,
		"isGetAll":isGetAll,
		"pageToken":localInfo.pageToken
	};
	ajaxHandler("getUserAccInfo", dataParms, function(data) {
		var isSuccess = data.isSuccess;
		if (isSuccess == '1') {
			callback(data);
		}
	}, function() {}, false, "json");
}

function isActiveAccount(userAccount)
{
	var isExist = false;
	getAccountInfo(userAccount,0,function(data){
		if (data && data.isSuccess==1) {
			var datas = data.userAcctInfoList;
			for (var i=0;i<datas.length;i++) {
				var account = datas[i];
				if ((account.accountType == 1 || account.accountType == 2) && account.accountState == 1) {
					isExist = true;
					break;
				}
			}
		}
   });
	return isExist;
}

/**
 * 仅是调用getActivateEMailURL接口
 */
function getActivateEMailURL(userAccount,reqClientType, $btn) {
	var param = {
			accountType:1,
			userAccount:userAccount,
			reqClientType:reqClientType,
			email:userAccount,
			pageToken:localInfo.pageToken
	};
	ajaxHandler("getActivateEMailURL", param, function(data) {
			if (data.isSuccess == 1) {
				$btn.attr("disabled");
				$btn.addClass("auth_code_grey");
				jsInnerTimeout($btn, rss.resend);
			}else {
				$btn.removeAttr("disabled");
				if (data.errorCode == "10000001" || data.errorCode == "70001201")
				{
					showError($("#get_authcode_error_info"), rss.error_10000001);
				}else if (data.errorCode == "10000002")
				{
					showError($("#get_authcode_error_info"), rss.error_10000002);
				}else if (data.errorCode == "10000004")
				{
					showError($("#get_authcode_error_info"), rss.rss.error_10000004);
				}else if (data.errorCode == "70002001")
				{
					showError($("#get_authcode_error_info"), rss.error_70002001);
				}else if (data.errorCode == "70001401")
				{
					showError($("#get_authcode_error_info"), rss.error_70001401);
				}else if (data.errorCode == "70002008")
				{
					showError($("#get_authcode_error_info"), rss.error_70002008);
				}else if (data.errorCode == "70001102")
				{
					showError($("#get_authcode_error_info"), rss.error_70001102_2);
				}else if (data.errorCode == "70001104")
				{
					showError($("#get_authcode_error_info"), rss.error_70001104_3);
				}else if (data.errorCode == "70002019")
				{
					showError($("#get_authcode_error_info"), rss.error_70002019);
				}else if (data.errorCode == "70002009")
				{
					showError($("#get_authcode_error_info"), rss.error_70002009);
				}
				else
				{
					showError($("#get_authcode_error_info"), rss.error_70002018);
				}
			}
		}, function(){}, true, "json");
}

function replaceAgreeAge(ageLimit)
{
	if(ageLimit>0 )
    {
  	  $("#clickAgree").text(rss.common_agree_two_age.format(ageLimit));
    }
    else
    {
  	  $("#clickAgree").text(rss.common_agree_two);
    }
}


function chgRandomCodeForLogin()
{
	var randomCode= $("#randomCode");
	var randomCodeError=$("#randomCodeError");
	changeRandomCode();
	randomCodeError.html("");
	randomCode.val("");
}
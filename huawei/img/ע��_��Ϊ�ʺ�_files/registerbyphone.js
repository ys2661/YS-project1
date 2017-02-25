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
				data:{"userAccount":g,"accountType":2,"pageToken":localInfo.pageToken},
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
	

function checkExistAuto(f)
{
	var e = function(g, x) {
		jQuery(g).show().html(x);
	};
	
	if(f.val().length>15 || f.val().length<5)
	{
//		e("#msg_phone",'<span class="vam icon-error">'+rss.login_js_accountlength+'</span>');
		showError($("#msg_phone"), rss.login_js_accountlength);
		return;
	}
	
	ec.account.checkExist(
			f.val(),
			f,
			function() {
//				e("#msg_phone",'<span class="vam icon-detect">'+rss.checking+'</span>');
				showError($("#msg_phone"), rss.login_js_accountlength);
			},
			function() {
//				e("#msg_phone","<span class='vam icon-ok' style='display:block'>"+rss.usablephone+"</span>");
				showError($("#msg_phone"), rss.unregisteredphone);
				f.removeClass("error");
			},
			function() {
//				e("#msg_phone","<span class='vam icon-error'>"+rss.phoneexist+"<a target='blank' href='"+getpasswordlink+"&userAccount="+f.val()+"&accountType=2&service="+localInfo.service+"&loginUrl="+localInfo.loginUrl+"&reqClientType="+localInfo.reqClientType+"&loginChannel="+localInfo.loginChannel+"&lang="+rss.lang+"&isDialog="+rss.reg_isDialog+"' style='color:#1155CC'>"+rss.findpwd+"<a/></span>");
				showError($("#msg_phone"), rss.phoneexist);
			},
			function() {
//				e("#msg_phone","<span class='vam icon-detect'>"+rss.timeout+"</span>");
				showError($("#msg_phone"), rss.timeout);
				f.removeClass("error");
			});
}


(function(){
	var username= $("#username");
	username.blur(function(){
		var countryCode = $("#countryCode").val()
		if(countryCode.indexOf("+") > -1) {
    		countryCode = countryCode.replace("+", "00");
    	}
		if(checkLengthByCountry(countryCode, username, "#msg_phone", rss.error))  {
			if(this.value.length>0 && valiMobile(this.value))
			{
				checkExistAuto(username);
			}else if(this.value.length == 0){
				showError($("#msg_phone"), rss.emptyphone);
			}else if(!valiMobile(this.value)) {
				showError($("#msg_phone"), rss.error);
			}
		}
	});

})();


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
	
	// localInfo.createChildFlag!="true"  的作用为如果是儿童账号注册，那么13岁的这个限定就不需要考虑了
	if(age < 13 && localInfo.createChildFlag!="true") {
		//showError($("#birthdayError"), rss.ageLimitTip);
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


function submitFun()
{
	if($("#btnSubmit").attr("class").indexOf("sel") == -1) {
		return;
	}
	
	if(!ec.form.validator($("#registerForm"), true))
	{
		showError($("#register_msg"), rss.register_info_error);
		return false;
	}
	
	if(currentSiteID=="7" && localInfo.countryCode!="us") {
		if(!checkBirthday(true)) {
			return false;
		}
	}
	
	if(!checkNickname()) {
		return false;
	}
	
	/*if($(".tick.off").length != 0) {
		console.log($(".tick").data("value"));
		ec.account.showWarn();
		return false;
	}*/
   
	var countryCode = $("#countryCode").val()
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	if(!checkLengthByCountry(countryCode, $("#username"), "#msg_phone", rss.error)) {
		return false;
	}
	
	var usernameObject =$("#username");
	if(!valiMobile(usernameObject.val())) {
		showError($("#register_msg"), rss.error);
		return false;
	}
	checkExistAuto(usernameObject,"regPost","","","","");
}

function checkNickname() {
	if(currentSiteID != "7") {
		return true;
	}
	
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
	if(currentSiteID!="7" || localInfo.countryCode=="us") {
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
	if(currentSiteID != "7" || localInfo.countryCode=="us") {
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


/**
 * reg mobile userAccount
 */
function regPostAction()
{
	var authcode=$("#authCode").val(),
	newpassword=$("#password").val(),
	username=$("#username").val();
	var parentPassword = jQuery("#registerForm input[name='parentPassword']");
	var countryCode="";
	if($("#countryCode").val().indexOf("+") >-1) {
		countryCode=$("#countryCode").val().replace("+","00");
	} else {
		countryCode=$("#countryCode").val();
	}
	username=countryCode+username;
	var countryRegion = $("#countryRegion").val();
	
	var countryCode1 = "";
	var siteC = "";
	if(countryRegion.split("-").length > 1) {
		countryCode1 = countryRegion.split("-")[1];
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
	
	var agreementContentsStr = localInfo.agreementContentsStr;
	
	if(currentSiteID=="7" && $("#adMarketChecked").is(":checked")==false)
	{
		agreementContentsStr=checkAdMarketAgreedAgrContent(agreementContentsStr);
	}
	
	agreementContentsStr = agreementContentsStr.replace(/\$countryCode/g,siteC);
	agreementContentsStr = agreementContentsStr.replace(/\'/g,"\"");
	
	var strParms="registerCloudAccount";
	var parmsData={
			"password":newpassword,
			"userAccount":username,
			"accountType":"2",
			"reqClientType":localInfo.reqClientType,
			"registerChannel":localInfo.loginChannel,
			"authCode":authcode,
			"languageCode":localInfo.lang,
			"countryCode":countryCode1,
			"pageToken":localInfo.pageToken,
			"agrVers": agreementContentsStr,
			"thirdLoginFlag":localInfo.thirdLoginFlag==""?false:localInfo.thirdLoginFlag,
			"uniquelyNickname":getNickName(),
			"birthDate":getbirthDate(),
			"guardianAccount":getGuardianAccount(),
			"guardianPassword":parentPassword.val()
	};
	
	//dataParms.birthDate;
	if(parmsData.guardianAccount && !checkBirthdayWhenCreateChildAcct())
	{
		return;
	}
	
	if(localInfo.currentSiteID=="7" && parmsData.birthDate!="" && parmsData.birthDate!=undefined)
	{
		if(isPastToday(parmsData.birthDate))
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
	
	
	ajaxHandler(strParms,parmsData,function(data){
		 if(data.isSuccess=="1")
		 {
			 setTimeout(function(){
				 
				 if(localInfo.createChildFlag=="true") {
					 gotoUrl(localHttps + "/portal/userCenter/setting.html" + localInfo.urlQurey);
				 }else {
					 $("#register_msg").show().html("");
					 // 登录
					 /*** begin*auto login*****/
					 var dataRarmsReg={
							 
							 submit:localInfo.submit,
							 userAccount:username,
							 password:newpassword,
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
							 return false;
						 }
						 else
						 {
							 showErrorByCode(data.errorCode);
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
//			 $("#register_msg").show().html(rss.phoneregfail);
			 showErrorByCode(data.errorCode);
		 }
	},function(){},true,"json", dialogOptions);
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

function checkLengthByCountry(countryCode, username, errorDiv, errorMsg) {
	if(countryCode.indexOf("+") > -1) {
		countryCode = countryCode.replace("+", "00");
	}
	var names = username.val().trim();
	var len = names.length;
	if(countryCode == "001" && len!=10) { //美国
		showError($(errorDiv), errorMsg);
		return false;
	}
	return true;
}

function showErrorByCode(errorCode) {
	if(errorCode=="70001201")
	 {
		//  系统繁忙，请稍后再试！
//		 $("#msg_randomCode").show().html("<span class='vam icon-error'>参数错误</span>");
		showError($("#register_msg"), rss.error_70001201);
	 }
	 else if(errorCode=="70008001")
	 {
		 //  不可是常见密码或弱密码
		 showError($("#register_msg"), rss.error_70008001);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_70008001);
		 },100);
	 }
	 else if(errorCode=="70002070")
	 {
		// 密码复杂度过低
		 showError($("#register_msg"), rss.error_70002070);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_70002070);
		 },100);
	 }
	 else if(errorCode=="10000001")
	 {
		 // 系统繁忙，请稍后再试！
//		 $("#register_msg").show("<span class='vam icon-error'>参数错误，参数不符合规则</span>");
		 showError($("#register_msg"), rss.error_10000001);
	 }
	 else if(errorCode=="70001401")
	 {
		 // 系统内部错误
//		 $("#register_msg").show("<span class='vam icon-error'>系统内部错误</span>");
		 showError($("#register_msg"), rss.error_70001401);
	 }
	 else if(errorCode=="70002002")
	 {
		 // 帐号已存在
//	 	$("#register_msg").show("<span class='vam icon-error'>"+rss.js_existemail+"<a target='blank'  href='"+getpasswordlink+"&userAccount="+username.val()+"&accountType=1&service="+localInfo.service+"&loginUrl="+localInfo.loginUrl+"&reqClientType="+localInfo.reqClientType+"&loginChannel="+localInfo.loginChannel+"&lang="+rss.lang+"&isDialog="+rss.reg_isDialog+"' style='color:#1155CC'>"+rss.findpwd+"<a/></span>");
		 showError($("#register_msg"), rss.error_70002002);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.username']"),$("#msg_phone"),rss.error_70002002);
		 },100);
	 }
	 else if(errorCode=="70005003")
	 {
		 // 昵称不符合规范 需要新增密码红框提醒    针对7站点
//		 $("#register_msg").show("<span class='vam icon-error'>昵称不符合规范</span>");
		 showError($("#register_msg"), rss.error_70005003);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#uniquelyNickname"),$("#nickError"),rss.error_70005003);
		 },100);
	 }
	 else if(errorCode=="70005002")
	 {
		 // 昵称已经存在
//		 $("#register_msg").show("<span class='vam icon-error'>昵称已经存在</span>");
		 showError($("#register_msg"), rss.error_70005002);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#uniquelyNickname"),$("#nickError"),rss.error_70005002);
		 },100);
	 }
	 else if(errorCode=="70007007")
	 {
		 //  儿童不能同意“家长同意书”
//		 $("#register_msg").show("<span class='vam icon-error'>儿童不能同意“家长同意书”</span>");
		 showError($("#register_msg"), rss.error_70007007);
	 }
	 else if(errorCode=="70002003")
	 {
		 // 监护人帐号或者密码错误
//		 $("#register_msg").show("<span class='vam icon-error'>监护人帐号或者密码错误</span>");
		 showError($("#register_msg"), rss.error_70002003);
	 }
	 else if(errorCode=="70006006")
	 {
		 // 监护人帐号不能为用户名帐号（非邮箱非手机）
//		 $("#register_msg").show("<span class='vam icon-error'>监护人帐号不能为非邮箱地址非手机号帐号</span>");
		 showError($("#register_msg"), rss.error_70006606);
	 }
	 else if(errorCode=="70007003")
	 {
		 // 监护人年龄必须大于18岁 
//		 $("#register_msg").show("<span class='vam icon-error'>监护人年龄必须大于18岁</span>");
		 showError($("#register_msg"), rss.error_70007003);
	 }
	 else if(errorCode=="70007004")
	 {
		 // 监护人没有同意“家长同意书”
//		 $("#register_msg").show("<span class='vam icon-error'>监护人没有同意“家长同意书”</span>");
		 showError($("#register_msg"), rss.error_70007004);
	 }
	 else if(errorCode=="70007001")
	 {
		 // 监护人监护的儿童超过上限
//		 $("#register_msg").show("<span class='vam icon-error'>监护人监护的儿童超过上限</span>");
		 showError($("#register_msg"), rss.error_70007001);
	 }
	 else if(errorCode=="70002067")
	 {
		 // 不在服务区(您所在的地方暂未开通服务)
//		 $("#register_msg").show("<span class='vam icon-error'>不在服务区(您所在的地方暂未开通服务)</span>");
		 showError($("#register_msg"), rss.error_70002067);
	 }
	 else if(errorCode=="70002033")
	 {
		 // 不能注册@inner.up.huawei后缀的邮件地址
//		 $("#register_msg").show("<span class='vam icon-error'>不能注册@inner.up.huawei后缀的邮箱地址</span>");
		 showError($("#register_msg"), rss.error_70002033);
	 }
	 else if(errorCode=="70002018")
	 {
		 // 发送激活邮件失败。
//		 $("#register_msg").show("<span class='vam icon-error'>发送激活邮件失败</span>");
		 showError($("#register_msg"), rss.error_70002018);
	 }
	 else if(errorCode=="70002057")
	 {
		 // 验证码已连续错误超过三次
//		 $("#register_msg").show("<span class='vam icon-error'>密码已连续错误四次</span>");
		 showError($("#register_msg"), rss.error_70002057);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.authCode']"),$("#msg_phoneRandomCode"),rss.error_70002057);
		 },100);
	 }
	 else if(errorCode=="10002073")
	 {
		 // 密码不符合规则
		 showError($("#register_msg"), rss.error_10002073);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.password']"),$("#msg_password"),rss.error_10002073);
		 },100);
	 }
	 else if(errorCode=="70002058")
	 {
		 // 输入的验证码错误次数过多，请明天再试
//		 $("#register_msg").show("<span class='vam icon-error'>密码连续错误过多，帐号被锁定10分钟</span>");
		 showError($("#register_msg"), rss.error_70002058);
	 }
	 else if(errorCode=="70002039")
	 {
		 // 验证码不存在或已过期
//		 $("#register_msg").show("<span class='vam icon-error'>验证码不存在、错误或者过期</span>");
		 showError($("#register_msg"), rss.error_70002039);
		 window.setTimeout(function(){
			 showErrorToBeSeen(jQuery("#registerForm input[name='formBean.authCode']"),$("#msg_phoneRandomCode"),rss.error_70002039);
		 },100);
	 }
	 else if(errorCode=="10000004")
	 {
		 // 非法操作!
//		 $("#register_msg").show("<span class='vam icon-error'>非法操作</span>");
		 showError($("#register_msg"), rss.error_10000004);
	 }
	 else if(errorCode=="10000002")
	 {
		 // 不提供服务!
//		 $("#register_msg").show("<span class='vam icon-error'>不提供服务</span>");
		 showError($("#register_msg"), rss.error_10000002);
	 } 
	 else if(errorCode=="10000505")
	 {
		 
//		 $("#register_msg").show("<span class='vam icon-error'>不提供服务</span>");
		 showError($("#register_msg"), rss.error_10000505);
	 }  
	 else {
		 //  需要二次登录认证。
//		 $("#register_msg").show().html("需要二次登录认证。");
		 showError($("#register_msg"), rss.smsSendDefErr);
	 }
}

(function() {
	var a = ec.account.checkExist = function(g, f, e, b, d, c) {
		if (g == f.attr("acceptValue")) {
			b(f);
			return;
		}
		e();
		var cuntryCode= $("#countryCode").val();
		if(cuntryCode.indexOf("+") > -1) {
			cuntryCode = cuntryCode.replace("+","00");
		}
		var phone= cuntryCode+f.val();
	
		ec.Cache.get("checkExist_ajax", function() {
			return new ec.ajax();
		}).post(
				{
					url :getWebUrlHttps()+"isExsitUser?random="+new Date().getTime(),
					data:{"userAccount":phone,"pageToken":localInfo.pageToken},
					timeout : 12000,
					timeoutFunction : c,
					successFunction : function(data) {
						var resulte=data.existAccountFlag;
						if (resulte=="0") {
							f.attr("acceptValue", g);
							b(f);
						}
						else
						{
							d(f);
						}
					},
					errorFunction :function(data){
						var resulte=data.existAccountFlag;
						if (resulte=="0") {
							f.attr("acceptValue", g);
							b(f);
						}
						else
						{
							d(f);
						}
					}
				});
	};
	ec.account.register = {
		submit : function(b) {
			if (!ec.form.validator(b, false)) {
				return false;
			}
			return true;
		}
	};
})();

ec.account.showAgreement = function() {
	new ec.box($("#agreement_content").val(), {
		boxid : "agreement_box",
		title : rss.agreement,
		showButton : true,
		boxclass : "ol_box agreement-area",
		remember : true,
		height : 350,
		width : 740,
		autoHeight : false
	}).open();
};

/**
 * 提示注册协议必须勾选
 */
ec.account.showWarn = function() {
	var strContentHtml="<div style='margin:20px 50px auto 50px;color:red;font-weight:bold;'>"+rss.regprotocol+"</div>";
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

ec.account.authCodeDialog = function() {
	new ec.box($("#authCodeDialog_content").val(), {
		boxid : "authCodeDialog_box",
		title : rss.getsmscode,
		showButton : false,
		boxclass : "ol_box agreement-area",
		remember : true,
		height : 120,
		width : 400,
		autoHeight : false
	}).open();
};

ec.ready(function() {
			var e = function(g, f) {
				jQuery(g).show().html(f);
			};
			var d = jQuery("#registerForm input[name='formBean.username']");			
			var c = jQuery("#registerForm input[name='formBean.password']");
			var a = jQuery("#registerForm input[name='checkPassword']");
			var b = jQuery("#registerForm input[name='formBean.authCode']");
			var pp = jQuery("#registerForm input[name='parentPassword']");
			
			var btnSubmit = $("#btnSubmit");
			
			var countryCode = $("#countryCode").val()
			if(countryCode.indexOf("+") > -1) {
	    		countryCode = countryCode.replace("+", "00");
	    	}
	    	if(countryCode == "001") { //美国
	    		ec.form.validator.bind(d, {
					type : [ "require", "length" ],
					min : 10,
					max : 10,
					trim:true,
					validOnChange : true,
					msg_ct : "#msg_phone",
					msg : {
						require : rss.emptyphone,
						"default" :rss.error
					},
					errorFunction : function(obj,options){
						switch(options.type){
							case "require":
								showErrorToBeSeen(d,$("#msg_phone"),rss.emptyphone);
								break;
							default:
								showErrorToBeSeen(d,$("#msg_phone"),rss.error);
								break;
						}
					},
					successFunction : function(f) {
						turnErrorToNormal(d);
					}
					
				});
	    	} else {
	    		ec.form.validator.bind(d, {
	    			type : [ "require", "length" ],
	    			min : 5,
	    			max : 15,
	    			trim:true,
	    			validOnChange : true,
	    			msg_ct : "#msg_phone",
	    			msg : {
	    				require : rss.emptyphone,
	    				"default" :rss.error
	    			},
	    			errorFunction : function(obj,options){
						switch(options.type){
							case "require":
								showErrorToBeSeen(d,$("#msg_phone"),rss.emptyphone);
								break;
							default:
								showErrorToBeSeen(d,$("#msg_phone"),rss.error);
								break;
						}
					},
					successFunction : function(f) {
						turnErrorToNormal(d);
					}
	    		});
	    	}
			ec.form.validator.bind(c, {
				type : [ "require", "length","password","pwdformat" ],
				trim : false,
				validOnChange : true,
				min : 8,
				max : 32,
				msg_ct : "#msg_password",
				msg : {
					require : rss.inputpwd,
					length : rss.modifyUserPwd_input_8_32_chars,
					password : rss.modifyUserPwd_input_8_32_complax_chars_desc,
					pwdformat : rss.common_js_pwd_account_same_reverse
				},
				errorFunction : function(obj,options){
					switch(options.type){
						case "require":
							showErrorToBeSeen(c,$("#msg_password"),rss.inputpwd);
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
			ec.form.validator.bind(a, {
				type : [ "require", "eq" ],
				trim : false,
				validOnChange : true,
				compareTo : c,
				msg_ct : "#msg_checkPassword",
				msg : {
					require :rss.confirmpwd,
					eq : rss.pwdnotsame
				},
				errorFunction : function(obj,options){
					switch(options.type){
						case "require":
							showErrorToBeSeen(a,$("#msg_checkPassword"),rss.confirmpwd);
							break;
						case "eq":
							showErrorToBeSeen(a,$("#msg_checkPassword"),rss.pwdnotsame);
							break;
					}
				},
				successFunction : function(f) {
					turnErrorToNormal(a);
				}
			});
			
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
//					e("#msg_phoneRandomCode","<span class='vam icon-ok'>&nbsp;</span>");
					turnErrorToNormal(b);
				}
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
    							showErrorToBeSeen($("#uniquelyNickname"),$("#msg_checkPassword"),rss.nicknameLengthLimit);
    							break;
    						case "nickname":
    							showErrorToBeSeen($("#uniquelyNickname"),$("#msg_checkPassword"),rss.nicknameerror);
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
			
			ec.ui.hover(d).hover(b).hover(c).hover(a).hover(pp);
			ec.form.input.label(d,rss.inputnumber).label(c, rss.pwdlength).label(a,rss.pwdlength).label(b, rss.codelength);
//			d.focus();
			
			if(currentSiteID == "7") {
				ec.form.validator.bind(pp, {
					type : [ "require", "length","password","pwdformat"],
					trim:false,
					validOnChange : true,
					min : 8,
					max : 32,
					msg_ct : "#msg_checkPassword_parent",
					msg : {
						require : rss.inputpwd,
						length : rss.modifyUserPwd_input_8_32_chars,
						password : rss.modifyUserPwd_input_8_32_complax_chars_desc,
						pwdformat : rss.common_js_pwd_account_same_reverse
					},
					errorFunction : function(obj,options){
    					switch(options.type){
    						case "require":
    							showErrorToBeSeen(pp,$("#msg_checkPassword_parent"),rss.inputpwd);
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
				ec.form.input.label(pp,rss.modifyUserPwd_input_8_32_chars);
			}
			
			btnSubmit.bind("click",submitFun);
			c.bind("keyup",function(){onPwdKeyUp(c[0]);});
		});
	
		ec.form.validator.register("pwdComplax", function(b_val, a) {
			if (a.allowEmpty && ec.util.isEmpty(b_val)) {
				return true;
			}
			
			return isPWDComplex(b_val);
		});
		
	function checkExistAuto(f,flagPost,smsReqType,session_code_key,reqClientType,lang)
	{
		var e = function(g, x) {
			jQuery(g).show().html(x);
		};
		
		ec.account.checkExist(f.val(),f,
				function() {
					showWarning($("#msg_phone"), rss.checking);
				},
				function() {
					
					if(flagPost!="regPost")
					{
						showSuccess($("#msg_phone"), rss.unregisteredphone);
						f.removeClass("error");
					}
					if(flagPost=="regPost")
					{
						regPostAction();
					}
					if(flagPost=="getAuthCodePost")
					{
						var strUserAccount="";
						if($("#countryCode").val().indexOf("+") >-1) {
							strUserAccount=$("#countryCode").val().replace("+","00")+f.val();
						} else {
							strUserAccount=$("#countryCode").val()+f.val();
						}
						sendSMS(strUserAccount,reqClientType,lang);
					}
				},
				function() {
//					e("#msg_phone","<span class='vam icon-error'>"+rss.phoneexist+"<a target='blank' href='"+localInfo.getpasswordlink+"&userAccount="+f.val()+"&accountType="+localInfo.accountType+"&service="+localInfo.service+"&loginUrl="+localInfo.loginUrl+"&reqClientType="+localInfo.reqClientType+"&loginChannel="+localInfo.loginChannel+"&lang="+localInfo.lang+"&isDialog="+rss.reg_isDialog+"' style='color:#1155CC'>"+rss.findpwd+"<a/></span>");
					showError($("#msg_phone"), rss.phoneexist);
				},
				function() {
//					e("#msg_phone","<span class='vam icon-detect'>"+rss.timeout+"</span>");
					showError($("#msg_phone"), rss.timeout);
					f.removeClass("error");
		  });
	}	

	function sendSMS(phoneNumber,reqClientType,lang){
		var getCodeButton=$("#getValiCode");
		
		var strParms="getSMSAuthCode";
		var dataParms={
				"userAccount":phoneNumber,
				"smsReqType":"4",
				"reqClientType":reqClientType,
				"pageToken":localInfo.pageToken,
				"accountType":2,
				"siteID":localInfo.currentSiteID,
				"languageCode":localInfo.lang
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
				  	showSuccess($("#msg_getPhoneRandomCode"), rss.smsHasSendTo.format(getExpressPhone(dataParms.userAccount)));
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
	 				case '70001201': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>参数错误</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
	 				case '70001401': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>系统内部错误</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001401);
	 					break;
	 				}
	 				case '70002002': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>用户不存在</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70002002);
	 					break;
	 				}
	 				case '70002001': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>用户已存在</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70002001);
	 					break;
	 				}
	 				case '70002028': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>用户没有传入的手机号码</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70002028);
	 					break;
	 				}
	 				case '70002046': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>手机号已经激活</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70002046);
	 					break;
	 				}
	 				case '70002030': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>短信验证码发送失败</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70002030);
	 					break;
	 				}
	 				case '70001102': {
//						$("#msg_phoneRandomCode").html("<span class='vam icon-error'>获取验证码短信次数较为频繁， 1分钟后可重试。</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001102);
	 					break;
	 				}
	 				case '70001104': {
//						$("#msg_phoneRandomCode").html("<span class='vam icon-error'>获取验证码短信次数过于频繁， 24小时后可重试</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001104);
	 					break;
	 				}
	 				case '10000004': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>非法操作</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_10000004);
	 					break;
	 				}
	 				case '10000002': {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>不提供服务</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
	 				default: {
//	 					$("#msg_phoneRandomCode").html("<span class='vam icon-error'>获取验证码错误</span>");
	 					showError($("#msg_getPhoneRandomCode"), rss.error_70001201);
	 					break;
	 				}
				}
		    }	
		  },function(){},true,"JSON", dialogOptions);
	}
	
  
    $("#selectCountryImg").click(function(){
            openCountryCodeDialog(countryRegions);
            
        });
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

//这个函数的主要功能就是展示  对应的agreeTwo
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
	
	function getAgreementContent(country) {
		var agrContentArr =[];
		var dataParms = {
			"pageToken" : localInfo.pageToken,
			"reqClientType" : localInfo.reqClientType,
			"lang" : localInfo.lang,
			// "agrIDs" : "[0,2]",   只要传了countryCode,那么注册的时候，应该同意那些协议，就是确定的。
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
				
				localInfo.agreementContentsStr=data.agreeForReg;
				
				localInfo.ageLimit=data.ageLimit;
				
				var htmlStr = "";
				
				var adAgreeOrNot=false;
				
				for (var i = 0; i < agrContentArr.length; i++) {
					
					var agreement = agrContentArr[i];
					
					
					//htmlStr += '<div class="node"><div class="node-title">'+agreement.agrTitle + '</div>' ;//'<a class="reg-more r" target="_blank" href="'+agreement.agrHref+'">'+rss.more_details+'> </a></div>';
					htmlStr += '<div class="node-intro agrLineH">'+agreement.agrBrief+'</div>';
					//htmlStr += '<div class="agree" style="visibility: hidden">';
					//htmlStr += '<b class="tick" style="visibility: hidden" ver="'+agreement.agrVer+'"></b>';
					//htmlStr += rss.agree;
					htmlStr += '</div><div class="box-shadow-in"></div></div>';
						
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
	
	function getMobileCode(smsReqType,session_code_key,reqClientType,lang)
	{
		var mobilephone= $("#username").val();
		if(mobilephone=="")
		{
//			$("#msg_phone").html("<span class='vam icon-error'>"+rss.phoneemptyfail+"</span>");
			showError($("#msg_phone"), rss.phoneemptyfail);
			return;
		}
		
		if(!valiMobile(mobilephone))
		{
//			$("#msg_phone").html("<span class='vam icon-error'>"+rss.error+"</span>");
			showError($("#msg_phone"), rss.error);
			return;
		}
		
		var countryCode = $("#countryCode").val()
		if(countryCode.indexOf("+") > -1) {
			countryCode = countryCode.replace("+", "00");
		}
		if(!checkLengthByCountry(countryCode, $("#username"), "#msg_phone", rss.error)) {
			return;
		}
		
		$("#msg_phone").html("");
		$("#msg_phoneRandomCode").html("");
		$("#register_msg").html("");
		
		var useraccountcheck=$("#username");
		checkExistAuto(useraccountcheck,"getAuthCodePost",smsReqType,session_code_key,reqClientType,lang);
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
	

	function changePhoneCode (){
		var userAcount=$("#username").val();
		var lang_select= jQuery("#input_languageCode").find("option:selected").val();
		var msg_phone_obj=$("#msg_phone");
		var flagValiResult=true;
		
		if(lang_select == "+86")
		{
			if (userAcount.length < 11) {
				flagValiResult= false;
			}
			else
			{
				flagValiResult= /^(1[34578])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/.test(userAcount);
			}
		}
		else
		{
			flagValiResult= /^[0-9]{5,15}$/.test(userAcount);
		}
		
		if(userAcount=="")
		{
			msg_phone_obj.html("");
			return false;
		}
		
		if(!flagValiResult)
		{
//			msg_phone_obj.html("<span class='vam icon-error'>"+rss.error+"</span>");
			showError(msg_phone_obj, rss.error);
			return false;
		}
		
		userAcount=lang_select.replace("+","00")+userAcount;
		var strParms="isExsitUser";
		var parmsData={
				"userAccount":userAcount,
				"pageToken":localInfo.pageToken
		};
		
		ajaxHandler(strParms,parmsData,function(data){
			 if(data.isSuccess=="1" && data.existAccountFlag=="0")
			 {
//				 msg_phone_obj.html("<span class='vam icon-ok'>"+rss.usablephone+"</span>");
				 showSuccess(msg_phone_obj, rss.unregisteredphone);
			 }
			 else
			 {
//				 msg_phone_obj.html("<span class='vam icon-error'>"+rss.phoneexist+"<a target='blank' href='"+localInfo.getpasswordlink+"&userAccount="+userAcount+"&accountType="+localInfo.accountType+"&service="+localInfo.service+"&loginUrl="+localInfo.loginUrl+"&reqClientType="+localInfo.reqClientType+"&loginChannel="+localInfo.loginChannel+"&lang="+localInfo.lang+"&isDialog="+rss.reg_isDialog+"' style='color:#1155CC'>"+rss.findpwd+"<a/></span>");
				 showError(msg_phone_obj, rss.phoneexist);
			 }
		},function(){},true,"json");
		
		
		
	}
	
	function valiMobile(b)
	{
		if(b.indexOf(" ")>-1) {
			return false;
		}
		b=$.trim(b);
		if(b.length==0)
		{
			return true;
		}
		var lang_select= jQuery("#countryCode").val();
		
		if(lang_select == "0086" || lang_select == "+86")
		{
			if (b.length < 11) {
				return false;
			}
			return /^(1[34578])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/.test(b);
		}
		else
		{
			return /^[0-9]{5,15}$/.test(b) ;
		}
	}
	
	function replaceAgreeAge(ageLimit)
	{
		if(ageLimit>0)
	    {
	  	  $("#clickAgree").text(rss.common_agree_two_age.format(ageLimit));
	    }
	    else
	    {
	  	  $("#clickAgree").text(rss.common_agree_two);
	    }
	}
	
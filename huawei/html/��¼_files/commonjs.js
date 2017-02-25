var tips=[];
var cfgRegex={
		chinesePhone:/^(1[34578])[0-9]{9}$|(^(\+|00)852[9865])[0-9]{7}$/,
		hwPhone:/^[0-9]{5,10}$/,
		email:/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9\-]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/i,
		anyPhoneAndMail:/^(1[34578])[0-9]{9}$|^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w+)\s*$/,
		anyPhone:/^[0-9]{5,15}$/
};

function gotoUrl(strUrl)
{
	location.href=strUrl;
}

//去掉左右空格
function Trim(text) { 
	return text.replace(/(^\s*)|(\s*$)/g, ""); 
	} 
/**
 * 用于验证表单
 * @param valiType 枚举的类型可以选择如下：email、mobile、password、mobilecode
 * @param strContent 被验证的字符内容
 * @returns 返回true、false
 **/
function valiRegular(valiType,strContent)
{
	var regular="";
	
	switch (valiType) {
	case "email":
		regular=/^\s*([A-Za-z0-9_-]+(\.\w+)*@(\w+\.)+\w+)\s*$/;
		break;
	case "mobile":
		regular=/^1\d{10}$/;
		break;
	case "password":
		regular=/^\S{6,32}$/;
		break;
	case "mobilecode":
		regular=/^\S{4}$/;
		break;
	}
	
	return regular.test(strContent);
}

/**
|    locationSearch:字符串如:?a=b&b=2&c=3
|    key:关键字
|    return key所对应的value
**/    
function getParmPoint(locationSearch,key)
{
	  var strArray= locationSearch.split("#");
	  	  
	  for(var i=0;i<strArray.length;i++)
		  {
			  var varTemp= strArray[i].split("=")[0];
			  var varTempValue= strArray[i].split("=")[1];
			  if(varTemp==key)
			  {
			  return varTempValue;
			  }
		  }
	  return "";
}

/**
 * 获取手机验证码
 **/
function getMobileCode(smsReqType,reqClientType,lang)
{
	var mobilephone= $("#username").val();
	var account=$("#account").val();
	var nationalcode=$("#input_languageCode").val();
	var getCodeButton=$("#getValiCode");
	getCodeButton.attr("IntervalTime",60);
	getCodeButton.attr("disabled","disabled");
	
	var pageTokenObj=$("#pageTokenID");
	
	if("undefined" != typeof nationalcode)
	{
		mobilephone=nationalcode.replace("+","00")+mobilephone;
	}
	if(mobilephone=="")
	{
		$("#msg_phone").html("<span class='vam icon-error'>手机号码不能为空！</span>");
		getCodeButton.removeAttr("disabled");
		return;
	}
	var parms="getMobileValiCode";
	$.ajax({
		  url: getWebUrl()+parms,
		  data:{
				"account":account,
				"reqClientType":reqClientType,
				"smsReqType":smsReqType,
				"lang":lang,
				"pageToken":pageTokenObj.val(),
				"mobile":mobilephone
		  },
		  type: "POST", 
		  dataType:"text",
		  success: function(data) {
			  if (data.errorCode == "10000004") {
				  $("<div>").Dialog({
					  title: rss.hint,
					  btnLeft: false,
					  btnRight: {
						  text: rss.IGetIt || "OK",
						  fn: function() {
							  this.hide();
						  }
					  },
					  html: "<p>" +rss.loginOverdue+ "</p>"
				  }).Dialog("show");
				  return;
			  }
				if(data=="success")
				{
					getCodeButton.addClass("auth_code_grey");
					jsInnerTimeout();
				}
				else if(data=="70001102")
				{
					getCodeButton.removeAttr("disabled");
					$("#showerror").html("<span class='vam icon-error'>一分钟内只允许请求一次，请稍后重试</span>");
				}
				else if(data=="70001103")
				{
					getCodeButton.removeAttr("disabled");
					$("#showerror").html("<span class='vam icon-error'>超出一周内6条发送验证码的最大次数</span>");
				}
				else if(data=="70001104")
				{
					getCodeButton.removeAttr("disabled");
					$("#showerror").html("<span class='vam icon-error'>超出一天发送验证码最大次数</span>");
				}
				else
				{
					getCodeButton.removeAttr("disabled");
					$("#showerror").html("<span class='vam icon-error'>获取验证码失败！</span>");
				}
		  	}
		});
}


function jsInnerTimeout()
{
	var codeObj=$("#getValiCode");
	var intAs=parseInt(codeObj.attr("IntervalTime"));

	intAs--;
	codeObj.attr("disabled","disabled");
	if(intAs<=-1)
	{
		codeObj.removeAttr("disabled");
		if(typeof codeObj.val() !="undefined")
		{
		codeObj.val(rss.resend);
		}
		else
		{
		 codeObj.html(rss.resend);	
		}
		codeObj.removeClass("auth_code_grey");
		return true;
	}
	if(typeof codeObj.val()!="undefined")
	{
	codeObj.val(rss.resend_time.format(intAs));
	}
	else
	{
		codeObj.html(rss.resend_time.format(intAs));
	}
	codeObj.attr("IntervalTime",intAs);
	
	setTimeout("jsInnerTimeout()",1000);
} 



function ajaxJSONP(axjxUrl,queryParms,callbackfun)
{
	$.getJSON(axjxUrl+queryParms+"&reflushCode="+Math.random()+"&callback=?",callbackfun);
}

function ajaxHandler(interfaceName,dataParms,successFun,errorFun,isAsync,respnseDataType, dialogOptions)
{
	var responseData=$.ajax({
					  url: getWebUrlHttps()+interfaceName+"?reflushCode="+Math.random(),
					  type: "POST", 
					  data:dataParms,
					  success: function(data) {
						  if ($("#logoutUrl").attr("href") && (data.errorCode == "10000302")) {						      
							  window.location.href = $("#logoutUrl").attr("href");
					          return;
						  }	
						  
						  if (data.errorCode == "10000004") {
							  var defaultOptions = {
									  title: rss.hint,
									  btnLeft: false,
									  btnRight: {
										  text: rss.IGetIt || "OK",
										  fn: function() {
											  this.hide();
											  if(isMobile() || (window.location.pathname.indexOf("mobile") >-1) ) {
												  gotoUrl(localHttps + "/mobile/standard/welcome.html" + localInfo.urlQurey);
											  }
										  }
									  },
									  html: "<p>" +rss.loginOverdue+ "</p>"
								  };
							  
							  if (dialogOptions)
							  {
								  $.extend( defaultOptions, dialogOptions );
							  }
							  
							  
							  $("<div>").Dialog(defaultOptions).Dialog("show");
							  return;
						  }
						  
						  if (data.errorCode == "70001105") {
                              $("<div>").Dialog({
                                  title: rss.hint,
                                  btnLeft: false,
                                  btnRight: {
                                      text: rss.IGetIt || "OK",
                                      fn: function() {
                                          this.hide();
                                          if(isMobile()|| (window.location.pathname.indexOf("mobile") >-1) ) {
											  gotoUrl(localHttps + "/mobile/standard/welcome.html" + localInfo.urlQurey);
										  }
                                      }
                                  },
                                  html: "<p>" +rss.overload+ "</p>"
                              }).Dialog("show");
                              return;
                          }
						  
						  successFun(data);
					  },
					  error:errorFun,
					  cache:false, 
					  dataType:respnseDataType,
					  async:isAsync
					});
	
	return responseData;
}

function ajaxHandlerAny(url,dataParms,successFun,errorFun,isAsync,respnseDataType)
{
	var responseData=$.ajax({

					  url: url,
					  type: "POST", 
					  data:dataParms,
					  success: function(data) {
						  if (data.errorCode == "10000004") {
							  $("<div>").Dialog({
								  title: rss.hint,
								  btnLeft: false,
								  btnRight: {
									  text: rss.IGetIt || "OK",
									  fn: function() {
										  this.hide();
										  if(isMobile()|| (window.location.pathname.indexOf("mobile") >-1) ) {
											  gotoUrl(localHttps + "/mobile/standard/welcome.html" + localInfo.urlQurey);
										  }
									  }
								  },
								  html: "<p>" +rss.loginOverdue+ "</p>"
							  }).Dialog("show");
							  return;
						  }
						  successFun(data);
					  },
					  error:errorFun,
					  cache:false, 
					  dataType:respnseDataType,
					  async:isAsync
					});
	
	return responseData;
}


/**
|    函数名称： setCookie
|    函数功能： 设置cookie函数
|    入口参数： name：cookie名称；value：cookie 值
**/
function setCookie(name, value) 
{ 
    var argv = setCookie.arguments; 
    var argc = setCookie.arguments.length; 
    var expires = (argc > 2) ? argv[2] : null; 
    if(expires!=null) 
    { 
        var LargeExpDate = new Date (); 
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));         
    } 
    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()))+"; path=" + "/"; 
}

/**
|    函数名称： getCookie 
|    函数功能： 读取cookie函数
|    入口参数： Name：cookie名称 
**/
function getCookie(Name) 
{ 
    var search = Name + "=" ;
    if(document.cookie.length > 0) 
    { 
        offset = document.cookie.indexOf(search);
        if(offset != -1) 
        { 
            offset += search.length;
            end = document.cookie.indexOf(";", offset); 
            if(end == -1) end = document.cookie.length; 
            return unescape(document.cookie.substring(offset, end)); 
        } 
        else return ""; 
    } 
} 

/**
|    函数名称： deleteCookie
|    函数功能： 删除cookie函数
|    入口参数： Name：cookie名称
**/    
function delCookie(name) 
{ 
     var expdate = new Date(); 
     expdate.setTime(expdate.getTime() - (86400 * 1000 * 1)); 
     setCookie(name, "", expdate); 
} 

/**
|    locationSearch:字符串如:?a=b&b=2&c=3
|    key:关键字
|    return key所对应的value
**/    
function getParm(locationSearch,key)
{
	  var tempQurey= locationSearch.replace("?","");
	  var strArray= tempQurey.split("&");
	  
	  for(var i=0;i<strArray.length;i++)
		  {
			  var varTemp= strArray[i].split("=")[0];
			  var varTempValue= strArray[i].split("=")[1];
			  if(varTemp==key)
			  {
			  return varTempValue;
			  }
		  }
	  return "";
}

function chkPwdComplexity(pass){ 
	if(pass.length < 8){   
	    return 0;
	} 
	var ls = 0; 
	if(pass.length>=8&&pass.length<=32){
		ls=1;
		
		}   
	if(pass.match(/([0-9])+/)){ 
		ls=1;
		
		}   
	if(pass.match(/([A-Z])+/)&&pass.match(/([a-z])+/)){
		ls=1;
		
		}
	if(pass.match(/([0-9])+/)&&pass.match(/([A-Z])+/)&&pass.match(/([a-z])+/)&&pass.length>=8&&pass.length<=32)
	{
		ls=2;
		if(getRepet(pass)>3)
		{
		ls=3;	
		}
	}
    return ls;
}
//获得密码的复杂度对象
function getPwdComplexity(pass)
{
	
	var complex={strong:0,
	             upLowChar:false,
	             length:false,
	             number:false
	};
	if(pass.length>=8&&pass.length<=32){
		
		complex.length=true;
		}   
	if(pass.match(/([0-9])+/)){ 
		
		complex.number=true;
		}   
	if(pass.match(/([A-Z])+/)&&pass.match(/([a-z])+/)){
		
		complex.upLowChar=true;
		}
	

		
	
	
	complex.strong=chkPwdComplexity(pass);
	
  return complex;	
}

function getRepet(s)
{
	s=s+"";
	var i,
	    length=s.length,
	    count=0,
	    obj={};
	  for(i=0;i<length;i++)
	   {
		obj[s.charAt(i)]=1;
	   }
	  for(i in obj)
	  {
		if(obj.hasOwnProperty(i))
			{
			count++;
			}
	  }
	  return count;
	
	
}


function onPwdKeyUp(obj)
{
var matchResult=parseInt(chkPwdComplexity(obj.value));
var pwd_bar= $(".pwd-letter span");
var weak ="弱";
var common ="中";
var strong ="强";

if("undefined" != typeof rss)
{
	if("undefined" != typeof rss.weak)
	{
		weak = rss.weak;
	}
	if("undefined" != typeof rss.common)
	{
		common = rss.common;
	}
	if("undefined" != typeof rss.strong)
	{
		strong = rss.strong;
	}
}

pwd_bar.each(function(index){
	
	if(index==0){pwd_bar[index].innerHTML=weak;}
	else if(index==1){pwd_bar[index].innerHTML=common;}
	else if(index==2){pwd_bar[index].innerHTML=strong;}
	
	var tempIndex=index+1;
	if(tempIndex==matchResult || matchResult==0)
	{
		$(".pwd-letter span").attr("class","off_pwd");
		switch(matchResult)
		{
			case 1:
					pwd_bar[0].className="on_pwd_1";
				break;
			case 2:
					pwd_bar[0].className="on_pwd_2";
					pwd_bar[0].innerHTML="&nbsp;";
					pwd_bar[1].className="on_pwd_2";
				break;
			case 3:
					pwd_bar[0].className="on_pwd_3";
					pwd_bar[0].innerHTML="&nbsp;";
					pwd_bar[1].className="on_pwd_3";
					pwd_bar[1].innerHTML="&nbsp;";
					pwd_bar[2].className="on_pwd_3";
				break;
		}
	}
});
}

function onPwdKeyUp2(obj)
{
	onPwdKeyUp(obj);
	var complex=getPwdComplexity(obj.value);
	trriger($("#pwdLength"),complex.length);
	trriger($("#pwdChar"),complex.upLowChar);
	trriger($("#pwdNumber"),complex.number);
	
	function trriger($el,ok)
	{
		if(ok)
		{

			$el.find("img").attr("src",localInfo.formatOk);
			$el.removeClass("gay-tips").addClass("success-tips");
		}
		else
		{
			$el.find("img").attr("src",localInfo.formatNo);
			$el.removeClass("success-tips").addClass("gay-tips");
		}
	}
}

function getUrlParm(name) {
	var search = document.location.search, parts = (!search) ? [] : search.split('&'), params = {};

	for ( var i = 0, len = parts.length; i < len; i++) {
		var param = parts[i].split('=');
		var pname = param[0];
		if (i == 0) {
			pname = pname.split('?')[1];
		}
		if (name == pname)
			return param[1];
	}
	;
	return "";
}

var localSites={
		localUrl:location.href.split("?")[0]
};


function isIe(){
	   return ("ActiveXObject" in window);
}

function isPWDComplex(strContent)
{
	if(""==strContent || strContent.length<8 || strContent.length>32)
	{
		return false;
	}
	
	var chkNumber = /[0-9]+/;
	var chkUpChar = /[A-Z]+/;
	var chklowChar = /[a-z]+/;
	
	var result= chkNumber.test(strContent) && chkUpChar.test(strContent) && chklowChar.test(strContent);
	return result
}

function chgRandomCode(ImgObj, randomCodeImgSrc) {
	if(typeof(ImgObj)!="undefined")
	{
		ImgObj.src = randomCodeImgSrc + "&_t=" + new Date().getTime();
	}
};

function jsInnerTimeout(codeObj,btnTxt)
{
	codeObj.attr("disabled",true);
	var intAs=parseInt(codeObj.attr("IntervalTime"));

	intAs--;
	codeObj.attr("disabled",true);
	if(intAs<=-1)
	{
		codeObj.removeAttr("disabled");
		codeObj.removeClass("disabled");  //取消置灰
		codeObj.removeClass("auth_code_grey");   //取消置灰
		
		if(codeObj.attr("type") &&  codeObj.attr("type").toLowerCase() == "button")
		{
			codeObj.val(btnTxt);
		}
		else
		{
			codeObj.find("span:first,a:first").text(btnTxt);
		}
		
		codeObj.attr("IntervalTime",60);
		return true;
	}
	if(codeObj.attr("type") && codeObj.attr("type").toLowerCase() == "button")
	{
		codeObj.val(rss.resend_time.format(intAs));
	}
	else
	{
		codeObj.find("span:first,a:first").text(rss.resend_time.format(intAs));
	}
	
	codeObj.attr("IntervalTime",intAs);
	
	setTimeout(function(){
		codeObj.addClass("auth_code_grey");
		jsInnerTimeout(codeObj,btnTxt);
	},1000);
}

/**
 * transorf from string to JSON
 * @param Json
 * @returns
 */
function JSONstringify(Json){
	if($.browser.msie){
	   if($.browser.version=="7.0"||$.browser.version=="6.0"){
		  var  result=jQuery.parseJSON(Json);
	   }else{
		  var result=JSON.stringify(Json);   
	   }		
	}else{
		var result=JSON.stringify(Json);  			
	}
	return result;
}

$(function() {
	switch(currentSiteID)
	{
		case "9":
			(function(w, d, s, l, i) {
				w[l] = w[l] || [];
				w[l].push({
					'gtm.start' : new Date().getTime(),
					event : 'gtm.js'
				});
				var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l='
						+ l
						: '';
				j.async = true;
				j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
				f.parentNode.insertBefore(j, f);
			})(window, document, 'script', 'dataLayer', 'GTM-KM5CKL');
			break;
	}
});

//用于判断当前设备是否是移动设备
function isMobile()
{
	var userAgentInfo=navigator.userAgent;
    var Agents=["Android","iPhone","SymbianOS", "Mobile",
        "Windows Phone","iPad","iPod"];
    
    var flag = false;
    for(var v = 0; v<Agents.length;v++){
    	if(userAgentInfo.indexOf(Agents[v])>0)
    	{
    		flag=true;
    		break;
    	}
    }
    return flag;
}

//给所有的String类型提供占位符函数  added by l00355523
String.prototype.format=function()  
{  
  if(arguments.length==0) return this;  
  for(var s=this, i=0; i<arguments.length; i++)  
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
  return s;  
};

// 下面这个函数负责按照产品的需求显示手机账号  added by l00355523
function getExpressPhone(phone)
{
	if(!phone || phone=="") {
		return "";
	} 
	if(phone.indexOf("@")>=0)
	{
		return phone;
	}
	
	phone=phone.trim();
	
	var cnPhonePatt=new RegExp("^(0086)(\\d{3,7}.{0,4}\\d{4})$");
    var countryCodes=new Array("297","975","387","238","240","245","691","680","250","684","86","81","91","61","852","65","60","64","507","62","92","673","66","44","33","971","966","84","94","972","30","41","46","48","49","31","32","7","353","39","45","234","263","358","265","249","357","47","43","34","380","992","351","90","98","995","375","375","961","373","359","258","244","254","242","260","968","327","372","421","36","965","352","355","370","231","501","1268","378","40","212","213","354","1","1","1","1","356","220","268","261","27","973","994","20","509","591","57","256","593","52","51","504","232","223","505","977","977","1809","233","233","502","54","58","56","93","506","55","1246","503","1876","595","597","592","237","675","598","962","963","386","226","224","257","248","993","331","241","95","974","264","235","267","230","423","252","251","221","216","967","350","376","228","853","253","266","855","976","679","960","689","53","676","239","682","1264");
    if(cnPhonePatt.test(phone))
    {
    	phone=phone.substring(4,15);
    }
    else
    {
       //开始进行逐一的测试，看看传入的手机号码是否是设定数组中的国家码
        var hasFound=false;
        var countryCode;
        for(var i=0;i<countryCodes.length;i++)
        {
            var foreignPhonePatt = new RegExp("^(00"+countryCodes[i]+")(\\d*).*(\\d+)$");
            if(foreignPhonePatt.test(phone))
            {
                hasFound=true;
                if(countryCode==null)
                {
                    countryCode=countryCodes[i];
                }
                else
                {
                    if(countryCode.length<countryCodes[i].length)
                    {
                        countryCode=countryCodes[i];
                    }
                }
            }
        }
        //此处会得到countryCode，得到之后进行拆分
        if(hasFound)
        {
            var resPhoneAccount=phone.substring(2+countryCode.length,phone.length);
            phone="+"+countryCode+" "+resPhoneAccount;
        }
    }
    return phone;
}

function htmlencode(s){  
    var div = document.createElement('div');  
    div.appendChild(document.createTextNode(s));  
    return div.innerHTML;  
}

function htmldecode(s){  
    var div = document.createElement('div');  
    div.innerHTML = s;  
    return div.innerText || div.textContent;  
}  

function getAccountType(userAccount)
{
    if(!userAccount || userAccount=="") {
        return;
    }

    var phoneReg=new RegExp("^([0-9]|(\\+))\\d+(\\*)*\\d+$");

    if(userAccount.indexOf("@")>-1)
    {
        return 1;
    }
    else if(phoneReg.test(userAccount))
    {
        return 2;
    }
    else
    {
        return 0;
    }
}

// 设定页面滚动展示错误的函数，如果错误展示不能在页面中，那么滚动页面，让错误能够让用户看到
function showErrorToBeSeen(srcObj, tipObj, errorInfo)
{
	srcObj.parent().css("border","1px solid #f90404");
	showError(tipObj, errorInfo);
}

function gid(id)
{
	return document.getElementById(id);
}

// 让元素从错误状态回归正常
function turnErrorToNormal(srcObj)
{
	srcObj.parent().css("border","1px solid #c5c5c5");
}

// 从uc_base.js, m_base.js, base.js中转移过来
function showError(obj, msg, direction, leftPix, rightPix)
{
	
	//obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips cas_error'><table class='popMsg'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
	if(typeof CLOUD !="undefined")
	{
		obj.html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'+msg+'</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
		autoHide(obj);
	}
	else
		{
		/*if($.browser.msie&&$.browser.version*1<=7)
		{
			var html ='<div class="tip-container"><div class="container IE7"><div class="img-type IE7"><div class="no"></div></div><div class="content IE7">'+msg+'</div><div class="clear"></div><div class="bottom-img"></div></div></div>';
		}
		else
			var html ='<div class="tip-container"><div class="container"><div class="img-type"><div class="no"></div></div><div class="content">'+msg+'</div><div class="bottom-img"></div></div></div>';
		obj.css("display","block");
		obj.css("position","absolute");
		var ref = $("#"+obj.attr("ref"));
		var offsetParent =$(obj[0].offsetParent);
		
		obj.html(html);
		
		
		var top = (ref.offset().top-offsetParent.offset().top-$(".tip-container",obj).outerHeight()-8);
		var left = (ref.offset().left-offsetParent.offset().left);
		if($.browser.msie&&$.browser.version*1<=7)
		{
		  top=	$(ref).offset().top-($(".tip-container",obj).outerHeight()+8)*2-13;
		  left=$(ref).offset().left;
		}
		obj.css("top",top+"px");
		obj.css("left",left+"px");
		setTimeout(function(){
			tips.push(obj);
		},500)*/
		
		if(direction && direction == "left" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left") {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_error'><tr><td><b class='poptips-no'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}
		autoHide(obj);
		
		
		}
	

}
$(document).click(function(){
	
	$.each(tips,function(){
		this.html("");
	})
	tips=[];
})
function showSuccess(obj, msg, direction, leftPix, rightPix) {
	//obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips cas_ok'><table class='popMsg'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
	if(typeof CLOUD !="undefined")
	{
		obj.html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'+msg+'</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
		autoHide(obj);
	}
	else
		{
		/*
		if($.browser.msie&&$.browser.version*1<=7)
		{
			var html ='<div class="tip-container"><div class="container IE7"><div class="img-type IE7"><div class="yes"></div></div><div class="content IE7">'+msg+'</div><div class="clear"></div><div class="bottom-img"></div></div></div>';
		}
		else
			var html ='<div class="tip-container"><div class="container"><div class="img-type"><div class="yes"></div></div><div class="content">'+msg+'</div><div class="bottom-img"></div></div></div>';
		obj.css("display","block");
		obj.css("position","absolute");
		var ref = $("#"+obj.attr("ref"));
		var offsetParent =$(obj[0].offsetParent);
		
		obj.html(html);
		
		
		var top = (ref.offset().top-offsetParent.offset().top-$(".tip-container",obj).outerHeight()-8);
		var left = (ref.offset().left-offsetParent.offset().left);
		if($.browser.msie&&$.browser.version*1<=7)
		{
		  top=	$(ref).offset().top-($(".tip-container",obj).outerHeight()+8)*2-13;
		  left=$(ref).offset().left;
		}
		obj.css("top",top+"px");
		obj.css("left",left+"px");
		setTimeout(function(){
			tips.push(obj);
		},500)
		*/
		
		if(direction && direction == "left" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left") {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_ok'><tr><td><b class='poptips-yes'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}
		autoHide(obj);
		}
	
}

function showWarning(obj, msg, direction, leftPix, rightPix) {
	//obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips cas_warn'><table class='popMsg'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
	if(typeof CLOUD !="undefined")
	{
		obj.html('<div class="secpwd-error-tip" style="display: block;"><div class="cloudPagePop">'+msg+'</div><div class="panel-arrow-bottoms"><div class="panel-arrow-bodys"></div></div></div>');
		autoHide(obj);
	}
	else
		{
		/*
		if($.browser.msie&&$.browser.version*1<=7)
		{
			var html ='<div class="tip-container"><div class="container IE7"><div class="img-type IE7"><div class="warn"></div></div><div class="content IE7">'+msg+'</div><div class="clear"></div><div class="bottom-img"></div></div></div>';
		}
		else
			var html ='<div class="tip-container"><div class="container"><div class="img-type"><div class="warn"></div></div><div class="content">'+msg+'</div><div class="bottom-img"></div></div></div>';
		
		var ref = $("#"+obj.attr("ref"))[0];
		
		
		obj.html(html);
		
		obj.css("display","block");
		obj.css("position","absolute");
		var top = (ref.offsetTop-$(".tip-container",obj).outerHeight()-8);
		var left = (ref.offsetLeft);
		if($.browser.msie&&$.browser.version*1<=7)
		{
		  top=	$(ref).offset().top-($(".tip-container",obj).outerHeight()+8)*2-13;
		  left=$(ref).offset().left;
		}
		obj.css("top",top+"px");
		obj.css("left",left+"px");
		
		
		setTimeout(function(){
			tips.push(obj);
			obj.attr
		},500)
		*/if(direction && direction == "left" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix && rightPix) {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;margin-right:" + rightPix + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "right" && leftPix){
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips' style='margin-left:" + leftPix + "px;'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else if(direction && direction == "left") {
			obj.html("<div class='relative'><div class='pop'><b class='uptick_left'></b><div class='poptips_left'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}else {
			obj.html("<div class='relative'><div class='pop'><b class='uptick'></b><div class='poptips'><table class='popMsg cas_warn'><tr><td><b class='poptips-warn'></b></td><td>"+msg+"</td></tr></table></div></div></div>");
		}
		autoHide(obj);
		}
	
}

//检测 agreementContentsStr，当营销未被选中的时候，将影响的ver调整为ignore。
function checkAdMarketAgreedAgrContent(agreementContentsStr){
	
	if(agreementContentsStr==undefined)
	{
		return agreementContentsStr;
	}
	
	var jsonAgr=eval(agreementContentsStr);
	var arrayObj = new Array();
	
	for(var i=0;i<jsonAgr.length;i++)
	{
		if(jsonAgr[i].id!=10)
		{
			arrayObj.push(jsonAgr[i]);
		}
		else
		{
			// 如果是营销的话，将营销的ver调整为 ignore
			jsonAgr[i].ver="ignore";
			arrayObj.push(jsonAgr[i])
		}
	}
	
	return JSON.stringify(arrayObj);
}

function loadDefaultPic(thisEle)
{
	// 如果加载失败的话，自动调整为默认的图片
	thisEle.src=localInfo.defaultPic;
}

window.getHeight= function(){  
    if(window.innerHeight!= undefined){  
        return window.innerHeight;  
    }  
    else{  
        var B= document.body, D= document.documentElement;  
        return Math.min(D.clientHeight, B.clientHeight);  
    }  
}  
window.getWidth= function()
{
	if(typeof window.innerWidth!="undefined")
		{
		return window.innerWidth;
		}
	else
		{
		return Math.min(document.body.clientWidth,document.documentElement.clientWidth);
		}
}

String.prototype.trim = function() {
    if(this=="")
    {
        return this;
    }
    return this.replace(/^\s*|\s*$/g, "");
}

function initEMUI5WapLayout()
{
	
	var initLayout = (function(){
		return function(){
			var head = document.getElementById("head");
			var headContent = document.getElementById("headContent");
			var width=document.body.clientWidth;
			var headHeight = width*9/21;
			head.style.height=headHeight+"px";
			headContent.style["top"]=headHeight*0.27+"px";
			 var bodyHeight = document.body.clientHeight;
		     var htmlHeight = document.documentElement.clientHeight;
		     var htmlWidth  = document.documentElement.clientWidth;
		   
		     if(bodyHeight>htmlHeight||htmlWidth>htmlHeight)
		     {
		       $("body").css("position","relative");
		      
		     }
		     else
		     {
		    	 $("body").css("position","static");
		     }	 
			
			
		}
	})();
	initLayout();
	
	var evt = "resize";
	window.addEventListener(evt, function() {
	   setTimeout(function(){
		   initLayout();
	   },100);
	}, false);
	
    	
}



/**
 * 获取”没有收到验证码？“页面的超链接Div
 */
function getNoAuthCodeLinkDiv(styleValue)
{
	if (!localInfo)
	{
		return '';
	}
	
	if (localInfo.isOpenApealSelf != 'true')
	{
		return '';
	}
	
	var link;
	if (styleValue)
	{
		link = '<div class="representation_div" style="' + styleValue + '">';
	}
	else
	{
		link = '<div class="representation_div">';
	}
	
	link = link + '<a target="_blank" class="representation_link" href="' + localInfo.representationLink + '">' 
	+ rss.representation_not_receive_verification_code 
	+ '</a></div>';
	return link;
}

function htmlDecodeJQ(str) 
{
	var div = document.createElement('div');  
    div.innerHTML = str;  
    return div.innerText || div.textContent;
}



function wapToast(msg)
{


 var contStyle="font-size:13px;padding:0 12px";
 var width = countLength(msg,contStyle);
  var msgStyle = "font-size:13px;text-align:center;background-color:rgba(209,209,209,0.9);border-radius: 16px;min-width: 76px;margin:0 auto;max-width: 236px;width:"+width+"px;"
 if(width>260)
 {
 	msgStyle+="padding:6px 12px;";
 }
 else
 {
 	msgStyle+="padding:0 12px;height:32px;line-height:32px;";
 }

 var id = "toast"+new Date().getTime();
 var html="<div  id='"+id+"' style='"+msgStyle+"'>"+msg+"</div>";
 if($("#toastContent").length>0)
 {
   if($("#toastContent div").length>0)
   {
   	html="<div  id='"+id+"' style='"+msgStyle+"margin-top:10px'>"+msg+"</div>";
   }	
   $("#toastContent").append(html);
 }
 else
 {
   var toastContenHtml="<div id='toastContent' style='position:fixed;bottom:64px;width:100%'></div>"
   $("body").append(toastContenHtml);
   $("#toastContent").append(html);
 }	
  

 

 setTimeout(function(){
 	$("#"+id).remove();
 },2000);

 function countLength(msg,style)
 {
 	var id = "count"+new Date().getTime();
 	style+="visiablity:hidden"
 	var html="<span id='"+id+"' style='"+style+"'>"+msg+"</span>"
 	$("body").append(html);
 	var width = $("#"+id)[0].offsetWidth;
 	$("#"+id).remove();
 	return width;
 }

}
/**
 * Last  Update:2012-1-22
 */

ec.debug = false;

ol.load.define("jquery" , [{mark:"jquery",uri: "base/jquery-1.4.4.min.js",type: "js"}]);
ol.load.define("jquery.form" , ["jquery",{mark:"jquery.form",uri: "base/jquery.form-2.49.js",type: "js",	charset: "utf-8",depend:true}]);
ol.load.define("jquery.bgiframe" , [{mark:"jquery.bgiframe",uri: "base/jquery.bgiframe.min.js",type: "js",	charset: "utf-8",depend:true,loadType:"lazy"}]);
ol.load.define("jquery.autocomplete" , [{mark:"jquery.autocomplete",uri: "jquery.autocomplete/jquery.autocomplete.hack-min.js",type: "js",	charset: "utf-8",depend:true}]);
ol.load.define("My97DatePicker" , [{mark:"My97DatePicker",uri: "My97DatePicker/WdatePicker.js",type: "js",charset: "utf-8",depend:false , onload : function(){
	WdatePicker();
}}]);
ol.load.define("jquery.movebar" , [{uri: "jquery.movebar/movebar.min.js",type: "js"}]);
ol.load.define("ec.aes" , [{uri: "aes/aes.js",type: "js",depend:true},{uri: "aes/aesUtil.js",type: "js",depend:true},{uri: "aes/pbkdf2.js",type: "js",depend:true}]);
ol.load.define("ec.dh" , [{uri: "dh/bigInt.min.js",type: "js",depend:true}]);
ol.load.define("ec.rc4" , [{uri: "crypt/rc4.js",type: "js",depend:true}]);
ol.load.define("uploadify" , [
	"jquery",
	"swfobject",
	{uri: "uploadify/jquery.uploadify.v2.1.4.min.js",type:"js",depend:true},
	{uri: "uploadify/uploadify.customize.css",type:"css"}
]);
ol.load.define("ec.pager" , [
	"jquery",
	{uri: "ec.pager/pager-min.js",type:"js",charset: "gbk",depend:true}
]);
ol.load.define("ajax" , [
	"jquery.form",
	{mark:"ajax",uri: "base/ajax.js",type: "js",	charset: "utf-8",depend:true}
]);
ol.load.define("ajaxcdr" , [
	"jquery.form",
	{mark:"ajaxcdr",uri: "base/ajaxcdr.js?20121031",type: "js",	charset: "utf-8",depend:true}
]);
ol.load.define("ec.box" , [
	"jquery",
	{mark:"jquery.bgiframe",uri: "base/jquery.bgiframe.min.js",type: "js",charset: "utf-8",depend:true,loadType:null},
	{uri: "ec.box/box-min.js",type: "js",depend:true}
]);
ol.load.define("ec.tab" , [
	"jquery",
	{uri: "ec.tab/tab-min.js",type: "js",charset:"utf-8",depend:true}
]);

ol.load.define("jquery.float" , [
	"jquery",
	{uri: "jquery.float/float.min.js",type: "js",charset:"gbk",depend:true}
]);

ol.load.define("cloud-zoom" , [
	{uri : "cloud-zoom.1.0.2/cloud-zoom.1.0.2-hack-min.js" , type :"js"}
]);
ol.load.define("jqzoom" , [
	"jquery",
	{uri : "jqzoom-2.3/js/jquery.jqzoom-core.js" , type :"js", depend:true},
	{uri : "jqzoom-2.3/css/jquery.jqzoom.css", type : "css"}
]);


ol.load.define("RaterStar" , [
	{uri : "RaterStar/rater-star.js" , type :"js"}
]);

ol.load.define("ec.slider" , [
	{uri : "ec.slider/slider-min.js" , type :"js"}
]);

ol.load.define("ec.linkSelect.region" , [
	"jquery",
	{uri: "linkSelect/region-min.js?20161011",type: "js",charset:"utf-8",depend:true}
]);
ol.load.define("ec.md5" , [
	{uri: "md5/md5-min.js",type: "js"}
]);
ol.load.define("jquery.rotate" , [
	"jquery",
	{uri: "jquery.rotate/jQueryRotate-min.js",type: "js"}
]);
ol.load.define("jquery.fixed" , [
	"jquery",
	{uri: "jquery.fixed/fixed.js",type: "js"}
]);
ol.load.define("ec.XSSUtils" , [
	{uri: "/aes/XSSUtils.min.js",type: "js",charset:"utf-8",depend:true,loadType:null},
	{uri: "/aes/esapi.js",type: "js",charset:"utf-8",depend:true,loadType:null},
	{uri: "/aes/resources/Base.esapi.properties.min.js",type: "js",charset:"utf-8",depend:true,loadType:null}
]);
if(jQuery)
{
	ol._setLoadStatus("jquery" , "complete");
}


window["_gaq"] = window["_gaq"] || [];
_gaq.push(['_setAccount', (ec.debug ? '' : "UA-28046633-2"),'t1']);

var _hmt = _hmt || [];
var _paq = _paq || [];
var _zpq = _zpq || [];
var bindBox;

window._bd_share_config = {};
ec.code = {
	//baidu分享
	addShare : function(options){
		options = $.extend({
			//type : "tools",
			//lazy : true,
			jsUrl : "http://bdimg.share.baidu.com/static/api/js/share.js?v=86835285.js?cdnversion="+~(-new Date()/36e5)
		} , options);
		//document.write('<script type="text/javascript" id="bdshare_js" data="type='+options.type+'&amp;uid=4505950" ></s' + 'cript>');
		window._bd_share_config = options;
		ec.ready(function(){
			with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src=options.jsUrl];
		});
		
	},
	addAnalytics:function(options){
		
		options = options || {
			google : true,
			cnzz : true,
			baidu : true,
			click99 : true,
			hicloud : true,
			suning : true,
			operate:false,
			dmp:false
		};
		//不需要统计的页面地址列表
		var filterList = [
				'/payment/alipay/returnURL',
				'/order/feedBack'
			],
			locationHref = location.href;

		for (var i=0; i< filterList.length; i+=1){
			if (locationHref.indexOf(filterList[i]) > 0) return;
		}

		//_gaq.push(['_setDomainName', '.vmall.com']);
		//_gaq.push(['_setVisitorCookieTimeout', 157680000000]);
		_gaq.push(['_trackPageview']);
		_gaq.push(['_trackPageLoadTime']);
		_gaq.push(['_addOrganic', 'baidu', 'word']);
		_gaq.push(['_addOrganic', 'baidu', 'kw']);
		_gaq.push(['_addOrganic', 'opendata.baidu', 'wd']);
		_gaq.push(['_addOrganic', 'zhidao.baidu', 'word']);
		_gaq.push(['_addOrganic', 'news.baidu', 'word']);
		_gaq.push(['_addOrganic', 'post.baidu', 'kw']);
		_gaq.push(['_addOrganic', 'tieba.baidu', 'kw']);
		_gaq.push(['_addOrganic', 'mp3.baidu', 'word']);
		_gaq.push(['_addOrganic', 'image.baidu', 'word']);
		_gaq.push(['_addOrganic', 'top.baidu', 'word']);
		_gaq.push(['_addOrganic', 'news.google', 'q']);
		_gaq.push(['_addOrganic', 'soso', 'w']);
		_gaq.push(['_addOrganic', 'image.soso', 'w']);
		_gaq.push(['_addOrganic', 'music.soso', 'w']);
		_gaq.push(['_addOrganic', 'post.soso', 'kw']);
		_gaq.push(['_addOrganic', 'wenwen.soso', 'sp']);
		_gaq.push(['_addOrganic', 'post.soso', 'kw']);
		_gaq.push(['_addOrganic', '3721', 'name']);
		_gaq.push(['_addOrganic', '114', 'kw']);
		_gaq.push(['_addOrganic', 'youdao', 'q']);
		_gaq.push(['_addOrganic', 'vnet', 'kw']);
		_gaq.push(['_addOrganic', 'sogou', 'query']);
		_gaq.push(['_addOrganic', 'news.sogou', 'query']);
		_gaq.push(['_addOrganic', 'mp3.sogou', 'query']);
		_gaq.push(['_addOrganic', 'pic.sogou', 'query']);
		_gaq.push(['_addOrganic', 'blogsearch.sogou', 'query']);
		_gaq.push(['_addOrganic','gougou', 'search']);	
		

		//suning
		var honor3 = (locationHref.indexOf('/product/678.html') > 0) ? true : false;
		_zpq.push(['_setPageID', (!honor3) ? '100' : '101']);
		_zpq.push(['_setPageType', (!honor3) ? 'home' : 'honor3']);
		_zpq.push(['_setParams','']);
		_zpq.push(['_setAccount','95']);

		if(options.google)ec.load({url:"http://www.google-analytics.com/ga.js",type:"js",loadType:"lazy"});
		if(options.baidu)ec.load({url:"http://hm.baidu.com/h.js?a08b68724dd89d23017170634e85acd8",type:"js",loadType:"lazy"});
		if(options.cnzz)ec.load({url : "http://s95.cnzz.com/stat.php?id=4754392&web_id=4754392",type:"js",loadType:"lazy"});
		//if(options.click99)ec.load({ type : "js" , uri : "../echannel/99click.js" , loadType : "lazy"});
		if(options.suning)ec.load({url:"http://cdn.zampda.net/s.js", type:"js", loadType : "lazy"});

		if(options.hicloud)
		{
			_paq.push(['setTrackerUrl', 'http://datacollect.vmall.com:28080/webv1']);
			
			//获取订单ID并转换为字符串类型，注意：只支持字符串类型
			var orderCode = ((ec.order && ec.order.orderCode) ? ec.order.orderCode : "")+ '';
			//log(orderId);
			// 分配的site id
			_paq.push(['setSiteId', "www.vmall.com"]);
			// 上报自定义数据
			_paq.push(['setCustomVariable',1, 'cid', (ec.util.cookie.get("cps_id") || ""), 'page']);
			_paq.push(['setCustomVariable',2, 'direct', (ec.util.cookie.get("cps_direct") || ""), 'page']);
			_paq.push(['setCustomVariable',3, 'orderid', orderCode, 'page']);
			_paq.push(['setCustomVariable',4, 'wi', (ec.util.cookie.get("cps_wi") || ""), 'page']);
			_paq.push(['setCustomVariable',1, 'uid', ((ec.util.cookie.get("uid") ? ec.util.cookie.get("uid") : "") || ""), 'visit']);
			_paq.push(['setCustomVariable',10, 'uid', ((ec.util.cookie.get("uid") ? ec.util.cookie.get("uid") : "") || ""), 'visit']);
			// 跟踪网页浏览
			_paq.push(['trackPageView']);
			
			ec.load({url : "http://res.vmallres.com/bi/hianalytics.js" , type:"js",loadType:"lazy"});
			ec.util.cookie.set("cps_direct", null, {"expires": -1, "domain":".vmall.com"});
		}
		//采集加入购物车和删除购物车的行为
		//是不是加入购物车或者删除购车上商品的行为进行判断
		if(options.operate){
			_paq.push(['setTrackerUrl', 'http://datacollect.vmall.com:28080/webv1']);
			
			//获取订单ID并转换为字符串类型，注意：只支持字符串类型
			var orderCode = ((ec.order && ec.order.orderCode) ? ec.order.orderCode : "")+ '';
			//log(orderId);
			// 分配的site id
			_paq.push(['setSiteId', "www.vmall.com"]);
			// 上报自定义数据
			_paq.push(['setCustomVariable',1, 'cid', (ec.util.cookie.get("cps_id") || ""), 'page']);
			_paq.push(['setCustomVariable',2, 'direct', (ec.util.cookie.get("cps_direct") || ""), 'page']);
			_paq.push(['setCustomVariable',3, 'orderid', orderCode, 'page']);
			_paq.push(['setCustomVariable',4, 'wi', (ec.util.cookie.get("cps_wi") || ""), 'page']);
			_paq.push(['setCustomVariable',1, 'uid', ((ec.util.cookie.get("uid") ? ec.util.cookie.get("uid") : "") || ""), 'visit']);
			_paq.push(['setCustomVariable',10, 'uid', ((ec.util.cookie.get("uid") ? ec.util.cookie.get("uid") : "") || ""), 'visit']);
			var operData = "";
			operData = ec.code.convertFormat(options.optype,options.skuIds,options.bundleIds,options.custSkuIds,options.custBundleIds);
			_paq.push(['setCustomVariable',10, 'cart', operData, 'page']);
			_paq.push(['trackGoal',1]);
			
		}
		if(options.dmp){
			//ec.load({url:"http://dmp-collector.huawei.com/api/2.0/DmpMapping.js",type:"js",loadType:"lazy"});
			ec.load({url:"http://nebula-collector.huawei.com/api/2.0/vmallcn-min.js",type:"js",loadType:"lazy"});
		}
	}
};

//把商品sku_id,bundle_id组合成一个格式化的数据，传给BI
/*对operData的格式说明一下 operData:operType,0_id:0_id:1_id
 * 第一个逗号前的是操作类型，1代表添加，0代表删除
 * 逗号后面的字符串0_id，表示套餐类id
 * 1_id表示单品类  后面是商品id
 * 2_id表示新捆绑套餐/自选套餐ID
 * 3_id表示新捆绑套餐/自选套餐对应的商品ID
 */
ec.code.convertFormat = function(optype,skuIds,bundleIds,custSkuIds,custBundleIds){
	
	var _result = "";
	var _skuIds = [];
	var _bundleIds =[];
	var _custSkuIds = [];
	var _custBundleIds = [];
	
	//判断是不是数组单品id
	if(ec.util.isArray(skuIds)){
		_skuIds = $.map(skuIds,function(ele){
			return "1_"+ele;
		});
	}
	
	//判断套餐id
	if(ec.util.isArray(bundleIds)){
		_bundleIds = $.map(bundleIds,function(ele){
			return "0_"+ele;
		});
	}
	
	//判断新捆绑套餐商品id
	if(ec.util.isArray(custSkuIds)){
		_custSkuIds = $.map(custSkuIds,function(ele){
			return "3_"+ele;
		});
	}
	
	//判断新捆绑套餐id
	if(ec.util.isArray(custBundleIds)){
		_custBundleIds = $.map(custBundleIds,function(ele){
			return "2_"+ele;
		});
	}
	
	//把四个数组合并起来
	_skuIds = _bundleIds.concat(_skuIds,_custBundleIds,_custSkuIds);
	
	//拼接成我们所要的格式
	_result = optype + "," + _skuIds.join(":");
	
	return _result;
	
};

//保存cps信息到cookie
ec.code.saveCpsInfoToCookie = function(){
	var cid = ec.code.getCPSInfoFromUrl(location.href, "cid");
	var wi = ec.code.getCPSInfoFromUrl(location.href, "wi");
	
	//cid为0到10位数字
	if(cid.length < 0 || cid.lenght > 11){
		return;
	}
	
	var regText = /^\d+$/;
	if(!regText.test(cid)){
		return;
	}
	
	ec.util.cookie.set("cps_wi", null, {"expires": -1, "domain":".vmall.com"});
	ec.util.cookie.set("cps_id", cid, {"expires": 7, "domain":".vmall.com"});
	ec.util.cookie.set("cps_direct", "1", {"expires": 7, "domain":".vmall.com"});

	//wi为0-200位
	if(wi.length > 0 && wi.length < 200){
		ec.util.cookie.set("cps_wi", wi, {"expires": 7, "domain":".vmall.com"});
	}
};

//从url获取cps信息
ec.code.getCPSInfoFromUrl = function(url, name) {
    // 如果链接没有参数，或者链接中不存在我们要获取的参数，直接返回空 
    if (url.indexOf("#") == -1 || url.indexOf(name + '=') == -1) {
        return '';
    }
    // 获取链接中参数部分 
    var queryString = url.substring(url.indexOf("#") + 1);
    
    //解决可能出现多个问号的情况 例如：http://www.vmall.com/?vmallFlag=login#?cid=6569
    var parmSegments = queryString.split("#");
    
    for(var i = 0; i < parmSegments.length; i++){
    	var tempStr = parmSegments[i];
    	
    	// 分离参数对 ?key=value&key2=value2 
        var parameters = tempStr.split("&");
        var pos, paraName, paraValue;
        for (var j = 0; j < parameters.length; j++) {
            // 获取等号位置 
            pos = parameters[j].indexOf('=');
            if (pos == -1) {
                continue;
            }
            // 获取name 和 value 
            paraName = parameters[j].substring(0, pos);
            paraValue = parameters[j].substring(pos + 1);
     
            if (paraName == name) {
                return unescape(paraValue.replace(/\+/g, " "));
            }
        }
    }
    return '';
};

//在线客服 & 右侧工具条
ec.code.addService = function(options){
	ec.load("jquery.float" , {
		loadType : "lazy",
		callback : function(){
			
			if(options.showService){
				var url = window.location.href;
				var index = url.indexOf("/product/");
				var urlInfo = "";
				var memo = "";
				if(index > 0) {                  // 如果进入明细页，则封装好明细信息
					urlInfo = url.substring(index + 9, url.length);
					
					if(urlInfo.length > 1) {
						var prdInfo = urlInfo.split('.html', 2);
						if(prdInfo.length > 1) {
							memo = prdInfo[0];
							var hash = prdInfo[1];
							if(hash.indexOf('#') >= 0) {
								var skuInfo = hash.split('#', 2)[1];
								var skuId = (skuInfo.length > 0) ? (skuInfo.split(',', 2)[0] || 0) : 0;
								
								if(skuId != 0) {
									memo = memo + "," + skuId;
								}
							}
						}						
					}
				}
				//$("#tools-nav-service-robotim").attr("href" , "http://robotim.vmall.com/live800/chatClient/chatbox.jsp?companyID=8922&configID=10&enterurl="+encodeURIComponent(window.location.href)+"&k=1&remark="+encodeURIComponent(memo)).css('display','block');
				
				$("#tools-nav-service-robotim").attr("href" , "http://robotim.vmall.com/live800/chatClient/chatbox.jsp?companyID=8922&configID=10&location=B_002&chatfrom=web&enterurl="+encodeURIComponent(window.location.href)+"&k=1&remark="+encodeURIComponent(memo)).css('display','block');
				
				//$("#tools-nav-service-qq").css('display','block');
			}
			if(options.showTools){
				$("#tools-nav-survery").css('display','block');
			}
			if(options.showService || options.showTools) {
				$('#tools-nav').css('bottom','10px').show();
			}
			//if(options.showTools)$("#tools-nav")["float"]("rb").show();
		}
	});
};

(function(){
	//保存cps信息到cookie
	ec.code.saveCpsInfoToCookie();
	
	var 
		_tracker,
		getTracker = function(){

			if(_tracker)return _tracker;

			_tracker = _gat._createTracker((ec.debug ? '' : "UA-28046633-3"),"t2");
			//_tracker._setDomainName('.vmall.com');
			//_tracker._setVisitorCookieTimeout(157680000000);

			return _tracker;
		};

	ec.track= function(path , retryTime){
		retryTime = retryTime || 3;
		try {
			if (window._gat && window._gat._createTracker) {
				if ("[object Array]" == Object.prototype.toString.apply(path)) {
					path = path.join("/")
				}
				getTracker()._trackPageview(path);
				log("Track", path)
			} else {
				if (retryTime > 0) {
					setTimeout(function() {
						ec.track(path , retryTime -1)
					},
					1000)
				}
			}
		} catch(c) {
			throw c
		}
	};

	ec.trackEvent = function(category , action , optional_label, optional_value , retryTime){
		retryTime = retryTime || 3;
		try {
			if (window._gat && window._gat._createTracker) {
				getTracker()._trackEvent(category , action , optional_label, optional_value);
				log("TrackEvent", category + " : " + action)
			} else {
				if (retryTime > 0) {
					setTimeout(function() {
						ec.trackEvent(category , action , optional_label, optional_value , retryTime -1)
					},
					1000)
				}
			}
		} catch(c) {
			throw c
		}
	};


})();

(function(){

	var source =  ec.util.cookie.get("cps_source"),
		channel = ec.util.cookie.get("cps_channel"),
		direct = ec.util.cookie.get("cps_direct");

	
	//跟踪cps引来的用户操作事件
	ec.trackCPS = function(action , optional_value){
		if(source && channel)ec.track(["/cps/event" , action , source+"/"+channel , optional_value]);
	};
	
	if(source && channel && direct)
	{
		ec.ready(function(){
			//跟踪cps的pv,uv
			ec.track("/cps/pv/" +source+"/"+channel +  location.pathname);
		});
	}
})();

//跟踪99click
ec.track99click = function(options)
{
	var _ozprm;
	if(typeof(options) == "string")
	{
		_ozprm = options;
	}else{
		
		var array = [] , v;
		for(var s in options)
		{
			v = options[s];
			array.push(s+"="+(ec.util.isArray(v) ? v.join(";") : v));
		}
		_ozprm = array.join("&");
	}

	ec.track99click._ozuid = ec.account.id;
	ec.track99click._ozprm = _ozprm;
}

/**
 * 当页面页面加载完成时
 * 1.调用公用方法去判定手机是不是绑定的
 * 2.当购物车页面加载完页面的时候，调用一个公用方法判定手机是不是绑定
 * 3.当点击购物车去结算的时候，调用一个公用方法判定手机是不是绑定
 * @author 李峰 舒兵
 */
ec.pkg('ec.binding');
//绑定手机
ec.binding.login = function(){
	var optBanding = ec.util.cookie.get("optBanding");
	if(optBanding==0){
		//判断用户手机绑定状态
		$.ajax({
			url:domainMain+"/account/isBindedTelephoneOrEmail.json",
			type:'get',
			dataType:'json',
			success:function(json){
				if(!json.isLogin){
					return false;
				}
				//重新设置此cookie
				ec.util.cookie.set("optBanding",1);
				if(!json.success){
					
					//未绑定手机
					ec.load("ec.box",function(){
						//查询地址
						ec.binding.requestUrl = domainMain+"/account/isBindedTelephoneOrEmail.json?t="+new Date().getTime();
						//绑定手机地址
						ec.binding.upCenterUrl = json.upUserCenter;
						
						//弹出绑定框，显示第一个步骤框
						ec.Cache.get("ecBindingPhone",function(){
							return new ec.box($("#ec-binding-phone").val(),{
								boxid:"bindingBox",
								boxclass:"ol_box_4",
								showButton:false,
								onopen:function(box){
									ec.ui.loading.hide();
									$("#ec-binding-phone-1").show();
									$("#ec-binding-phone-url-1").attr("href",ec.binding.upCenterUrl);
									box.setPosition();
								}
							});
						}).open();
					});
				}
			}
		});	
	}
};

//购物车去结算
ec.binding.cart = function(toCallback){
	ec.binding.callback = toCallback;
	if(toCallback){
		ec.ui.loading.show();
	}
	$.ajax({
		url:domainMain+"/account/isBindedTelephoneOrEmailDomain.json?callback=?&t="+new Date().getTime(),
		async:false,
		dataType : "jsonp",
		jsonp: 'callback',
		timeout: '60000',
		success:function(json){
			//判断是否登录
			if(!json.isLogin){
				if(toCallback){
					//未登录且存在回调函数，就走回调函数流程跳转到登陆页
					toCallback();
				}
				return;
			}
			//已登录
			//重新设置此cookie
			ec.util.cookie.set("optBanding",1);
			if(!json.success){
				//未绑定手机
				ec.load("ec.box",function(){
					//新建两个步骤框，并缓存起来
					//查询地址
					ec.binding.requestUrl = domainMain+"/account/isBindedTelephoneOrEmailDomain.json?callback=?&t="+new Date().getTime();
					//绑定手机地址
					ec.binding.upCenterUrl = json.upUserCenter;
					
					//弹出绑定框，显示第一个步骤框
					ec.Cache.get("ecBindingPhone",function(){
						return new ec.box($("#ec-binding-phone").val(),{
							boxid:"bindingBox",
							boxclass:"ol_box_4",
							showButton:false,
							onopen:function(box){
								ec.ui.loading.hide();
								$("#ec-binding-phone-1").show();
								$("#ec-binding-phone-url-1").attr("href",ec.binding.upCenterUrl);
								box.setPosition();
							}
						});
					}).open();
				});
			}else{
				if(toCallback){
					toCallback();
				}
			}
		}
	});	
};

//购物车去结算  20150813 绑定手机号新需求  改写   上面原方法保留
ec.binding.cart.withPhone = function(toCallback){
	ec.binding.callback = toCallback;
	if(toCallback){
		ec.ui.loading.show();
	}
	$.ajax({
		url:domainMain+"/account/isBindedPhoneCrossDomain.json?callback=?&t="+new Date().getTime(),
		async:false,
		dataType : "jsonp",
		jsonp: 'callback',
		timeout: '60000',
		success:function(json){
			//判断是否登录
			if(!json.isLogin){
				if(toCallback){
					//未登录且存在回调函数，就走回调函数流程跳转到登陆页
					toCallback();
				}
				return;
			}
			//已登录
			//重新设置此cookie
			ec.util.cookie.set("optBanding",1);
			if(!json.success){
				//未绑定手机
				ec.load("ec.box",function(){
					//新建两个步骤框，并缓存起来
					//查询地址
					ec.binding.requestUrl = domainMain+"/account/isBindedPhoneCrossDomain.json?callback=?&t="+new Date().getTime();
					//绑定手机地址
					var localHref = window.location.href;
					localHref = localHref.replace(/\\?isSuccess=0/g,'');
					ec.binding.upCenterUrl = json.upUserCenter + "&redirect_uri=" + localHref;
					ec.binding.upCenterUrl = encodeURI(ec.binding.upCenterUrl);
					
					var state = json.state;
					
					if (null == state)
					{
						alert("获取服务器数据失败，请刷新重试！")
						return;
					}
					
					//  第四步 松绑期间关闭页面  直接跳转
					if (state == 4)
					{
						//弹出绑定框，显示第一个步骤框
						bindBox = new ec.box($("#ec-binding-phone").val(),{
								boxid:"bindingBox",
								boxclass:"ol_box_4",
								showButton:false,
								onopen:function(box){
									ec.ui.loading.hide();
									$("#ec-binding-phone-" + state).show();
									$("#bindEndDate4State4").html(json.upBindEndDate);
									if (state == 1 || state == 4)
									{
										$("#ec-binding-phone-url-" + state).attr("href",ec.binding.upCenterUrl);
									}
									box.setPosition();
								},
								onclose : function(box)
								{
									if(toCallback){
										toCallback();
									}
								}
							});
						bindBox.open();
					}
					else
					{
						//弹出绑定框，显示第一个步骤框
						bindBox = new ec.box($("#ec-binding-phone").val(),{
								boxid:"bindingBox",
								boxclass:"ol_box_4",
								showButton:false,
								onopen:function(box){
									ec.ui.loading.hide();
									$("#ec-binding-phone-" + state).show();
									if (state == 1)
									{
										$("#ec-binding-phone-url-1").attr("href",ec.binding.upCenterUrl);
									}
									box.setPosition();
								}
							});
						bindBox.open();
					}
				});
			}else{
				if(toCallback){
					toCallback();
				}
			}
		}
	});	
};


//提供给 优购码订单、DBank订单、TCS延保订单、团购订单、秒杀订单，合约机
ec.binding.isBindedMobileOrEnterpriseUser = function(toCallback){
	ec.binding.callback = toCallback;
	ec.ui.loading.show();
	//判断用户手机绑定状态
	$.ajax({
		url:domainMain+"/account/isBindedTelephoneOrEmail.json",
		type:'get',
		dataType:'json',
		success:function(json){
			if(!json.isLogin){
				if(toCallback){
					toCallback();
				}
				return;
			}
			if(!json.success){
				//未绑定手机
				ec.load("ec.box",function(){
					//新建两个步骤框，并缓存起来
					//查询地址
					ec.binding.requestUrl = domainMain+"/account/isBindedTelephoneOrEmail.json?t="+new Date().getTime();
					//绑定手机地址
					ec.binding.upCenterUrl = json.upUserCenter;
					
					//弹出绑定框，显示第一个步骤框
					ec.Cache.get("ecBindingPhone",function(){
						return new ec.box($("#ec-binding-phone").val(),{
							boxid:"bindingBox",
							boxclass:"ol_box_4",
							showButton:false,
							onopen:function(box){
								ec.ui.loading.hide();
								$("#ec-binding-phone-1").show();
								$("#ec-binding-phone-url-1").attr("href",ec.binding.upCenterUrl);
								box.setPosition();
							}
						});
					}).open();
				});
			}else{
				if(toCallback){
					toCallback();
				}
			}
		}
	});	
};

// 暂不绑定
ec.binding.closeState4 = function()
{
	if (null != bindBox)
	{
		bindBox.close();
	}
}

//立即绑定
ec.binding.showOk = function(){
	$(".ec-binding-phone-box").hide();
	$("#ec-binding-phone-2").show();
	$("#ec-binding-phone-url-2").attr("href",ec.binding.upCenterUrl);
	$("#ec-binding-phone-url-3").attr("href",ec.binding.upCenterUrl);
	bindBox.setPosition();
}
//绑定成功
ec.binding.resetShow = function(){
	var _callBack = ec.binding.callback;
	var isJsonPRequest = window.location.href.match(/\/cart\/cart\.html/g);
	//3.配置好第二个步骤框的，点击“绑定成功去结算”按钮请求配置参数.再去判断一次，是否用户已经绑定成功手机
	var opts = {
			url:ec.binding.requestUrl,
			type:'get',
			async:'false',
			dataType:'json',
			success:function(json){
				if(!json.success){
					//4.如果没有没有成功绑定手机，则点击“绑定成功”，则弹出绑定手机导航框的第三步骤框，
					$("#ec-binding-phone-2").hide();
					$("#ec-binding-phone-3").show();
					ec.Cache.get("ecBindingPhone").setPosition();
					//$(".button-go-checkout-2").removeClass("button-style-1").addClass("button-style-disabled-4");
				}else{
					//$(".button-go-checkout-2").removeClass("button-style-disabled-4").addClass("button-style-1");
					ec.Cache.get("ecBindingPhone").close();
					if(_callBack){
						_callBack();
						_callBack = null;
					}
				}
			}
		};
	//如果是跨域，则要配置下面几个参数
	if(isJsonPRequest){
		opts.dataType='jsonp';
		opts.jsonp= 'callback';
		opts.timeout= '60000';
	}
	//5.发送请求
	$.ajax(opts);
}
//订单总数显示在左导航
ec.binding.allCount = function(){
	var allCount = ec.util.cookie.get("vmallOrderCount");
	if(allCount==0){
		$("#li-order span").html("我的订单");
	}else if(allCount>0){
		$("#li-order span").html("我的订单<em>"+ allCount +"</em>");
	}else{
		$("#li-order span").html("我的订单<em>0</em>");
		$.ajax({
			type:'get',
			url:domainMain+"/member/orderCount.json?t="+ new Date().getTime(),
			dataType:"json",
			async:true,
			timeout : 10000,
			success:function(json){
				if(!json.success){
					return;
				}
				var jsonCount = parseInt(json.orderCount.unpaidOrderCount) + parseInt(json.orderCount.unreceiptOrderCount) ;
				jsonCount = jsonCount?jsonCount:0;
				jsonCount = jsonCount + parseInt($("#li-order span em").text());
				$("#li-order span em").text(jsonCount);
				ec.util.cookie.set("vmallOrderCount",jsonCount);
			}
		});
		$.ajax({
			type:'get',
			url:domainRemark+"/remark/queryNotRemarkCount.json?queryHis=1&t="+new Date().getTime(),
			dataType:"jsonp",
			timeout : 10000,
			async:true,
			data:{
				"tab":"nocomment"
			},
			success:function(_json){
				if(!_json.success){
					return;
				}	
				var jsonCount = allCount + parseInt(_json.notRemarkCount) + parseInt(_json.hisNotRemarkCount) ;
				jsonCount = jsonCount?jsonCount:0;
				jsonCount = jsonCount + parseInt($("#li-order span em").text());
				if(jsonCount>0){
					$("#li-order span em").text(jsonCount);
				}else{
					$("#li-order span").text("我的订单");
				}
				ec.util.cookie.set("vmallOrderCount",jsonCount);
			}
		});
	}
};

bindCartResult = function(boxId)
{
	var localHref = window.location.href;
	localHref = localHref.replace(/\?isSuccess=0/g,'').replace(/&isSuccess=0/g,'');
	
//	var reLoginUrl = domainMain + "/member/cartBind/result/logout";
//	var cartUrl = $("#ec-binding-phone-reLogin-5").attr("href");
//	
//	if (null == cartUrl)
//	{
//		reLoginUrl = reLoginUrl + "?url=" + encodeURI(window.location.pathname);
//	}
//	// 购物车页面的url单独处理
//	else
//	{
//		reLoginUrl = reLoginUrl + "?url=" + cartUrl;
//	}
	
	var upaddr = upBindPhoneAddr.replace(/&amp;/g,'&');
	//弹出绑定框，显示第一个步骤框
	ec.load("ec.box",function(){
		bindBox = new ec.box($("#" + boxId).val(),{
				boxid:"bindingBox",
				boxclass:"ol_box_4",
				showButton:false,
				onopen:function(box){
					ec.ui.loading.hide();
					$("#ec-binding-phone-1").hide();
					$("#ec-binding-phone-2").hide();
					$("#ec-binding-phone-3").hide();
					$("#ec-binding-phone-4").hide();
					$("#ec-binding-phone-5").show();
					$("#ec-binding-phone-url-5").attr("href", upaddr + "&redirect_uri=" + localHref);
					var reLoginUrl = domainMain + "/member/cartBind/result/logout?url=" + $("#ec-binding-phone-reLogin-5").attr("href") + "?url=" + localHref;
					$("#ec-binding-phone-reLogin-5").attr("href", encodeURI(reLoginUrl));
					box.setPosition();
				}
			});
		bindBox.open();
	});
};

getUrlParaMap4CartBinding = function (){
	var query = decodeURIComponent(window.location.search);//先解密，mcj
	var paras = {};
	if(query)
	{
		var p;
		query = query.substring(1).split("&");
		for(var i = 0 ; i < query.length ; i++)
		{
			p = query[i].split("=");
			if(p.length==2)	paras[p[0]] = p[1].escapeHTML4CartBinding();
		}
	}
	return paras;
}

String.prototype.escapeHTML4CartBinding = function () {
	return this.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
};
ec.ready(function(){
	if(window.location.href.match(/\/cart\/cart\.html/g)){
		ec.binding.cart();
		return;
	}
	ec.binding.login();
	if((window.location.href.match(/\/member/g) && !window.location.href.match(/\/member\/order/g))||window.location.href.match(/\/member\/order-/g)||window.location.href.match(/\/authmember\/identity/g)){
		//订单总数显示在左导航
		ec.binding.allCount();
		return;
	}
})

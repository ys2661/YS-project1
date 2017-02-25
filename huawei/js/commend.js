$(function(){
	/**************二级菜单*************/
	var secw1 = $(".secmenu1").width();
	var secw1 = $(".secmenu2").width();
	$(".secmenu-active1").css("width",secw1+3+"px");
	$(".secmenu-active2").css("width",secw1+3+"px");
	$(".secmenu1").hover(function(){
		$(".secmenu-active1").css("display","block");
	},function(){
		$(".secmenu-active1").css("display","none");
	});
	$(".secmenu2").hover(function(){
		$(".secmenu-active2").css("display","block");
	},function(){
		$(".secmenu-active2").css("display","none");
	})
	/*****************我的商城******************/
	$(".market").hover(function(){
		$(".mainMarket").css({"height":"39px","border-right":"1px solid #e4e4e4","background":"white","width":"77px"})
		$(this).find(".secMarket").css("display","block")
		$(this).find("i").attr("class","iconfont icon-shang")
	},function(){
			$(".mainMarket").css({"height":"38px","border-right":"none","background":"white","width":"78px"})
			$(this).find(".secMarket").css("display","none")
			$(this).find("i").attr("class","iconfont icon-xia1")
	})
	$(".buyCar").hover(function(){
		$(".mainbuyCar").css({"height":"39px","border-left":"1px solid #e4e4e4","background":"white","width":"79px"})
		$(this).find(".secBuyCar").css("display","block")
		$(this).find("i").attr("class","iconfont icon-shang")
	},function(){
			$(".mainbuyCar").css({"height":"38px","border-left":"none","background":"white","width":"79px"})
			$(this).find(".secBuyCar").css("display","none")
			$(this).find("i").attr("class","iconfont icon-xia1")
	})
})

$(function(){
	$.ajax({
		url:"../js/index.json",
		type:"GET",
		success:function(data){
			//alert(123);
			for(let i = 0;i < data.length;i++){
				$(".showmenu").append($('<li><div class="div0"><div class="div1"></div><div class="div2"></div></div></li>'));
			}
			for(var i = 0; i < data.length; i++){
				$(".showmenu").find("li").eq(i).append('<a href = "#">' + data[i].title+'</a><br />');
				$(".showmenu").find("li").eq(i).find(".div0").css("top",-i*64);
				for( let j= 0; j < data[i].childTitle.length ;j++){
				 	$(".showmenu").find("li").eq(i).append('<a href = "#">' + data[i].childTitle[j]+'</a>');
				}
				for(let j = 0;j < data[i].sub.length; j++){
					$(".showmenu").find("li").eq(i).find(".div1").append("<a href='#'>"+data[i].sub[j]+"</a><br />")
				}
				if(!data[i].subTitle ==""){
					$(".showmenu").find("li").eq(i).find(".div2").append("<p>———— "+ data[i].subTitle +" ————<p>")
					$(".showmenu").find("li").eq(i).find(".div2").find("p").css({"display":"inline-block","height":"15px","width":"220px","text-align":"center","color":"gray"})
					for(let j = 0;j < data[i].subTitleChild.length; j++){
					$(".showmenu").find("li").eq(i).find(".div2").append("<a href='#'>"+data[i].subTitleChild[j]+"</a><br />")
				}
				}else{
					$(".showmenu").find("li").eq(i).find(".div2").remove();
				}
				/*判断二级菜单中两个div的高度和与div0的大小*/
				var h1 = $(".showmenu li").eq(i).find(".div0").find(".div1").find("a").height()*data[i].sub.length+8;
				if(!data[i].subTitle ==""){
					var h2 = $(".showmenu li").eq(i).find(".div0").find(".div2").find("a").height()*(data[i].subTitleChild.length+1)
				}else{
					var h2 = 0;
				}
				if(h1+h2 > 448){
					$(".showmenu li").eq(i).find(".div0").css("width","440px");
				}
			}
			
			$(".mygold").hover(function(){
				$(".downmenu").css("display", "block");
				$(this).find("i").attr("class","iconfont icon-shang")
			},function(){
				$(".downmenu").css("display", "none");
				$(this).find("i").attr("class","iconfont icon-xia1")
			})
			/*$(".showmenu").find("li").hover(function(){
				
			})*/
			$(".showmenu li").find(".div0").find("a").hover(function(){
				$(this).css("color", "#c81118");
			},function(){
				$(this).css("color", "black");
			})
			$(".showmenu").find("li").hover(function(){
				$(this).find("div").css("display","block");
			},function(){
				$(this).find("div").css("display","none");
			})
			$(".showmenu").find("li").find(".div0").find("a").hover(function(){
				$(this).css("background","gray");
			},function(){
				$(this).css("background","");
			})
			$(".showmenu").find("li").find(".div0").find("a").css("color","black");
		}	
	})
	$('.small').mousemove(function(e) {
		$('b').show();
		$('.big').show();
		var L = e.pageX;
		var l = $(this).offset().left;
		var left = L - l - 120;
	
	    var T = e.pageY;
		var t = $(this).offset().top;
		var top = T - t - 120;
	
		left = left < 0 ? 0 : left;
		left = left > 240 ? 240 : left;
		top = top < 0 ?0 : top;
		top = top > 240 ? 240 : top;
	
		$('b').css({left : left,top : top});
	
		var imgLeft = -left * 2;
		var imgTop = -top * 2;
		imgLeft = imgLeft < -480 ? -480 : imgLeft;
		imgTop = imgTop < -480 ? -480 : imgTop;
	
		$('.big img').css({left : imgLeft, top : imgTop});
	});
	
	$('.small').mouseout(function() {
		$('.small b').hide();
		$('.big').hide();
	});
	
	/*******鼠标移入商品列表切换商品*******/
	$(".list img").hover(function(){
		var url = $(this).attr("src");//获取当前点击图片的地址
		$(".picOrBig img").attr('src',url);             //将获取的SRC复制给元素small节点
		$(this).css("border","3px solid #eb8d91");
		$(this).siblings().css("border","1px solid #d2d2d2")
	})
	/************鼠标点击加减商品变化**************/
	$(".mount h2").mousedown(function(){
		$(this).css({"opacity":"1","background":"#e4e4e4"})
	})
	$(".mount h2").mouseup(function(){
		$(this).css({"opacity":"0.6","background":"white"})
	})
	$(".down").click(function(){
		var num = $(".showmount").val();
		if(num==1){
			$(".showmount").val(num);
			$(".showmount").val()=num;
		}else{
			num--;
			$(".showmount").val(num);
			$(".showmount").val()=num;
		}
	})
	
	
	$(".up").click(function(){
		var num2 = $(".showmount").val();
			num2++;
			$(".showmount").val(num2);
			$(".showmount").val()=num2;
	})
	
	/**********选择商品的点击*************/
	
	$(".phonebuy").hover(function(){
		$(".phoneLog").show();
	},function(){
		$(".phoneLog").hide();
	})
	
	$("#proColor1 dt").click(function(){
		var url = $(this).find("img").attr("src");//获取当前点击图片的地址
		$(".picOrBig img").attr('src',url); //将获取的SRC复制给元素small节点
		$(".list").find("img").eq(0).css("border","3px solid #eb8d91");
		$(".list").find("img").eq(0).siblings().css("border","1px solid #d2d2d2")
		$("#proColor2 dt").find("img").css("border","none");
		$("#proColor1 dt").find("img").css("border","1px solid #cb1a22");
		$("#proColor1 dt").find("i").css("display","inline-block");
		$("#proColor2 dt").find("i").css("display","none");
		$(".tobuycar2").css("display","none");
		$(".tobuycar1").css("display","block");
	})
	
	$("#proColor2 dt").click(function(){
         
		var url = $(this).find("img").attr("src");//获取当前点击图片的地址
		$(".picOrBig img").attr('src',url);
		$(".list").find("img").eq(1).css("border","3px solid #eb8d91");
		$(".list").find("img").eq(1).siblings().css("border","1px solid #d2d2d2")
		$("#proColor2 dt").find("img").css("border","1px solid #cb1a22");
		$("#proColor1 dt").find("img").css("border","none");
		$("#proColor1 dt").find("i").css("display","none");
		$("#proColor2 dt").find("i").css("display","inline-block");
		$(".tobuycar1").css("display","none");
		$(".tobuycar2").css("display","block");
	})
	
})

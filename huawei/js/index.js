$(function(){
	
	/********************主轮播图*******************/
	var oBtn = $("#intro").find("ol").find("li");
	var oUl = $("#intro").find(".show2");
	var aLi = oUl.find("li");
	
	//当前被选中的按钮的下标
	var iNow = 0;
	//定时器
	var timer1 = null; 
	oBtn.mouseover(function(){
		iNow = $(this).index();
		tab();
	});

	$(".show2").hover(function(){
		clearInterval(timer1);
	}, function(){
		timer1 = setInterval(timerInner, 2000);
	})
	$("ol").hover(function(){
		clearInterval(timer1);
	}, function(){
		timer1 = setInterval(timerInner, 2000);
	})

	timer1 = setInterval(timerInner, 2000);

	function timerInner(){
		iNow++;
		tab();
	}

	//切换图片的函数
	function tab(){
		oBtn.attr("class", "");
		oBtn.eq(iNow).attr("class", "active");
		//判断是否到最后一张
		if(iNow == aLi.size() - 1){
			oBtn.eq(0).attr("class", "active");
		}
		oUl.animate({left: -1920 * iNow}, function(){
			//当最后一张图片动画执行完成以后,我切回第一张
		/*	console.log(iNow);*/
			if(iNow == aLi.size() - 1){
				iNow = 0;
				oUl.css("left", "0px");
			}
		});
	}
	
	/*******************轮播图2****************/
	 		$(".pic li").eq(0).show();
			  //鼠标滑过手动切换，淡入淡出
			  $("#position li").mouseover(function() {
			  $(this).addClass('cur').siblings().removeClass("cur");
			  var index = $(this).index();
			  i = index;//不加这句有个bug，鼠标移出小圆点后，自动轮播不是小圆点的后一个
			  // $(".pic li").eq(index).show().siblings().hide();
			  $(".pic li").eq(index).fadeIn(500).siblings().fadeOut(500);
			  });
			  //自动轮播
			  var i=0;
			  var timer2=setInterval(play,2000);
			  //向右切换
			  
			  var play=function(){
			  //alert($("#position li").size())
			  i++;
			  i = i > ($("#position li").size()-1) ? 0 : i ;
			  $("#position li").eq(i).addClass('cur').siblings().removeClass("cur");
			  $(".pic li").eq(i).fadeIn(500).siblings().fadeOut(500);
			  }
			  //向左切换
			  var playLeft=function(){
			  i--;
			  i = i < 0 ? ($("#position li").size()-1) : i ;
			  $("#position li").eq(i).addClass('cur').siblings().removeClass("cur");
			  $(".pic li").eq(i).fadeIn(500).siblings().fadeOut(500);
			  }
			  //鼠标移入移出效果
			  $("#container").hover(function() {
			  clearInterval(timer2);
			  }, function() {
			  timer2=setInterval(play,2000);
			  });
			  timer2=setInterval(play,2000);
			  //左右点击切换
			 /* $("#prev").click(function(){
			  playLeft();
			  })
			  $("#next").click(function(){
			  play();
			  })*/
	
	/****************数据下载*****************/
	
		$.ajax({
		url:"js/index.json",
		type:"GET",
		success:function(data){
			//alert(123);
			for(let i = 0;i < data.length;i++){
				$(".show1").append($('<li><div class="div0"><div class="div1"></div><div class="div2"></div></div></li>'));
			}
			for(var i = 0; i < data.length; i++){
				$(".show1").find("li").eq(i).append('<a href = "#">' + data[i].title+'</a><br />');
				$(".show1").find("li").eq(i).find(".div0").css("top",-i*64);
				for( let j= 0; j < data[i].childTitle.length ;j++){
				 	$(".show1").find("li").eq(i).append('<a href = "#">' + data[i].childTitle[j]+'</a>');
				}
				for(let j = 0;j < data[i].sub.length; j++){
					$(".show1").find("li").eq(i).find(".div1").append("<a href='#'>"+data[i].sub[j]+"</a><br />")
				}
				if(!data[i].subTitle ==""){
					$(".show1").find("li").eq(i).find(".div2").append("<p>———— "+ data[i].subTitle +" ————<p>")
					$(".show1").find("li").eq(i).find(".div2").find("p").css({"display":"inline-block","height":"15px","width":"220px","text-align":"center","color":"gray"})
					for(let j = 0;j < data[i].subTitleChild.length; j++){
					$(".show1").find("li").eq(i).find(".div2").append("<a href='#'>"+data[i].subTitleChild[j]+"</a><br />")
				}
				}else{
					$(".show1").find("li").eq(i).find(".div2").remove();
				}
				/*判断二级菜单中两个div的高度和与div0的大小*/
				var h1 = $(".show1 li").eq(i).find(".div0").find(".div1").find("a").height()*data[i].sub.length+8;
				if(!data[i].subTitle ==""){
					var h2 = $(".show1 li").eq(i).find(".div0").find(".div2").find("a").height()*(data[i].subTitleChild.length+1)
				}else{
					var h2 = 0;
				}
				if(h1+h2 > 448){
					$(".show1 li").eq(i).find(".div0").css("width","440px");
				}
			}
			
			$(".show1").find("li").find("a").hover(function(){
				$(this).css("color", "#c81118");
			},function(){
				$(this).css("color", "");
			})
			$(".show1 li").find(".div0").find("a").hover(function(){
				$(this).css("color", "#c81118");
			},function(){
				$(this).css("color", "black");
			})
			$(".show1").find("li").hover(function(){
				$(this).find("div").css("display","block");
			},function(){
				$(this).find("div").css("display","none");
			})
			$(".show1").find("li").find(".div0").find("a").hover(function(){
				$(this).css("background","#e4e4e4");
			},function(){
				$(this).css("background","");
			})
			$(".show1").find("li").find(".div0").find("a").css("color","black");
		}	
	})
		/********产品图片1**********/
	$.ajax({
		type:"GET",
		url:"js/product2_pic.json",
		success:function(data){
			for(var i = 0; i < data.length; i++){
				$("#product2_pic").find("li").eq(i).append('<a href = "#"><img src = "'+ data[i].url+ '" ></a>');
				//alert(data[i].childTitle.length);
			}
			$("#product2_pic li").find("img").css({"width":"100%",height:"100%"})
		}
		//$("#product2_pic li").find("img").css("width","")
	})
	/*************产品图片2******************/
	$.ajax({
		type:"GET",
		url:"js/recommend.json",
		success:function(data){
			//alert(123);
			for(var i = 0;i < data.length; i++){
				if (data[i].url.length == 2) {
				 	$("#recommend ul").find("li").eq(i).find("i").append('<img src = "'+ data[i].url[0]+ '" >');
				 	$("#recommend ul").find("li").eq(i).find("a").append('<img src = "'+ data[i].url[1]+ '" >');
				}else{
					$("#recommend ul").find("li").eq(i).find("a").append('<img src = "'+ data[i].url[0]+ '" >');
				}
				var oDiv1 = $("<div class='recommend_span'></div>") 
				$("#recommend ul").find("li").eq(i).find("a").append(oDiv1);
				$("#recommend ul").find("li").eq(i).find("a").find("div").append('<span>'+ data[i].title+ '</span>' + "<br />");
				$("#recommend ul").find("li").eq(i).find("a").find("div").append('<span>'+ data[i].catlog+ '</span>'+ "<br />");
				$("#recommend ul").find("li").eq(i).find("a").find("div").append('<span>'+ data[i].price+ '</span>'+ "<br />");
				
			}
			$("#recommend ul").find("li").hover(function(){
				$(this).find("a").find("img").stop().animate({"width":"155px","height":"155px","padding-top":"0px"},200)
				},function(){
				$(this).find("a").find("img").stop().animate({"width":"145px","height":"145px","padding-top":"5px"},200)
				})
		}
	})
	/*******精品手机********/
	
	$.ajax({
		type:"GET",
		url:"js/JINGPINSHOUJI.json",
		success:function(data){
			//alert(data[0].url);
			for(var i = 0;i< data.length; i++){
				if (data[i].url.length == 2) {
				 	$("#productShow1").append("<li><i><img src='" + data[i].url[0] + "'></i><a href='#'><img src='" + data[i].url[1] + "'</a></li>");
				 	/*$("#productShow1 ul").find("li").eq(i).find("a").append('<img src = "'+ data[i].url[1]+ '" >');*/
				}else{
					$("#productShow1").append("<li><i></i><a href='#'><img src='" + data[i].url[0] + "'></a></li>");
				}
				if(!data[i].title == ""){
					$("#productShow1").find("li").eq(i).find("a").append("<div class='recommend_span show1_span'><span>" + data[i].title + "</span><br /><span>"+data[i].catlog+"</span><br /><span>" + data[i].price + "</span></div>");
				}
				
				$("#productShow1").find("li").eq(0).find("i").remove();
				$("#productShow1").find("li").eq(5).find("i").remove();
				$("#productShow1").find("li").eq(0).find("a").css("height","100%");
				$("#productShow1").find("li").eq(5).find("a").css("height","100%");
			}
			$("#productShow1").find("li").hover(function(){
				$(this).stop().animate({"top":"-2px"},200).css("box-shadow","5px 5px 15px #e4e4e4,-5px 0 15px  #e4e4e4")
				},function(){
				$(this).stop().animate({"top":"0px"},200).css("box-shadow","")
				})
		}
	})
	/*******************平板&笔记本****************/
	
	$.ajax({
		url:"js/平板.json",
		type:"GET",
		success:function(data){
			for (var i = 0; i < data.length; i++){
				if (data[i].url.length == 2) {
				 	$("#productShow2").append("<li><i><img src='" + data[i].url[0] + "'></i><a href='#'><img src='" + data[i].url[1] + "'</a></li>");
				}else{
					$("#productShow2").append("<li><i></i><a href='#'><img src='" + data[i].url[0] + "'></a></li>");
				}
				if(!data[i].title ==""){
					$("#productShow2").find("li").eq(i).find("a").append("<div class='show2_span recommend_span'><span>" + data[i].title + "</span><br /><span>"+data[i].catlog+"</span><br /><span>" + data[i].price + "</span></div>");
				}
			}
			
				
				
				$("#productShow2").find("li").eq(0).find("i").remove();
				$("#productShow2").find("li").eq(9).find("i").remove();
				$("#productShow2").find("li").hover(function(){
				$(this).stop().animate({"top":"-2px"},200).css("box-shadow","5px 5px 15px #e4e4e4,-5px 0 15px  #e4e4e4")
					},function(){
					$(this).stop().animate({"top":"0px"},200).css("box-shadow","")
				})
		}
			
		
	})
})
		
$().extend({size: function(){
	return this.elements.length;
}})



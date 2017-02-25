$(function(){
	var isYes = true; 
	$(".span2").click(function(){
		if(isYes){
			$(".china86").css({"display":"block"})
			isYes = false;
		}else{
			$(".china86").css({"display":"none"})
			isYes = true;
	}
		})
	$(".china86").hover(function(){
		$(".china86").css("background","#e4e4e4")
	},function(){
		$(".china86").css("background","white")
	})
	
	/************判断手机号是否正确***************/
	
	$("#input1").blur(function(){
		var phnum = $("#input1").val();
		var reg = /^1[34578]\d{9}$/;
		if(phnum ==""){
			$(".remind").html("！手机号码不能为空");
			$(".remind").css({"border-color":"red","color":"red","display":"inline-block"})
		}else if(!(reg.test(phnum))){
			$(".remind").html("！请输入正确的手机号码");
			$(".remind").css({"border-color":"red","color":"red","display":"inline-block"})

		}else{
			$(".remind").html("正确的手机号码");
			$(".remind").css({"border-color":"green","color":"green","display":"inline-block"})
		}
	})
	$(".inputNum2").focus(function(){
		var phnum = $("#input1").val();
		var reg = /^1[34578]\d{9}$/;
		if(reg.test(phnum)){
			$(".remind").css("display","none");
		}
	})

	$('.pwset1').keyup(function(e) {
	    // alert('---------');
	     //密码为八位及以上并且字母数字特殊字符三项都包括
	     var strongRegex = new RegExp("^(?=.{10,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	 	  //密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等 
	     var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	     var enoughRegex = new RegExp("(?=.{8,}).*", "g");
	     if (false == enoughRegex.test($(this).val())) {
	     	$('.powinfor').css("display","block");
	         $('.powinfor').html('密码的长度为8~32个字符');
	         $('.pow1').css('background','#eee');
	         $('.pow2').css('background','#eee');
	         $('.pow3').css('background','#eee');
	     } else if (strongRegex.test($(this).val())) {
	         //$('#passstrength').className = 'ok';
	         $('.pow3').css('background','green');
	         $('.pow2').css('background','#eee');
	         $('.powinfor').css("display","none");
	         $('.pow1').css('background','#eee');
	         
	     } else if (mediumRegex.test($(this).val())) {
	         //$('#passstrength').className = 'alert';
	         $('.pow2').css("background","yellow");
	          $('.pow1').css('background','#eee');
	          $('.powinfor').css("display","none");
	     } else {
	         //$('#passstrength').className = 'error';
	         $('.powinfor').css("display","none");
	         $('.pow1').css('background','red');
	          $('.pow3').css('background','#eee');
	         $('.pow2').css('background','#eee');
	     }
	     return true;
	});
	$(".pwset2").blur(function(){
		if($(this).val().length<6){
			$('.powinfor3').hide();
			$('.powinfor2').hide();
		}else if($(this).val() == $(".pwset1").val()){
			$('.powinfor2').hide();
			$('.powinfor3').show();
		}else{
			$('.powinfor3').hide();
			$('.powinfor2').show();
		}
	})

})

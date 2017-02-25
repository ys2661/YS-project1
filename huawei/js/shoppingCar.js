$(function(){
	/**/
	sc_car();
	addproduct();
	var id = 0;
	$(".selectcolor dt").click(function(){
		id = $(this).attr("id");
	})
	
 	$(".addSc").click(function(){
 		
	   	var same =false;
		var first = $.cookie("goods") == null ? true :　false;
		var num1 = Number($(".showmount").val());
		var num2 = Number($(".amount").html());
		if(first){
			$.cookie("goods",'[{"id":'+ id +',"num":' + num1 + '}]');
			addproduct();
		}else{
			var str = $.cookie("goods");
			var arr =JSON.parse(str);
			var Num = $(".count1").html();
			
			for(var i in arr){
				if (arr[i].id == id){
					arr[i].num += num1;
					var newstr = JSON.stringify(arr);
					$.cookie("goods", newstr);
					same = true;
					
					
				}
			}
				if(!same){
					var obj = {
						id: id,
						num: num1
					}
					arr.push(obj);
					var newstr = JSON.stringify(arr);
					$.cookie("goods", newstr);
				
			}
				var Qu = Number(Num) + Number(num1)
				$(".count1").html(Qu);
				$(".totle_count").html(Qu);
				$(".totle_price").html("¥"+ Qu*599+".00");
		}
		sc_car();
		
		$(".close").click(function(){
			$(this).parent().remove();
			$(".buyCarInfor").css("display","block");
			$(".settle").css("display","none");
			$(".amount").html(0);
			$.cookie("goods",null);
		})
	})
 	
 	$(".close").click(function(){
			$(this).parent().remove();
			$(".buyCarInfor").css("display","block");
			$(".settle").css("display","none");
			$(".amount").html(0);
			$.cookie("goods",null);
		})
	function sc_car(){
		var sc_str = $.cookie("goods");
		if(sc_str){
			var sc_arr = JSON.parse(sc_str);
			var sc_num = 0;
			for(var i in sc_arr){
				sc_num += Number(sc_arr[i].num);  
			}
			$(".amount").html(sc_num);
		}
	}
	
	function addproduct(){
		var sc_str = $.cookie("goods");
		if(sc_str){
			var sc_arr = JSON.parse(sc_str);
			var sc_num = 0;
			for(var i in sc_arr){
				if(sc_arr[i].id == 1){
					$(".buyCarPro").append('<li><a class="buyCarPic"  href="#"><img src="../img/【荣耀 Magic 专属真皮皮套】_华为商城3_files/428_428_1484218356658mp.jpg"/></a><a class="li-title" href="#">荣耀 Magic 专属真皮皮套 棕色</a><p><span>¥ 599.00 </span> X <span class="count1">' + sc_arr[i].num + '</span></p><button class="close">X</button></li>');
					$(".buyCarPro").css("display","block");
					$(".buyCarInfor").css("display","none");
					$(".settle").css("display","block");
				}
				
				if(sc_arr[i].id == 0){
					$(".buyCarPro").append('<li><a class="buyCarPic"  href="#"><img src="../img/【荣耀 Magic 专属真皮皮套】_华为商城3_files/428_428_1484218331968mp.jpg"/></a><a class="li-title" href="#">荣耀 Magic 专属真皮皮套 黑色</a><p><span>¥ 599.00 </span> X <span class="count2">' + sc_arr[i].num + '</span></p><button class="close">X</button></li>');
					$(".buyCarPro").css("display","block");
					$(".buyCarInfor").css("display","none");
					$(".settle").css("display","block");
				}
			}
		}
	}
})


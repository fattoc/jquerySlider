
var pos = 0;//当前位置
var totalSlides;//轮播总数
var sliderWidth;//单张图宽度
$(document).ready(function(){
	//轮播图片总数
	totalSlides = $('#slider li').length;
	//外层div宽度
	sliderWidth = $('#slider-wrap').width();
	
	
	/*****************
	 创建轮播序列
	*****************/
	//把所有图片横排拼起来，取总宽度
	$('#slider').width(sliderWidth*totalSlides);
	
    //下一张 	
	$('#next').click(function(){
		slideRight();
	});
	
	//上一张
	$('#prev').click(function(){
		slideLeft();
	});
	
	//暂停 / 播放
	var state=0;
	$("#pause").click(function() {
		if(state==0){
			 //停止播放，并将按钮改为播放按钮
			 clearInterval(autoSlider);
			 $(this).find('i').removeClass('fa-pause').addClass('fa-play');
			 state=1;
		}else  {
			 ////重新播放，并将按钮改为暂停按钮
			 $(this).find('i').removeClass('fa-play').addClass('fa-pause');
			 autoSlider = setInterval(slideRight, 2000); 
			 state=0;
		}

	});
	
	
	
	/*************************
	 //*> 操作设置
	************************/
	//5秒自动播放
	var autoSlider = setInterval(slideRight, 2000);
	
	//遍历每一张图片 
	$.each($('#slider-wrap ul li'), function() { 
	   //设置背景色
	   var bgc = $(this).attr("data-color");
	   $(this).css("background",bgc);
	      
	});
	
	//统计当前是第几张
	countSlides();
	
	//鼠标滑过时暂停播放，鼠标移开，重新播放
	$('#slider-wrap').hover(
	  function(){ 
		  $(this).addClass('active'); 
		  $("#pause").show();
	  }, 
	  function(){ 
		  $(this).removeClass('active'); 
		  $("#pause").hide();
	  }
	);
	
	

});
	


/***********
 左滑
************/
function slideLeft(){
	pos--;
	if(pos==-1){ pos = totalSlides-1; }
	$('#slider').css('left', -(sliderWidth*pos)); 	
	
	//*> 
	countSlides();
}


/************
 右滑
*************/
function slideRight(){
	pos++;
	if(pos==totalSlides){ pos = 0; }
	$('#slider').css('left', -(sliderWidth*pos)); 
	
	//*>  
	countSlides();
}



	
/************************
 //*> 轮播计数
************************/
function countSlides(){
	$('#counter').html(pos+1 + ' / ' + totalSlides);
}


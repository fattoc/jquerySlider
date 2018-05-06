### jquery简单实现图片轮播

> 图片轮播效果在平时开发过程中使用的频率非常高，为了避免重复造轮子，也为了之后遇到可以节约时间，所以大致记录一下实现过程，方便复用。

​	图片轮播其实也有很多坑，因为有时候需要轮播的图片大小不一致，如果要照顾到美观、整齐等因素就可能导致某些图片被裁切或者挤压变形；如果重点是保障图片显示的完整性，并且尽量保证不变形不留白时，则可能导致图片显示区域来回变化挤占其它DOM位置的情况。关于这一部分有机会再研究，这里默认需要轮播的图片都是经过特殊处理，大小一致 风格统一的（手动滑稽）。

#### 轮播原理

​	图片轮播的原理就是把所有需要轮播的图片都横着排成一排（因为通常是横向轮播）就像一节节的火车一样，然后启动定时器，每秒向左移动一张图片宽度的距离，只有移动到显示区域的那一张图片会被看到，其它的图片隐藏。

![](http://or14c7bex.bkt.clouddn.com//1525520321180505_193642.png)

​	比如上图逐次播放蓝、绿、黄三张图，接下来迅速将图片队列向右拉回到初始位置，之后再继续向左移动

![](http://or14c7bex.bkt.clouddn.com//1525597284180506_170106.png)



#### HTML结构搭建

```html
<div id="slider-wrap">
	  <ul id="slider">
		 <li data-color="#1abc9c">
			<div>
				<h4>Slide #1</h4>
			</div>                
			<i class="fa fa-image"></i>
		 </li>
		 
		 <li data-color="#3498db">
			<div>
				<h4>Slide #2</h4>
			</div>
			<i class="fa fa-gears"></i>
		 </li>
		 
		 <li data-color="#9b59b6">
			<div>
				<h4>Slide #3</h4>
			</div>
			<i class="fa fa-sliders"></i>
		 </li>
		 
		 <li data-color="#34495e">
			<div>
				<h4>Slide #4</h4>
			</div>
			<i class="fa fa-code"></i>
		 </li>
		 
		 <li data-color="#e74c3c">
			<div>
				<h4>Slide #5</h4>
			</div>
			<i class="fa fa-microphone-slash"></i>
		 </li>
	  </ul>
	  
	   <!--controls-->
	  <div class="btns" id="next"><i class="fa fa-arrow-right"></i></div>
	  <div class="btns" id="pause"><i class="fa fa-pause" aria-hidden="true"></i></div>
	  <div class="btns" id="prev"><i class="fa fa-arrow-left"></i></div>
	  <div id="counter"></div>
	  <!--controls-->   
</div>
```

#### 简单设置一下样式

```css
/*GLOBALS*/
*{margin:0; padding:0; list-style:none;}
a{text-decoration:none;	color:#666;}
a:hover{color:#1bc1a3;}
body, hmtl{background: #ecf0f1; font-family: 'Anton', sans-serif;}

#wrapper{
	width:600px;
	margin:50px auto;
	height:400px;
	position:relative;
	color:#fff;
	text-shadow:rgba(0,0,0,0.1) 2px 2px 0px;	
}

#slider-wrap{
	width:600px;
	height:400px;
	position:relative;
	overflow:hidden;
}

#slider-wrap ul#slider{
	width:100%;
	height:100%;
	
	position:absolute;
	top:0;
	left:0;		
}

#slider-wrap ul#slider li{
	float:left;
	position:relative;
	width:600px;
	height:400px;	
}

#slider-wrap ul#slider li > div{
	position:absolute;
	top:20px;
	left:35px;	
}

#slider-wrap ul#slider li > div h3{
	font-size:36px;
	text-transform:uppercase;	
}

#slider-wrap ul#slider li > div span{
	font-family: Neucha, Arial, sans serif;
	font-size:21px;
}

#slider-wrap ul#slider li i{
	text-align:center;
	line-height:400px;
	display:block;
	width:100%;
	font-size:90px;	
}

/*btns*/
.btns{
	position:absolute;
	width:50px;
	height:50px;
	top:50%;
	margin-top:-25px;
	line-height:50px;
	text-align:center;
	cursor:pointer;	
	background:rgba(0,0,0,0.1);
	z-index:100;
	
	
	-webkit-user-select: none;  
	-moz-user-select: none; 
	-khtml-user-select: none; 
	-ms-user-select: none;
	
	-webkit-transition: all 0.1s ease;
	-moz-transition: all 0.1s ease;
	-o-transition: all 0.1s ease;
	-ms-transition: all 0.1s ease;
	transition: all 0.1s ease;
}

.btns:hover{
	background:rgba(0,0,0,0.3);	
}

#next{right:-50px; border-radius:7px 0px 0px 7px;}
#prev{left:-50px; border-radius:0px 7px 7px 7px;}

#pause {
    border-radius: 100%;
    left: 50%;
    top: 50%;
    background: #000;
	opacity: 0.8;
	display:none;
}
#counter{
	top: 30px; 
	right:35px; 
	width:auto;
	position:absolute;
}

#slider-wrap.active #next{right:0px;}
#slider-wrap.active #prev{left:0px;}

/*Header*/
h1, h2{text-shadow:none; text-align:center;}
h1{	color: #666; text-transform:uppercase;	font-size:36px;}
h2{ color: #7f8c8d; font-family: Neucha, Arial, sans serif; font-size:18px; margin-bottom:30px;} 

/*ANIMATION*/
#slider-wrap ul{
	-webkit-transition: all 0.3s cubic-bezier(1,.01,.32,1);
	-moz-transition: all 0.3s cubic-bezier(1,.01,.32,1);
	-o-transition: all 0.3s cubic-bezier(1,.01,.32,1);
	-ms-transition: all 0.3s cubic-bezier(1,.01,.32,1);
	transition: all 0.3s cubic-bezier(1,.01,.32,1);	
}
```

#### 轮播实现

```javascript
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
			 autoSlider = setInterval(slideRight, 5000); 
			 state=0;
		}

	});

	/*************************
	 //*> 操作设置
	************************/
	//5秒自动播放
	var autoSlider = setInterval(slideRight, 5000);
	
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
```

#### 最终效果

![](http://or14c7bex.bkt.clouddn.com/1525598579jqSlider.gif)

源码地址【[github](https://github.com/fattoc/jquerySlider)】










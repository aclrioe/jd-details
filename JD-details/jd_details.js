var cityJson;
$().ready(function(){
	pPhoto.init();
    pCc.bind();
    //页面最头部左上角的城市
  	$(".citysUl a").click(function(){
  		$(".citysUl a").removeClass("ctactive");
  		$(this).addClass("ctactive");
  		$(".wrap_top_citytext").html($(this).text());
  	});
    pCc.anyli();
    //获得json数据
    $.getJSON("json/sanlinkage.json",function(obj){
    	cityJson = obj;
    	var sb = new StringBuffer(); //用于字符串拼接
    	$.each(cityJson, function(index, val) {
    		if (val.item_code.substr(2,4)=='0000') {
    			sb.append("<li value='"+val.item_code+"'><a>"+val.item_name+"</a></li>")
    		};
    	});
    	$("#adres_province").append(sb.toString());
    	$("#adres_province>li").click(function(){
			var text = $(this).text();
			var clkVal = $(this).val();
			$("#nav_province").html(text);
			$("#nav_province").val(clkVal);
			$(".address_nav>li").removeClass("current");
			$("#nav_city").addClass("current");
			$(".tab_content>div").addClass("disp");
			$("#adres_city").removeClass("disp");
			proCityChange();
		});
    });
    wraplr.click();
});
//商品介绍 规格与包装 售后保障 商品评价来回切换
var wraplr = {
	click:function(){
		$(".navli").click(function(){
			var name = $(this).attr("name");
			$(".navli").removeClass("liactive");
			$(this).addClass("liactive");
			if (name=="shangpin") {
				$(".brandparameter,.productimg,.divtitW,.prodEva,.buyRefer,.wraplrw").css("display","block");
			}else if (name=="tabcon") {
				$(".brandparameter,.productimg").css("display","none");
				$(".tab_con").css("display","block");
			}else if (name=="aftersale") {
				$(".brandparameter,.productimg,.tab_con").css("display","none");
				$(".divtitW,.prodEva,.buyRefer,.wraplrw").css("display","block");
			}else if (name=="prodEva") {
				$(".brandparameter,.productimg,.tab_con,.divtitW").css("display","none");
				$(".prodEva,.buyRefer,.wraplrw").css("display","block");
			}else{
				$(".brandparameter,.productimg,.tab_con,.divtitW,.prodEva,.buyRefer").css("display","none");
				$(".wraplrw").css("display","block");
			}
		});

	}
};
// 改变省份时切换市区内容
function proCityChange(){
	var sb = new StringBuffer();
	var proVal = $("#nav_province").val();
	$.each(cityJson,function(index,val){
		if (val.item_code.substr(0,2) == proVal.toString().substr(0,2) && val.item_code.substr(2,4)!="0000"&&val.item_code.substr(4,2)=="00") {
			sb.append("<li value='"+val.item_code+"'><a>"+val.item_name+"</a></li>")
		}
	})
	$("#adres_city").empty();
	$("#adres_city").append(sb.toString());
	$("#adres_city>li").click(function(){
			var text = $(this).text();
			var clkVal = $(this).val();
			$("#nav_city").html(text);
			$("#nav_city").val(clkVal);
			$(".address_nav>li").removeClass("current");
			$("#nav_county").addClass("current");
			$(".tab_content>div").addClass("disp");
			$("#county_city").removeClass("disp");
			cityCountyChange();
		});
};
//改变市区内容时改变城镇内容
function cityCountyChange(){
	var sb = new StringBuffer();
	var proVal = $("#nav_city").val();
	$.each(cityJson,function(index,val){
		if (val.item_code.substr(0,4) == proVal.toString().substr(0,4) && val.item_code.substr(4,2)!="00") {
			sb.append("<li value='"+val.item_code+"'><a>"+val.item_name+"</a></li>")
		}
	})
	$("#county_city").empty();
	$("#county_city").append(sb.toString());
	$("#county_city>li").click(function(){
			var text = $(this).text();
			var clkVal = $(this).val();
			$("#nav_county").html(text);
			$("#nav_county").val(clkVal);
			$(".address_items").css("display","none");
			$(".addressA>span").html($("#nav_province").text()+" "+$("#nav_city").text()+" "+$("#nav_county").text());

		});
};
//省市区来回切换
var pCc={
	anyli:function(){
		$("#nav_province").click(function(){
			$(".address_nav>li").removeClass("current");
			$(this).addClass("current");
			$(".tab_content>div").addClass("disp");
			$("#adres_province").removeClass("disp");
    	});
    	$("#nav_city").click(function(){
			$(".address_nav>li").removeClass("current");
			$(this).addClass("current");
			$(".tab_content>div").addClass("disp");
			$("#adres_city").removeClass("disp");
    	});
    	$("#nav_county").click(function(){
			$(".address_nav>li").removeClass("current");
			$(this).addClass("current");
			$(".tab_content>div").addClass("disp");
			$("#county_city").removeClass("disp");
    	});
	},
	bind:function(){
		$(".address").bind({
	    	mouseover:function(){
	    		$(".address_items").css("display","block");
	    	},
	    	mouseout:function(){
	    		$(".address_items").css("display","none");
	    	}
	    });
	}

}
//新建一个对象，产品图片整个的事件都写在里面
var pPhoto = {
	LIWIDTH: 78,
	moved: 0,
	count: 0,
	ul: null,
	btnL: null,
	btnR: null,
	DIVWIDTH:450,
	DIVHEIGHT:450,
	MASKWIDTH:305,
	MASKHEIGHT:305,
	//初始化
	init: function(){
		this.ul = $("#productnavlist")[0];
		this.ul.onmouseover = this.changeImg;
		this.btnL = $("#productprev")[0];
		this.btnR = $("#productnext")[0];
		this.count = $("#productnavlist>li").length;
		this.btnR.onclick=this.btnL.onclick = function(){
			pPhoto.move(this);
		} ;
		$("#cover")[0].onmouseover = $("#cover")[0].onmouseout = this.changeMask;
		$("#cover")[0].onmousemove = function(){
			var e = window.event||arguments[0];
			pPhoto.zoom(e);
		}
	},
	//拖拽DIV
	zoom:function(e){
		var x = e.offsetX;
		var y = e.offsetY;
		var mTop = y-this.MASKHEIGHT/2;
		var mLeft = x-this.MASKWIDTH/2;
		mTop<0&&(mTop=0);
		mTop>(this.DIVHEIGHT-this.MASKHEIGHT)&&(mTop=this.DIVHEIGHT-this.MASKHEIGHT);
		mLeft<0&&(mLeft=0);
		mLeft>(this.DIVWIDTH-this.MASKWIDTH)&&(mLeft=this.DIVWIDTH-this.MASKWIDTH);
		$("#mask")[0].style.left=mLeft+"px";
		$("#mask")[0].style.top=mTop+"px";
		$("#largeMask>img")[0].style.left= (-2*mLeft)+"px";
		$("#largeMask>img")[0].style.top= (-2*mTop)+"px";
	},
	// 放大图的显示与隐藏
	changeMask:function(){
		var dis = $("#mask")[0].style.display;
		var lDis = $("#largeMask")[0].style.display;
		$("#mask")[0].style.display = dis=="block"?"none":"block";
		$("#largeMask")[0].style.display= lDis=="block"?"none":"block";
	},
	//图片移动
	move: function(btn){
		if (btn == this.btnR) {
			if (this.moved != this.count-5) {
				this.moved++;
				this.ul.style.left = (-this.moved*this.LIWIDTH)+"px";
			}
		}else{
			if (this.moved != 0) {
				this.moved--;
				this.ul.style.left = (-this.moved*this.LIWIDTH)+"px";
			}
		}
	},
	//图片切换
	changeImg: function(){
		var e = window.event || arguments[0]; //获取事件对象
		var target = e.target || e.srcElement; //获取目标元素
		if (target.nodeName == "IMG") {
			var addre = target.src;
			$(".wrapLT>img")[0].src = addre;
			$("#largeMask>img")[0].src = addre;
		}
		$("#productnavlist>li").mouseover(function(){
			$("#productnavlist>li").removeClass("producthover");
			$(this).addClass("producthover");
	});
	}
	
}

//定义StringBuffer
function StringBuffer(str) {
  var arr = [];
  str = str || "";
  var size = 0; // 存放数组大小
  arr.push(str);
  // 追加字符串
  this.append = function(str1) {
    arr.push(str1);
    return this;
  };
  // 返回字符串
  this.toString = function() {
    return arr.join("");
  };
  // 清空 
  this.clear = function(key) {
    size = 0;
    arr = [];
  };
  // 返回数组大小 
  this.size = function() {
    return size;
  };
  // 返回数组 
  this.toArray = function() {
    return buffer;
  };
  // 倒序返回字符串 
  this.doReverse = function() {
    var str = buffer.join('');
    str = str.split('');
    return str.reverse().join('');
  };
}
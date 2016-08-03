# HSSlider
HSSlider是一个基于jQuery的图片轮播器，主要用于移动端，提供类似iOS UIScrollView效果的图片轮播器。

- 支持拖拽，Swiper手势，纵向拖拽不影响整体页面滚动；
- 可配置自动循环轮播，可配置轮播时间；
- 可配置控件的长宽比；
- 暂时没其他了。

###示例
[示例1](http://www.thinkcode.cn/github/HSSlider/)

[示例2](http://www.thinkcode.cn/github/weisite/)

###使用说明

####1. 添加jQuery库
使用本地或者CDNjQuery库均可以
比如百度CDN：

```
<script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
```

####2. 添加HSSlider引用

```
<script src="js/hsslider.js"></script>
```

####3. 添加HTML代码

```
<div class="slider-wrapper">
    <ul class="slider" name="自定义name">
         <li> <!--你的代码-->  </li>
         <li>  <!--你的代码--> </li>
         <li>  <!--你的代码--> </li>
         <li>  <!--你的代码--> </li>
         <li>  <!--你的代码--> </li>
    </ul>
</div>
```
######NOTE:
最顶层div的class可以随意指定 ul的class也可以随意指定，如果页面有多个HSSlider控件，又需要指定每个slider滚动到那一页时候，可以为ul 指定唯一标识的name。

不要ul li 添加click事件，可以在```<li> <!--你的代码--> </li>```内部子元素添加click事件。

####4. 添加CSS代码

```
.slider-wrapper{position: relative;}
.slider { position: absolute;  overflow: hidden; z-index: 500; display: none}
.slider li{ float: left; display: inline;}
.slider li img {display:block; width:100%; height:100%}
```

######NOTE:
顶层div的class需要指定{position: relative}，它的宽度可以是固定的{width:200px},也可以是不固定的{width:100%}

####5. 配置
简单启用：
```
<script type="text/javascript">
    $(function(){
        $(".slider").hsslider();
    });
</script>
```

启用并配置
```
<script type="text/javascript">

    function scroll_to_page(index, name) {
        console.warn(index + " " + name);
    };

    $(function(){
        $(".slider").hsslider({
            autoplay:true,
            dealy:5000,
            compleation:scroll_to_page,
            aspect_numerator: 16,
            aspect_denominator: 9
        });
    });

</script>
```
######NOTE:
autoplay：是否启用轮播,默认开始；<br>
dealy：轮播时间,毫秒为单位，默认5000毫秒；<br>
compleation：滚动到下一页时候的回调。function(index, name){} ,index页面索引， name是slider的name属性，由用户指定，用来标识哪一个slider
；<br>
aspect_numerator:长宽比的分子；<br>
aspect_denominator:长宽比的分母，aspect_numerator和aspect_denominator需要共同指定才有效。

####6. 其他
在移动端如果在li里面添加链接图片时，点击时图片变暗，可以使用如下css代码解决：
```
*{-webkit-tap-highlight-color:rgba(255,0,0,0)}
```

###最后
本代码借鉴了unslider的开头代码，unslider里面代码没看懂，所以就自己写了一个。
代码的易用性还不是很好，但是用在自己项目里还是足够。如果你想写个轻量级的slider，可以借鉴一下本代码。

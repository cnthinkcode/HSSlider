/**
 * Created by dsys on 16/7/28.
 */
(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory(window.jQuery));
    } else {
        factory(window.jQuery);
    }
}(function($) {
    if(!$){
        return console.warn('没有加载jQuery');
    }

    function HSSlider($obj, option) {
        var self = this;
        var $slider_obj = $obj;  //jQuery对象
        var slider_obj = $obj.get(0); //Dom对象

        var slider_li_array = null;

        var start_x = 0;
        var start_y = 0;
        var offset_x = 0;
        var offset_y = 0;
        var move_orientation = 0; // :1 x方向 :2 y方向

        var start_date = null; //touch开始时间

        var slider_left = 0;
        var last_slider_left = 0;
        var min_slider_left = 0;
        var max_slider_left = 0;

        var page_index = 0;
        var page_width = 0;

        var is_single_children = false;  //是否只有一个li元素

        //事件
        var isSupportTouch = true;
        var move_flag = false;
        var drag_flag = false;

        //定时器
        var timer = null;

        var auto_paly_delay = option.dealy ?option.dealy : 5000;
        var is_auto_paly = option.autoplay;
        var compleation = option.compleation;
        var aspect_numerator = option.aspect_numerator; //分子
        var aspect_denominator = option.aspect_denominator; //分母

        //初始化
        self.init = function () {

            slider_li_array = $slider_obj.children();

            if(slider_li_array.length <= 0) {
                return false;
            }

            if(!aspect_denominator || !aspect_numerator){
                aspect_numerator = 16;
                aspect_denominator = 9;
            }

            is_single_children = slider_li_array.length == 1 ?true :false;

            if (!is_single_children){
                var $li_first_obj = $(slider_li_array[0]);
                var $li_last_obj = $(slider_li_array[slider_li_array.length - 1]);
                $li_first_obj.before($li_last_obj.prop("outerHTML"));
                $li_last_obj.after($li_first_obj.prop("outerHTML"));
            }

            slider_li_array = $slider_obj.children();

            //判断浏览器是否支持touch事件
            isSupportTouch = "ontouchstart" in document ? true : false;

            if(is_single_children){
                page_index = 0;
                self.resize_for_sinle();
            }else  {
                page_index = 1;
                self.resize();
            }
            $slider_obj.fadeIn();
            return true;
        };

        //界面尺寸变化
        self.resize = function () {
            var window_width = $(slider_obj.parentNode).width();
            page_width = window_width;

            min_slider_left = -window_width * (slider_li_array.length - 1);
            max_slider_left = 0;

            //设置slider_obj的宽度
            slider_obj.style.width = window_width * slider_li_array.length + 'px' ;
            slider_obj.style.height = parseInt((window_width / parseFloat(aspect_numerator) * parseFloat(aspect_denominator)))  + 'px';
            slider_obj.parentNode.style.height =  parseInt((window_width /  parseFloat(aspect_numerator) * parseFloat(aspect_denominator)))  + 'px';

            for(var i = 0; i < slider_li_array.length; i++){
                var li_obj = slider_li_array[i];
                li_obj.style.width = window_width + "px";
            }

            //TODO:修改图片尺寸
            var image_list = $slider_obj.find("img");
            for (var i = 0; i < image_list.length; i++){
                var image = image_list[i];
                image.style.width = window_width + "px";
                image.style.height = parseInt((window_width /  parseFloat(aspect_numerator) * parseFloat(aspect_denominator))) + "px";
            }


            self.move_to(page_index, false);
        };

        self.resize_for_sinle = function () {
            var window_width = $(slider_obj.parentNode).width();
            page_width = window_width;

            min_slider_left = 0;
            max_slider_left = 0;

            //设置slider_obj的宽度
            slider_obj.style.width = window_width * slider_li_array.length + 'px' ;
            slider_obj.style.height = parseInt(window_width /  parseFloat(aspect_numerator) * parseFloat(aspect_denominator))  + 'px';
            slider_obj.parentNode.style.height =  parseInt(window_width /  parseFloat(aspect_numerator) * parseFloat(aspect_denominator))  + 'px';

            for(var i = 0; i < slider_li_array.length; i++){
                var  li_obj = slider_li_array[i];
                li_obj.style.width = window_width + "px";
            }

        };

        //开始触屏事件
        var fn_touchstart = function (event) {
            if(!isSupportTouch){
                event.preventDefault();
            }

            //停止slider的一切动画
            $slider_obj.stop();
            //停止自动播放
            self.stop_auto_play();

            move_flag = true;
            drag_flag = false;
            var start_event = null;

            if(isSupportTouch) {
                start_event =  event.targetTouches[0];
            }else  {
                start_event = event;
            }

            if(start_event){
                start_x = start_event.pageX;
                start_y = start_event.pageY;

                offset_x = start_x;
                offset_y = start_y;

                last_slider_left = slider_left;

                start_date = new Date();
            }
        };

        //触屏移动事件
        var fn_touchmove = function (event) {

            drag_flag = true;
            var move_event = null;
            if (isSupportTouch){
                move_event = event.targetTouches[0];
            }else {
                if (!move_flag) return;
                move_event = event;
            }

            if (move_event){

                if(move_orientation == 0 ){
                    if (Math.abs(move_event.pageX  - start_x) >= Math.abs(move_event.pageY  - start_y)){
                        move_orientation = 1;

                    }else {
                        move_orientation = 2;
                    }
                }

                if(move_orientation == 2){
                    return;
                }

                var x = move_event.pageX - offset_x;
                var y = move_event.pageY - offset_y;

                event.preventDefault();
                slider_left += x;
                slider_left = Math.max(slider_left,min_slider_left);
                slider_left = Math.min(slider_left, max_slider_left);
                slider_obj.style.left = slider_left + 'px';

                offset_x = move_event.pageX;
                offset_y = move_event.pageY;

            }
        };

        //结束触屏事件
        var fn_touchend = function (event) {
            if(!isSupportTouch){
                event.stopPropagation();
                event.preventDefault();
            }
            move_flag = false;
            self.move();
            self.start_auto_play();
            move_orientation = 0;
        };


        //PC 鼠标离开
        var fn_mouseout = function (event) {
            event.preventDefault();
            move_flag = false;
            self.move();
            self.start_auto_play();
            move_orientation = 0;
        };

        //PC 点击事件
        var fn_click = function (event) {
            if (drag_flag){
                event.preventDefault();
            }
        };


        //添加事件
        self.addEvent = function () {

            if(isSupportTouch){
                //开始触屏事件
                slider_obj.addEventListener('touchstart', fn_touchstart, false);
                //触屏移动事件
                slider_obj.addEventListener('touchmove', fn_touchmove, false);
                //结束触屏事件
                slider_obj.addEventListener('touchend',fn_touchend, false);

            }else  {
                //鼠标按下
                slider_obj.addEventListener('mousedown', fn_touchstart, false);
                //鼠标移动
                slider_obj.addEventListener('mousemove', fn_touchmove, false);
                //鼠标松开
                slider_obj.addEventListener('mouseup', fn_touchend, false);
                //鼠标离开
                $slider_obj.mouseout(fn_mouseout);
                //鼠标点击
                slider_obj.addEventListener('click', fn_click, false);

            }
        };

        //
        self.move = function () {
            var move_x = offset_x - start_x;
            if ( Math.abs(move_x) < 0.1) return;

            var end_date = new Date();
            var interval = end_date.getTime() - start_date.getTime();

            var is_swiper = false;

            if (interval <= 300 && Math.abs(move_x) > 50){
                //判断为swiper手势
                is_swiper = true;
            }

            var distance = Math.abs(parseFloat(move_x) / parseFloat(page_width));
            var last_page = Math.abs(last_slider_left / page_width);

            if(move_x > 0 && (distance > 0.45 || is_swiper) )
                page_index = last_page - 1;
            else if(move_x > 0 && distance < 0.45)
                page_index = last_page;
            else if(move_x < 0 && (distance >0.45 || is_swiper))
                page_index = last_page + 1;
            else
                page_index = last_page;

           self.move_to(parseInt(page_index), true);

            //清理工作
            offset_x = 0;
            start_x = 0;
            start_date = null;
        };

        //滑动到某一页
        self.move_to = function (index, animation) {
            page_index = index;

            var  animation_delay = arguments[2] ?arguments[2]:"fast";

            slider_left = -index * page_width;
            slider_left = Math.max(slider_left,min_slider_left);
            slider_left = Math.min(slider_left, max_slider_left);
            var left_value = slider_left + 'px';

            var adjust_pos = function () {
                if(page_index <= 0){
                    self.move_to(slider_li_array.length - 2, false);
                }else if(page_index > slider_li_array.length - 2){
                    self.move_to(1, false);
                }else {
                    if (compleation){
                        compleation(page_index - 1, $slider_obj.attr("name"));
                    }
                }
            };

            if(!animation){
                slider_obj.style.left = left_value ;
                adjust_pos();
            }else  {
                $slider_obj.animate({
                    left:left_value
                }, animation_delay, function () {
                    adjust_pos();
                });
            }
        };

        //计时器
        self.start_auto_play = function () {

            if (timer != null) {
                self.stop_auto_play();
            }

            timer = setInterval(function(){
                self.move_to(page_index + 1, true, 400);
            }, auto_paly_delay);
        };


        self.stop_auto_play = function () {
            clearInterval(timer);
            timer = null;
        };

        //run入口
        self.run = function () {

            if(self.init()){

                if (!is_single_children){
                    //添加事件监听
                    self.addEvent();

                    if(is_auto_paly){
                        //开始自动播放
                        self.start_auto_play();
                    }
                }

                //窗口变化事件
                $(window).resize(function () {
                    if(is_single_children){
                        self.resize_for_sinle();
                    } else {
                        self.resize();
                    }
                });

            }else  {
                console.warn("HSSlider初始化失败");
            }
        };
    };


    //为JQuery对象添加hsslider方法
    $.fn.hsslider = function (option) {
         this.each(function () {
            var $this = $(this);
             var slider = new HSSlider($this, option);
             slider.run();
        });
      
    };

}));
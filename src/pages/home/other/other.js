let iBase = {
    Id: function(name){
        return document.getElementById(name);
    },
    //设置元素透明度,透明度值按IE规则计,即0~100
    SetOpacity: function(ev, v){
        ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
    }
}


//淡出效果(含淡出到指定透明度)
function fadeOut(elem, speed, opacity){
    /*
     * 参数说明
     * elem==>需要淡入的元素
     * speed==>淡入速度,正整数(可选)
     * opacity==>淡入到指定的透明度,0~100(可选)
     */
    speed = speed || 20;
    opacity = opacity || 0;
    //初始化透明度变化值为0
    var val = 150;
    //循环将透明值以5递减,即淡出效果
    (function f(){
        iBase.SetOpacity(elem, val);
        val -= 10;
        console.log(opacity)
        if (val >= opacity) {
            setTimeout(f, speed);
        }else if (val < 0) {
            //元素透明度为0后隐藏元素
            elem.style.display = 'none';
        }
    })();
}



export {iBase, fadeOut};
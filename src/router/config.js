//保存全局变量

global.music = {
    url:"http://47.107.238.107/Music/",
    name: "music"
}

String.prototype.myReplace=function(f,e){//吧f替换成e
    var reg=new RegExp(f,"g"); //创建正则RegExp对象
    return this.replace(reg,e);
}
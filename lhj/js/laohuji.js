if (!window.XMLHttpRequest) {
    window.XMLHttpRequest=function (){
        var xmlHttp = false;
        return new XMLHttpRequest();
        //return new ActiveXObject("Microsoft.XMLHTTP");
    }
}
//调用AJAX需要处理的页面(传输方式，执行页面及参数，提交方式,提交数据)
function ajax_call(transmission,linkurl,presented,val){
    var reFun = arguments[4] ? arguments[4] : "strings";  //回调函数
    var showID = arguments[5] ? arguments[5] : "";  //状态修改区域对像ID
    var xmlHttp=new XMLHttpRequest;
    //alert(reFun);
    //alert(typeof(reFun));
    if (typeof(reFun)=="function"){
        //transmission = true;
        xmlHttp.onreadystatechange = function(){
            /* 	0: Uninitialized
             1: Loading
             2: Loaded
             3: Interactive
             4: Finished */
            if(xmlHttp.readyState == 4)
            {
                try
                {
                    var ret = xmlHttp.responseText; //返回值
                    //alert(ret);
                    //alert(typeof(reFun));
                    reFun(ret, showID); //回访回调函数
                }
                catch(e)
                {
                    //alert(e.description);
                }
            }
        };
    }
    xmlHttp.open(presented, linkurl, transmission);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    if(presented=="POST"){  //提交方式
        xmlHttp.send(val);
    }
    else{
        xmlHttp.send(val);
    }
    if(typeof(reFun)=="string"){
        if(xmlHttp.readyState == 4){
            //alert(xmlHttp.responseText);
            return xmlHttp.responseText;
        }
    }
}
function wLaoHuJi(id) {
    this.frameid = id;
    this._doc = document;
    this.node=this._doc.getElementsByClassName("_state");
    this._config = {
        cardwidth: 40*size, //卡片的宽;
        cardheight: 40*size, //卡片的高;
        betcardwidth:87,
        betcardheight:87,
        margin:2,
        runboxlength:4,
        runloop:4,
        maxbet:99
    };
    this._piecelist = [];
    this._multitype = {
        "b_bar":100,
        "s_bar":50,
        "b_seven": 40,
        "b_star":30,
        "b_watermelons":25,
        "b_alarm":20,
        "b_coconut":15,
        "b_orange":10,
        "b_apple":5,
        "small":2,
        "cha":0
    };
    this.scores={"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0};
    this._piecelistposition = {};
    this._piecelistmulti = {};
    this._piecelisttype = {};

    this._money = 0;
    this._total = 0;           //默认为20分
    this._startbox = 1;         //上次结果，此次的起点
    this._endbox = 1;          //这是这次的结果
    this._jumpnum = 1;        //这些需要算出来
    this._currentshowlist = [1];

    //状态值
    this._isfirstbet = true;
    this._isrun = false;
    this.bsState=1;
    this.returnData=false;

    //定时器
    this._interval = null;

    this._mainDiv = null;
    this.frame = {
        "piece": {"bg":null,"run":null},
        "bet": null
    };
    this._self = this;
    var i;
    for (i = 1; i < 25; i++) {
        this._piecelist.push(i);
    }
}
//    通过ID获取节点;
wLaoHuJi.prototype.$ = function(id) {
    if (!this._doc) {
        this._doc = document;
    }
    if (id && typeof (id) === "string") {
        return this._doc.getElementById(id);
    }
    return null;
};
//初始状态;
wLaoHuJi.prototype.stateInit=function(obj){
    var objArr = document.getElementsByClassName(obj);
    for(var i= 0 ; i < objArr.length; i++){
        objArr[i].style.backgroundColor="transparent";
    }
}
wLaoHuJi.prototype.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

wLaoHuJi.prototype.in_Array = function(arr, e) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == e)
            return true;
    }
    return false;
}
//生成随机数
wLaoHuJi.prototype.rand = function(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
}

wLaoHuJi.prototype._getWinNum = function() {
    var r = this.rand(1, 100);
    var b = 2;
    if (r == 100) {
        //大Bar 1/100
        b = 24;
    }
    else if (r > 97) {
        //小Bar 2/100
        b = 23;
    }
    else if (r >= 95 && r <= 97) {
        //大77 3/100
        b = 12;
    }
    else if (r >= 90 && r <= 94) {
        //大星星 5/100
        b = 16;
    }
    else if (r >= 84 && r <= 89) {
        //大西瓜  6/100
        b = 4;
    }
    else if (r >= 76 && r <= 83) {
        //大铃铛  8/100
        var ar = this.rand(1, 2);
        switch (ar) {
            case 1:
                b = 22;
                break;
            case 2:
                b = 10;
                break;
        }
    }
    else if (r >= 68 && r <= 75) {
        //大椰子1  8/100
        var ar = this.rand(1, 2);
        switch (ar) {
            case 1:
                b = 3;
                break;
            case 2:
                b = 15;
                break;
        }
    }
    else if (r >= 59 && r <= 68) {
        //大桔子1  10/100
        var ar = this.rand(1, 2);
        switch (ar) {
            case 1:
                b = 21;
                break;
            case 2:
                b = 9;
                break;
        }
    }
    else if (r >= 44 && r <= 58) {
        //苹果  15/100
        var ar = this.rand(1, 4);
        switch (ar) {
            case 1:
                b = 1;
                break;
            case 2:
                b = 7;
                break;
            case 3:
                b = 13;
                break;
            case 4:
                b = 19;
                break;
        }
    }
    else if (r >= 36 && r <= 43) {
        //CHA  8/100
        var ar = this.rand(1, 2);
        switch (ar) {
            case 1:
                b = 6;
                break;
            case 2:
                b = 18;
                break;
        }
    }
    else {
        //小东西
        var ar = this.rand(1, 7);
        switch (ar) {
            case 1:
                b = 2;
                break;
            case 2:
                b = 5;
                break;
            case 3:
                b = 8;
                break;
            case 4:
                b = 11;
                break;
            case 5:
                b = 14;
                break;
            case 6:
                b = 17;
                break;
            case 7:
                b = 20;
                break;
        }
    }
    return b;
}

wLaoHuJi.prototype._getpieceinfo = function(i, j) {
    switch (i + "-" + j) {
        case "0-0":
            return { "type":"orange","css": "b_orange", "list": 21, "multi": "b_orange" };
        case "0-1":
            return { "type": "alarm", "css": "b_alarm", "list": 22, "multi": "b_alarm" };
        case "0-2":
            return { "type": "bar", "css": "s_bar", "list": 23, "multi": "s_bar" };
        case "0-3":
            return { "type": "bar", "css": "b_bar", "list": 24, "multi": "b_bar" };
        case "0-4":
            return { "type": "apple", "css": "b_apple", "list": 1, "multi": "b_apple" };
        case "0-5":
            return { "type": "apple", "css": "s_apple", "list": 2, "multi": "small" };
        case "0-6":
            return { "type": "coconut", "css": "b_coconut", "list": 3, "multi": "b_coconut" };
        case "1-0":
            return { "type": "alarm", "css": "s_alarm", "list": 20, "multi": "small" };
        case "2-0":
            return { "type": "apple", "css": "b_apple", "list": 19, "multi": "b_apple" };
        case "3-0":
            return { "type": "cha", "css": "cha", "list": 18, "multi": "cha" };
        case "4-0":
            return { "type": "star", "css": "s_star", "list": 17, "multi": "small" };
        case "5-0":
            return { "type": "star", "css": "b_star", "list": 16, "multi": "b_star" };
        case "6-0":
            return { "type": "coconut", "css": "b_coconut", "list": 15, "multi": "b_coconut" };
        case "6-1":
            return { "type": "coconut", "css": "s_coconut", "list": 14, "multi": "small" };
        case "6-2":
            return { "type": "apple", "css": "b_apple", "list": 13, "multi": "b_apple" };
        case "6-3":
            return { "type": "seven", "css": "b_seven", "list": 12, "multi": "b_seven" };
        case "6-4":
            return { "type": "seven", "css": "s_seven", "list": 11, "multi": "small" };
        case "6-5":
            return { "type": "alarm", "css": "b_alarm", "list": 10, "multi": "b_alarm" };
        case "6-6":
            return { "type": "orange", "css": "b_orange", "list": 9, "multi": "b_orange" };
        case "5-6":
            return { "type": "orange", "css": "s_orange", "list": 8, "multi": "small" };
        case "4-6":
            return { "type": "apple", "css": "b_apple", "list": 7, "multi": "b_apple" };
        case "3-6":
            return { "type": "cha", "css": "cha", "list": 6, "multi": "cha" };
        case "2-6":
            return { "type": "watermelons", "css": "s_watermelons", "list": 5, "multi": "small" };
        case "1-6":
            return { "type": "watermelons", "css": "b_watermelons", "list": 4, "multi": "b_watermelons" };
        default:
            return { "type": "", "css": "", "list": 0, "multi": "" };
    }
};

//显示单个或多个灯
wLaoHuJi.prototype.showbox = function(index) {
    var i, len;
    if (typeof (index) === 'number' && index > 0 && index < 24) {
        this.node[index].style.background="rgba(255, 0, 0, 0.4) none repeat scroll 0 0 !important;";
    }
    else if (this.isArray(index) && index.length > 0) {
        len = index.length;
        this.stateInit("_state");
        for (i = 0; i < len; i++) {
            this.$("_state"+index[i]).style.backgroundColor="rgba(255, 0, 0, 0.4)";
        }
    }
}

//每次改变需要显示的box，返回速度
wLaoHuJi.prototype.changeshowlist = function(jumpindex) {
    var i,
        len = this._currentshowlist.length,
        jumpmax = this._jumpnum;
    switch (jumpindex) {
        case 0:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 400;
        case 1:
            if (len == 1) {
                var v = this._currentshowlist[0] + 1;
                v = v > 24 ? v - 24 : v;
                this._currentshowlist.push(v);
            }
            return 350;
        case 2:
            if (len == 2) {
                var v = this._currentshowlist[1] + 1;
                v = v > 24 ? v - 24 : v;
                this._currentshowlist.push(v);
            }
            return 300;
        case 3:
            if (len == 3) {
                var v = this._currentshowlist[2] + 1;
                v = v > 24 ? v - 24 : v;
                this._currentshowlist.push(v);
            }
            return 200;
        case jumpmax - 1:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 800;
        case jumpmax - 2:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 700;
        case jumpmax - 3:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 600;
        case jumpmax - 4:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 400;
        case jumpmax - 5:
            var v = this._currentshowlist[0] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 300;
        case jumpmax - 6:
            var v = this._currentshowlist[1] + 1;
            this._currentshowlist.length = 0;
            v = v > 24 ? v - 24 : v;
            this._currentshowlist[0] = v;
            return 200;
        case jumpmax - 7:
            var v1 = this._currentshowlist[1] + 1;
            var v2 = this._currentshowlist[2] + 1;
            this._currentshowlist.length = 0;
            v1 = v1 > 24 ? v1 - 24 : v1;
            v2 = v2 > 24 ? v2 - 24 : v2;
            this._currentshowlist[0] = v1;
            this._currentshowlist[1] = v2;
            return 100;
        case jumpmax - 8:
            var v1 = this._currentshowlist[1] + 1;
            var v2 = this._currentshowlist[2] + 1;
            var v3 = this._currentshowlist[3] + 1;
            this._currentshowlist.length = 0;
            v1 = v1 > 24 ? v1 - 24 : v1;
            v2 = v2 > 24 ? v2 - 24 : v2;
            v3 = v3 > 24 ? v3 - 24 : v3;
            this._currentshowlist[0] = v1;
            this._currentshowlist[1] = v2;
            this._currentshowlist[2] = v3;
            return 50;
        default:
            for (i = 0; i < len; i++) {
                this._currentshowlist[i]++;
                if (this._currentshowlist[i] > 24) {
                    this._currentshowlist[i] -= 24;
                }
            }
            return 30;
    }
}

wLaoHuJi.prototype.run = function() {
    var self = this._self,
        time = 500,
        inx = 0,
        shownum = 1,
        boxmax = this._config.runboxlength,
        runloopnum = 0,
        jumpmax = this._jumpnum,
        jumpindex = 0,
        timer = null;
    function timerdo() {
        //console.log(self._currentshowlist);
        time = self.changeshowlist(jumpindex);
        self.showbox(self._currentshowlist);
        jumpindex++;
        if (jumpindex >= jumpmax) {
            clearTimeout(timer);
            self._startbox = self._endbox; //本次的终点就是下次的起点;
            setTimeout(function() { self.result(); }, 200);
        }
        else {
            timer = setTimeout(timerdo, time);
        }
    }
    timerdo();
}
wLaoHuJi.prototype.run1 =function(){
    var self = this._self,
        time = 500,
        c=[];
    function timerdo() {
        c[0]=self._startbox;
        self.showbox(c);
        if(!self.returnData){
            self._startbox++;
            timer = setTimeout(timerdo, time);
        }else{
            clearTimeout(timer);
        }
    }
    timerdo();
}
wLaoHuJi.prototype.result = function() {
    var self = this._self;
    //var winbox = this._endbox;
    //var type = this._piecelisttype[winbox];
    //if (type == "cha" || type == "") {
    //    //未得奖，或别的奖，暂无
    //}
    //else {
    //    var betid = "lhj_bet_txt_" + type;
    //    var betnum = parseInt(this.$(betid).value);
    //    if (betnum > 0) {
    //
    //    }
    //}
    this.$('lhj_ben_txt_money').innerHTML = this._money;
    this._isfirstbet = true;
    this._isrun = false;
    self.$('lhj_ben_btn_start').setAttribute("class","lhj_bet_btn lhj_bet_btn1");
    this.$('lhj_ben_btn_start').disabled = false;
    //ajax_call(true,"index.php?m=Buyers&c=Games&a=WinBefor","POST","",function(msg){
    //    var data=JSON.parse(msg);
    //    if(parseInt(data.status)!=0){
    //        alert(data.message);
    //    }
    //});
}
wLaoHuJi.prototype.getCountScore = function(countScore) {
    var self = this._self;
    self._total=parseInt(countScore);
    self.init();
}
wLaoHuJi.prototype.init = function() {
    var i, j,self = this._self;
    this._mainDiv = this.$(this.frameid);
    if (!this._mainDiv) {
        alert(id+"不存在");
        return;
    }
//初始化piece
    for (i = 0; i < 7; i++) {
        for (j = 0; j < 7; j++) {
            if (i == 0 || j == 0 || i == 6 || j == 6) {
                var tpleft = j * (this._config.cardwidth + this._config.margin) + this._config.margin;
                var tptop = i * (this._config.cardheight + this._config.margin) + this._config.margin;
                var tpinfo = this._getpieceinfo(i, j);
                this._piecelistposition[tpinfo.list] = { left: tpleft, top: tptop };
                this._piecelistmulti[tpinfo.list] = this._multitype[tpinfo.multi];
                this._piecelisttype[tpinfo.list] = tpinfo.type;
            }
        }
    }
    var betmoeny = function(id,n) {
        if (self._isrun) {
            return;
        }
        //先将得分转过来;
        self._total +=self._money;
        self._money = 0;
        self.$('lhj_ben_txt_total').innerHTML = self._total;
        self.$('lhj_ben_txt_money').innerHTML = self._money;

        if (self._isfirstbet) {
            self.$('lhj_bet_txt_bar').value = 0;
            self.$('lhj_bet_txt_seven').value = 0;
            self.$('lhj_bet_txt_star').value = 0;
            self.$('lhj_bet_txt_watermelons').value = 0;
            self.$('lhj_bet_txt_alarm').value = 0;
            self.$('lhj_bet_txt_coconut').value = 0;
            self.$('lhj_bet_txt_orange').value = 0;
            self.$('lhj_bet_txt_apple').value = 0;
            self.scores={"1":0,"2":0,"3":0,"4":0,"5":0,"6":0,"7":0,"8":0};
            self._isfirstbet = false;
        }

        if (self._total > 0 && self.scores[n] < self._config.maxbet) {
            if(self.bsState==1){
                self._total--;
                self.scores[n] += 1;
            }
            else{
                if(self._total>=10&&self.scores[n]<=89){
                    self.scores[n] += + 10;
                    self._total-=10;
                }else if(self._total>=10&&self.scores[n]>89){
                    self._total-=(99-self.scores[n]);
                    self.scores[n] += (99-self.scores[n]);
                }else if(self._total<10){
                    if(99-self.scores[n]>=self._total){
                        self.scores[n] = self.scores[n] + self._total;
                        self._total-=self._total;
                    }else{
                        self._total-=(99-self.scores[n]);
                        self.scores[n] = self.scores[n] + (99-self.scores[n]);
                    }

                }
            }
            self.$(id).value = self.scores[n];
            self.$('lhj_ben_txt_total').innerHTML = self._total;
        }
    }

    this.$('lhj_bet_bar').onclick = function() {
        betmoeny('lhj_bet_txt_bar',8);
    }
    this.$('lhj_bet_seven').onclick = function() {
        betmoeny('lhj_bet_txt_seven',7);
    }
    this.$('lhj_bet_star').onclick = function() {
        betmoeny('lhj_bet_txt_star',6);
    }
    this.$('lhj_bet_watermelons').onclick = function() {
        betmoeny('lhj_bet_txt_watermelons',5);
    }
    this.$('lhj_bet_alarm').onclick = function() {
        betmoeny('lhj_bet_txt_alarm',4);
    }
    this.$('lhj_bet_coconut').onclick = function() {
        betmoeny('lhj_bet_txt_coconut',3);
    }
    this.$('lhj_bet_orange').onclick = function() {
        betmoeny('lhj_bet_txt_orange',2);
    }
    this.$('lhj_bet_apple').onclick = function() {
        betmoeny('lhj_bet_txt_apple',1);
    }
    this.$('smbs').onclick=function(){
        self.bsState=1;
        this.style.fontSize=".8rem";
        self.$('bigbs').style.fontSize="0.6rem";
    }
    this.$('bigbs').onclick=function(){
        self.bsState=10;
        this.style.fontSize=".8rem";
        self.$('smbs').style.fontSize="0.6rem";
    }
    this.$('lhj_ben_btn_start').onclick = function() {

        if (self._isrun) {
            return;
        }
        var betcount = parseInt(self.$('lhj_bet_txt_bar').value);
        betcount += parseInt(self.$('lhj_bet_txt_seven').value);
        betcount += parseInt(self.$('lhj_bet_txt_star').value);
        betcount += parseInt(self.$('lhj_bet_txt_watermelons').value);
        betcount += parseInt(self.$('lhj_bet_txt_alarm').value);
        betcount += parseInt(self.$('lhj_bet_txt_coconut').value);
        betcount += parseInt(self.$('lhj_bet_txt_orange').value);
        betcount += parseInt(self.$('lhj_bet_txt_apple').value);
        if (betcount == 0) {
            alert("尚未下注，请先下注！");
            return;
        }
        //先将得分转过来
        self._money = 0;
        self.$('lhj_ben_txt_total').innerHTML = self._total;
        self.$('lhj_ben_txt_money').innerHTML = self._money;
        //随机得到中奖结果
        //判断分还够不够下注
        if (self._isfirstbet) {
            if (self._total < betcount) {
                alert("您的总分不够下注，请获得积分！");
                return;
            }
            self._total -= betcount;
            self.$('lhj_ben_txt_total').innerHTML = self._total;
        }
        this.disabled = true;
        self._isrun = true;
        self.$('lhj_ben_btn_start').setAttribute("class","lhj_bet_btn lhj_bet_btn2");
        //self._endbox = self._getWinNum();
        //self.run1();
        ajax_call(true,"/lhj/api/","POST","s=gameStart&xiazhu="+JSON.stringify(self.scores),function(msg){
            var data = (new Function("return " + msg))();
            if(data.code==0){
                self._endbox = parseInt(data.data.weizhi);
                //算出运行步数
                var step = (self._endbox - self._startbox) > 0 ? self._endbox - self._startbox : 24 - self._startbox + self._endbox;
                self._jumpnum = 24 * 4 + step; //这些需要算出来;
                self.returnData=true;
                self._money=data.data.defen;
                self._total=data.data.zongFen;
                self.run();
            }
        });
    }

    //初始化默认总分
    this.$('lhj_ben_txt_total').innerHTML = this._total;
}

document.getElementById('validation').onclick = function() {
    var name = document.getElementById('name').value;
    var phone = document.getElementById('phone').value;

    ajax_call(true,"/lhj/api/","POST",'s=login&name='+name+'&phone='+phone,function(msg){
        var data = JSON.parse(msg);
        if(data.code == 0) {
            var g = new wLaoHuJi("game");
            g.getCountScore(data.data);
            document.getElementById('pop').style.display = 'none';
            alert(data.message);
        }else {
            alert(data.message);
        }
    });
}

window.onload = function() {
    if(!getCookie('id')){
        document.getElementById('pop').style.display = 'block';
    }else {
        ajax_call(true,"/lhj/api/","POST",'s=countScore&userid='+getCookie('id'),function(msg){
            var data = JSON.parse(msg);
            if(data.code == 0) {
                var g = new wLaoHuJi("game");
                g.getCountScore(data.data);
                document.getElementById('pop').style.display = 'none';
                alert(data.message);
            }else if(data.code == 1004) {
                alert(data.message);
                document.getElementById('pop').style.display = 'block';
            }else {
                alert(data.message);
            }
        });
    }
};

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

//排行榜;
document.getElementById("rank").onclick = function(){
    document.getElementById("rankPage").style.display = "block";
    ajax_call(true,"/lhj/api/","POST",'s=rank',function(msg){
        var data = JSON.parse(msg);
        if(data.code == 0) {
            var str = "";
            for(var i = 0 ; i < data.data.length ; i++){
                str += "<tr><td>"+(i+1)+"</td><td>"+data.data[i].name+"</td><td>"+data.data[i].score+"</td></tr>";
            }
            document.getElementById("rank-table").innerHTML = str;
        }else {
            alert(data.message);
        }
    });
};

document.getElementById("close-rank").onclick = function(){
    document.getElementById("rankPage").style.display = "none";
};

document.getElementById("rules").onclick = function(){
    document.getElementById("rulesPage").style.display = "block";
};

document.getElementById("close-rules").onclick = function(){
    document.getElementById("rulesPage").style.display = "none";
};
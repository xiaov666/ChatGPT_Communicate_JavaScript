//发送消息的函数
function sendMessage(message){
	var textareaElement = parent.frames['Header'].document.getElementsByTagName("textarea")[0]; 
	textareaElement.value=message;
	textareaElement.nextElementSibling.click();
}
//获得回答的文本内容
function getProseText(){
	var docp = parent.frames['Header'].document.getElementsByClassName("prose");
	return docp[docp.length-1].innerText;
}
//问题是否已经发送出去
function isSendType(){
	var docp = parent.frames['Header'].document.getElementsByClassName("prose");
	if(docp==null || docp.length==0)return false;
	return docp[docp.length-1].parentElement.nextElementSibling==null;
}
function isErrorPage(){
	return parent.frames['Header'].document.getElementsByClassName("rounded-full").length>0;
}

var ip_;//临时存储一个全局ip
var qun_;//临时存储一个群号，用作通讯，比如可以写qq群号和微信群号

//初始化函数
function init(qun,ip){
	ip_ = ip;
	qun_ = qun;
	var topText;
	var isOver = true;
	var isSend = false;
  //设定一个定时器进行逻辑监控
	setInterval(function(){
		if(isErrorPage())return;//如果页面出现错误就不进行处理，众所周知ChatGPT有时候问问题会出现红字报错
		if(isOver&& isSend){//如果状态是 已结束 并且 已发送
			//开始回答请稍后
			onStart(ip,qun);//触发 开始
		}
		if(isSend){//如果是正在发送的状态，那么就可以进行消息的传递
			isOver = false;
			var proseText = getProseText();//获得内容
			if(topText!=proseText){//内容和上次读取的不同时
				topText=proseText;
				onMessage(ip,qun,proseText);//触发 消息函数
			}
		}else if(!isOver){//如果没有发送 且 不是结束状态
			isOver = true;
			onOver(ip,qun);//那么就触发结束函数
		}
		
		//网络请求(获取问题，并把状态发过去)。正在回答时不用请求。
		if(isOver){
      //尝试读取一个问题
			httpGet("http://"+ip+"/problem_"+qun,function(data){
				if(data!=null && data!="not"){//如果存在问题则发送问题给ChatGPT
					console.log("获得问题准备发送:"+decodeURI(data));
					sendMessage(decodeURI(data));//发送问题
				}
			});
		}
    
		//更新状态
		isSend = isSendType();
	},1000);
	
	//页面错误刷新
	var time = 1;
	var href = window.location.href;
	if (time > 0) {
		setTimeout(reload, 1000 * time);
		function reload () {
			setTimeout(reload, 1000 * time);
			if(isErrorPage()){//页面错误就刷新，刷新后发送结束代码
				onOver(ip_,qun_);//结束
				isOver = true;
				isSend = false;
        
        //这段代码的意思是刷新页面(如果遇到错误就刷新，这点需要特别注意，你可以把遇到错误的情况写的更智能)
				/*var fram = '<frameset col="*"><frame src="'+ href  +'"  name="Header"/></frameset>';
				with(document) {
					write(fram);
					void(close());
				}*/
			}
		}
	}
	//第一次进入就要刷新(为了正确读取frame内的元素)
	//先刷新页面
	setTimeout(function(){
		刷新();
	},500);
}

//你可以方便的在控制台手动输入 刷新(); 以此来进行刷新页面但控制台的 js脚本 依然存在。
function 刷新(){
	var href = window.location.href;
	var fram = '<frameset col="*"><frame src="'+ href  +'"  name="Header"/></frameset>';
	with(document) {
		write(fram);
	}
}
//问题开始处理时
function onStart(ip,qunId){
	console.log("正在回答...");
	httpGet("http://"+ip+"/start_"+qunId,function(data){});
}
//获得消息时
function onMessage(ip,qunId,data){
	data = encodeURI(data);//进行编码
	httpGet("http://"+ip+"/message_"+qunId+"_"+data,function(ddata_){});
}
//问题回答完毕时
function onOver(ip,qunId){
	console.log("回答完毕！");
	httpGet("http://"+ip+"/over_"+qunId,function(data){});
}

//请求get封包以此和你的程序 进行通讯
function httpGet(url,callback){
	//第一步：建立所需的对象
	let httpRequest = new XMLHttpRequest();
	//第二步：打开连接  将请求参数写在url中
	httpRequest.open('GET', url, true);
	
	httpRequest.onreadystatechange = function () {
	  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
		var json = httpRequest.responseText; //获取到json字符串，还需解析
		callback(json);
	  }
	};
	//第三步：发送请求  将请求参数写在URL中
	httpRequest.send();
}

//初始化 并 启动脚本
init(180167558,"127.0.0.1:10789");//参数：群号,ip   注意群号只是一个附加数据不参与js计算

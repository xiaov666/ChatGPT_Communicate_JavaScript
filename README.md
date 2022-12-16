# ChatGPT_Communicate_JavaScript
在ChatGPT网页上使用JavaScript和你的程序进行交互

原理是：通过浏览器控制台进行get请求，目标ip是你的程序。所以你的程序需要提供一个http的get接口。

---------------------------------------------------

以下是你需要提供的接口模板：

//浏览器尝试向您的程序获取问题，如果没有问题请返回not

http://【ip】/problem_【qun】

//浏览器向您发送数据，表示浏览器已经开始回答问题

http://【ip】/start_【qunId】

//浏览器向您发送数据，表示浏览器已经把回答的问题发送给您。这里的data为url编码的回答数据。

http://【ip】/message_【qunId】_【data】

//浏览器向您发送数据，表示ChatGPT已经回答结束

http://【ip】/over_【qunId】

---------------------------------------------------

脚本里已提供了一个启动函数，直接使用即可。

//初始化 并 启动脚本

init(180167558,"127.0.0.1:10789");//参数：群号,ip   注意群号只是一个附加数据不参与js计算

这是我的QQ群欢迎进群体验ChatGPT：180167558

---------------------------------------------------

注意本项目只是提供一种ChatGPT通讯的解决方案。
请勿作为非法内容使用。

---------------------------------------------------

你的程序需要提供跨域响应头，因此需要加入：【Access-Control-Allow-Origin: *】

下面以java为例可以这样写：

private final String responseHead=
			"HTTP/1.1 200 OK\n" + 
			"Content-Type: text/html charset=utf-8\n"
			+ "Access-Control-Allow-Origin: *\n"
			+ "Server: cloudflare\n";

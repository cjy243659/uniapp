// 服务器域名
let  baseurl;
// 判断是开发环境还是生产环境
if(process.env.NODE_ENV == "development"){
	baseurl = "http://localhost:3000"
}else{
	baseurl = "https://api.aslegou.top";
}
export  default  {
	baseurl
}
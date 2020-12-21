// 封装网络请求
// 引入域名
import config from "./config.js"
// config.baseurl
const http = (options = {}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baseurl + options.url, //服务端地址
			method: options.method || "get",
			data: options.data || {},
			header: options.header || {
				"content-type": "application/json"
			},
			timeout: options.timeout || 60000,
			sslVerify: options.ssl || true, //在安卓不去检测是否维https了，
			success(res) {
				resolve(res)
			},
			fail(err) {
				reject(err)
			}
		})
	})
}
export default http;

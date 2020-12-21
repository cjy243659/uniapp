// 统一处理api接口请求操作

// 引入封装的网络请求 http.js
import http from './http.js'

// 请求一级分类
const _getFirstCate = () => {
	let options = {
		url: "/api/getcate",
		method: "get"
	}
	// 返回值为 调用http把url传递给http
	return http(options)
}

// 请求轮播图数据
const _getBanner = () => {
	let options = {
		url: "/api/getbanner",
		method: 'get'
	}
	return http(options)
}

// 请求商品信息
const _getGoods = () => {
	let options = {
		url: "/api/getindexgoods",
		method: 'get'
	}
	return http(options)
}

// 获取秒杀活动
const _getSeckill = () => {
	let options = {
		url: "/api/getseckill",
		method: "get"
	}
	return http(options)
}

// 获取一级分类下的所有商品--点击顶部导航跳转到product显示相应的东西
const _getFirstCateGood = (data = {}) => {
	let options = {
		url: "/api/getcategoodPage",
		method: "GET",
		data,
	}
	return  http(options)
}

// 获取商品详情
const _getGoodsDetail = (data={})=>{
	let options = {
		url:"/api/getgoodsinfo",
		method:"get",
		data
	}
	return http(options)
}

// 获取分类页面一级分类
const getFirstClassify=()=>{
	let option = {
		url:"/api/getcates",
		method:"get"
	}
	return http(option)
}

// 获取二级分类所有商品
const getSecGoods = (data={})=>{
	let options = {
		url:"/api/getcate2goodPage",
		method:"get",
		data
	}
	return http(options)
}

// 搜索  参数 搜索关键字 keywords
const search = (data={})=>{
	let options = {
		url:"/api/search",
		method:"get",
		data
	}
	return http(options)
}

// 获取验证码 参数：phone
const getCode =(data={})=>{
	let options = {
		url:"/api/sms",
		method:"get",
		data
	}
	return http(options)
}

// 登录 参数-手机号
const login = (data={})=>{
	let options = {
		url:"/api/wxlogin",
		method:"get",
		data
	}
	return http(options)
}

// 检查token authorization:header头中需要添加token后台验证条件
const  checkToken  =(header={})=>{
	let  options = {
		url:"/api/checktoken",
		header,
	}
	
	return  http(options)
}
 
// 添加购物车 uid goodsid num checked authorization
const addCart=(data={},header={})=>{
	let options = {
		url:"/api/cartadd",
		method:"get",
		data,
		header
	}
	return http(options)
}

// 获取购物车列表
const getCart = (data={},header={})=>{
	let options = {
		url:"/api/cartlist",
		method:"get",
		data,
		header
	}
	return http(options)
}

// 修改购物车
const editCart = (data={},header={})=>{
	let options = {
		url:"/api/cartedit",
		method:"get",
		data,
		header
	}
	return http(options)
}

// 删除商品
const delCart = (data={},header={})=>{
	let options = {
		url:"/api/cartdelete",
		method:"get",
		data,
		header
	}
	return http(options)
}

// 订单添加
const addConfirm = (data,header)=>{
	let options = {
		url:"/api/orderadd",
		method:"get",
		data,
		header
	}
	return http(options)
}

// 订单查询
const findConfirm =(data={},header={})=>{
	let options = {
		url:"/api/orders",
		method:"get",
		data,
		header
	}
	return http(options)
}
// 导出请求
export default {
	_getFirstCate,
	_getBanner,
	_getGoods,
	_getSeckill,
	_getFirstCateGood,
	_getGoodsDetail,
	getFirstClassify,
	getSecGoods,
	search,
	getCode,
	login,
	checkToken,
	addCart,
	getCart,
	editCart,
	delCart,
	addConfirm,
	findConfirm
}

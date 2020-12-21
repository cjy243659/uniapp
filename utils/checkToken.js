// 封装 检验是否登录
// 思路：从缓存中取出登录状态，查看是否有token，如果没有直接显示未登录，如果有，判断是否过期，过期重新登陆，未过期正常显示

const checkToken = async (_this) => {
	// 取出登录状态
	let token = uni.getStorageSync("status").token || null
	// console.log(token)
	// 判断是否存在
	if (token == null) {
		uni.showToast({
			title: "请先登录",
			icon: "none"
		})
		return false;
	}
	// token验证请求
	let res = await _this.$api.checkToken({
		authorization: token
	})
	// console.log(res)
	// console.log(res)
	if (res.data.code == 403 || res.data.code == 500) {
		//登录失效了
		uni.setTabBarItem({
			index: 2,
			text: "未登录"
		})
		uni.clearStorageSync(); //清空缓存信息
		return false;
	} else {
		// 登录有效
		uni.setTabBarItem({
			index: 2,
			text: "我的"
		})

		return  true;
	}
}

export default checkToken

<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" placeholder="输入手机号" v-model="phone" maxlength="12"/>
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="_getCode()">{{msg}}</text>
			</view>
			<input type="text" placeholder="- - - -"  v-model="code" maxlength="4" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<!--   -->
			<button  type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;" @click="toLogin">登录</button>
		</view>
		<view class="row">
			<!-- <text style="color: #006699;text-align: center;" >通过微信授权登录</text> -->
		</view>
	</view>
</template>

<script>
	
	let app = getApp()
	
	export default {
		data() {
			return {
				msg:"获取手机验证码",
				phone:"",//用户手机号
				isSend:false,//点击状态,默认没有点击
				code:null,//默认验证码为空
			}
			
		},
		methods: {
			// 获取验证码
			async _getCode(){
				// 如果点击过了，就不要再重复点击了
				if(this.isSend){
					// 点击过了,什么都不做
					return
				}
				// 如果没有点过，改变状态，走下面代码
				this.isSend=true
				// 拿到用户输入的手机号
				let phone = this.phone
				// 判断当前手机号是否符合正则
				let reg = /^(13[0-9]|14[01456879]|15[0-3,5-9]|16[2567]|17[0-8]|18[0-9]|19[0-3,5-9])\d{8}$/
				if(!reg.test(phone)){
					 uni.showToast({
					 	title:"请输入正确的手机号",
						icon:"none"
					 })
				}
				let resCode = await this.$api.getCode({phone})
				// 如果发送成功
				if(resCode.data.code==200){
					// 加定时器
					let num = 60;
					// 将获取到的验证码存入缓存
					uni.setStorageSync("code",resCode.data.list.code)
					let timer = setInterval(()=>{
						num--;
						this.msg = num+"秒后重新获取"
						this.tel = phone;// 临时存储获取手机号验证码的手机号
						// 60秒时候验证码过期，重新获取验证码
						if(num<1){
							// 清除定时器，内容变为原来的
							this.msg="获取手机验证码"
							clearInterval(this.timer)
							// 倒计时结束后，还能重新获取验证码，要把点击状态变为flase
							this.isSend=false
							// 删除验证码缓存
							uni.removeStorageSync("code")
						}
					},1000)
				}else{
					uni.showToast({
						title:"请求错误",
						icon:"none"
					})
				}
				console.log(resCode)
			},
			
			// 执行登录
			async toLogin(){
				// 获取手机号 
				let phone = this.phone
				// 从缓存中取出验证码
				let oCode = uni.getStorageSync("code") || null
				// 判断验证码是否正确
				if(this.code != oCode || this.code == null){
					uni.showToast({
						title:"验证码不正确",
						icon:"none"
					})
				}
				// 判断手机号是否正确
				if(this.phone!= this.tel){
					uni.showToast({
						title:"手机号不正确",
						icon:"none"
					})
					return 
				}
				
				// 执行登陆
				let resLogin = await this.$api.login({phone})
				// console.log(resLogin)
				if(resLogin.data.code===200){
					// 把登录状态存入缓存 uid phone token
					uni.setStorageSync("status",resLogin.data.list);
					// 提示
					uni.showToast({
						title:"登陆成功",
						icon:"none"
					})
					// // 跳转页面
					setTimeout(()=>{
						uni.navigateBack({
							delta:1
						})
					},1000)

				}
			}
				
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	.box{
		position: relative;
	}

	.row{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}
	.send{
		display: flex;
		justify-content: space-between;
	}
	.send text:nth-of-type(2){
		color: #00BB00;
	}
	text{
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}
	input{
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
	
</style>

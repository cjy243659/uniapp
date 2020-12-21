]<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" @click="toSearch"/>
		</view>
		<view class="list" v-if="goods.length>0">
			<!-- row 循环体 -->
			<view v-for="(item,index) in goods" :key="item.id" class="row">
				<view class="products">
					<view class="imagebox" v-for="(val,ind) in item.child" :key="ind">
						<image :src="val.img" mode="widthFix"></image>
						<text class="title">{{val.goodsname}}</text>
					</view>
				</view>
				<view class="info">
					<text  space="nbsp">总计{{item.countnumber}}商品  </text>  
					<text>应付金额 ￥:{{item.countmoney}}</text>
				</view>
			</view>
		</view>
		<view class="tishi" v-else>
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import config from '../../utils/config.js'
	export default {
		data() {
			return {
				goods:[],//订单列表
			}
		},
		onLoad(options){
			
		},
		onShow(){
			this._findConfirm()
		},
		methods: {
			// 查询订单
			async _findConfirm(){
				// 条件 uid 请求头中携带token验证字段
				let {uid,token} = uni.getStorageSync("status")
				let data = {uid}
				let header ={authorization:token}
				// 发送请求
				let res = await this.$api.findConfirm(data,header)
				// console.log(res)
				// 处理图片
				res.data.list.map((item,index)=>{
					item.child.map((item,index)=>{
						item.img = config.baseurl+item.img
					})
				})
				// console.log(res.data.list)
				this.goods=res.data.list
				// console.log(this.goods)
			},
			
			// 搜索
			toSearch(){
				uni.navigateTo({
					url:"../search/search"
				})
			}
		},
		
	}
</script>

<style>
.search{
		margin: 50rpx;
		height: 80rpx;
		background-color: #f26b11;
		border-radius: 80rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	icon{
		margin:0 10rpx 0 250rpx;
	}
	.placeholder{
		color: white;
		font-size: 25rpx;
	}
	.row{
		margin: 10rpx 20rpx;
		/* height: 240rpx; */
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
	}
	
	.imagebox{
		/* float: left; */
		margin:10rpx;
		display: flex;
	}
	.imagebox .title{
		margin-top: 30rpx;
	}
	.products{
		overflow: hidden;
	}
	image{
		width: 160rpx;
		margin-left: 10rpx;
	}
	.info{
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
		/* width: 340rpx; */
		padding: 20rpx;
		text-align: right;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.tishi{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>

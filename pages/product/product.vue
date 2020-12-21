<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" @click="_search"/>
		</view>
		<view class="list" v-if="goods.length>0">
			<view class="row" v-for="(item,index) in goods" :key="index" @click="toDetail(item.id)">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>￥{{item.price}}</text>	
					<text>3565评论</text>	
				</view>
			</view>
		</view>
		<view class="tishi" v-else>
			暂时没有商品哦~
		</view>
	</view>
</template>

<script>
	
// 引入域名
import config  from '../../utils/config'
export default {
	data(){
		return {
			goods:[],//一级分类下的商品列表
			page:1,//页数
			size:4,//一页显示几个
		}
	},
	
	onShow(){
		// 判断tag，请求数据
		this._isTag()
	},
	onLoad(options){
		// console.log(options)
		// 存起来
		this.$data.fid = options.fid
	},
	
	// 发生触底事件就展示下一页
	onReachBottom(){
		let  data = {
			fid:this.$data.fid,
			page:this.page,
			size:this.size
		}
		this.page++;
		// 下一页的页数大于总页数就直接返回
		if(this.page>this.totalPages){
			uni.showToast({
				title:"没有更多了",
				icon:"none"
			})
			return
		}
		// 根据tag请求数据
		this._isTag()
	},
	

	methods:{
		// 获取商品列表
		async _getCateGoods(require){
			// 请求带分页的一级分类所有商品
			// let resGoods = await this.$api._getFirstCateGood(data)
			// 发送请求
			let resGoods = await require
			// console.log(resGoods)
			// 定义总页数和数据
			this.totalPages = resGoods.data.list[0]
			let product = resGoods.data.list[1]
			// map是遍历数组的，保证数据格式是个数组
			if(product == null) {
				this.product = [];
					return;
			}
			// 处理图片
			product.map((item,index)=>{
				item.img = config.baseurl + item.img
			})
			//原来的数据和新请求到的数据拼接，放到图片处理的后面
			product =  product.concat(product)
			this.goods=product
		},
		
		// 判断标识
		_isTag(){
			// 把tag从缓存中取出来
			let tag = uni.getStorageSync("tag")
			// console.log(tag)
			
			// 条件
			let  data = {
				fid:this.$data.fid,
				page:this.page,
				size:this.size
			}
			switch(tag){
				case "first":
					this._getCateGoods(this.$api._getFirstCateGood(data))
				break;
				case "second":
					this._getCateGoods(this.$api.getSecGoods(data))
				break;
			}
		},
		
		
		// 跳转到详情
		toDetail(id){
			uni.navigateTo({
				url:"../details/details?id="+id
			})
		},
		
		// 点击搜索，跳转到搜索页面
		_search(){
			uni.navigateTo({
				url:"../search/search"
			})
		}
	}
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
		position: relative;
		margin: 10rpx 20rpx;
		height: 330rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}
	image{
		position: absolute;
		top: 0;
		left:10rpx;
		width: 160rpx;
	}
	.info{
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
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

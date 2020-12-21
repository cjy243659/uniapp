<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="detail.img">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{detail.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥ {{detail.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>			
		</view>
		
		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
				  <label class="jian" @click="sub">-</label>
				  <label class="zhi">{{num}}</label>
				  <label class="jia" @click="add">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{detail.specsname}}</label>
					<view class="threed3i1" v-for="(item,index)  in detail.specsattr" :key="index">{{ item }}</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		 <view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<!-- <image src="@/static/detail/2.jpg" @load="autoImage" :style="{width:autoWidth+'px',height:autoHeight+'px'}" /> -->
			<rich-text :nodes="detail.description"></rich-text>
		</view>
		
		<view class="productEval">
			<view class="eval">商品评价</view>
			<view >
				<label class="evalUsername">小李白</label>
				<label class="evalUsertitle">交易很好，物流很快</label>					
				<view class="evalImage">
					<image src="@/static/detail/pingjia1.jpg">
					<image src="@/static/detail/pingjia2.jpg">
					<image src="@/static/detail/pingjia3.jpg">
				</view>
				<label class="evalTime">2020-02-12</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="addCart">加入购物车</button>
			<button class="footbtn2">立即购买</button>
		</view>
	</view>
</template>

<script>
	// 导入图片自适应工具类
	let actionimage = require('../../utils/ActionImage.js');
	import config from '../../utils/config.js'
	export default {
		data() {
			return {
				autoHeight:'',
				autoWidth:'',
				detail:[],//商品详情
				num:1,//初始化商品购买数量
			}
		},
		onShow(){
			this._getdetail()
		},
		
		onLoad(option) {
			// console.log(option)
			this.$data.id = option.id
		},
		methods: {
			//处理图片自适应方法
			autoImage(e){
				// 调用图片自适应工具类方法，进行处理图片
				let auto  = actionimage.default(e)
				this.autoHeight = auto.autoHeight;
				this.autoWidth = auto.autoWidth;
			},
			// 获取商品详情
			async _getdetail(){
				let resDetail = await this.$api._getGoodsDetail({id:this.$data.id})
				// console.log(resDetail)
				resDetail.data.list[0].img = config.baseurl + resDetail.data.list[0].img
				resDetail.data.list[0].specsattr = resDetail.data.list[0].specsattr.split(",")
				this.detail= resDetail.data.list[0]
				// console.log(this.detail)
			},
			
			// 处理加减商品
			add(){
				this.$data.num++;
				if(this.$data.num >= this.detail.number){
					this.$data.num = this.detail.number
				}
			},
			
			sub(){
			    this.$data.num--
			    if(this.$data.num <=1)this.num =1;
			},
			/*
				uid用户编号，必填项
				goodsid商品编号，必填项
				num数量，必填项
				checked是否选中，必填项 ，默认1 选中  0 不选中
				authorization   header头中需要添加token后台验证条件		
			*/	
			// 添加购物车
			async addCart(){
				// 条件
				let header = {
					authorization:uni.getStorageSync("status").token
				}
				let data = {
					uid:uni.getStorageSync("status").uid,
					num:this.$data.num,
					checked:1,
					goodsid:this.$data.id
				}
				// 发送请求
				let resAdd = await this.$api.addCart(data,header)
				// console.log(resAdd)
				if(resAdd.data.code===403){
					uni.showToast({
						title:"登录已过期，重新登录一下吧",
						icon:"none"
					})
				}
				else{
					if(resAdd.data.list[0]){
						//加入成功
						uni.showToast({
							title:"添加成功",
							icon:"none"
						})
					} else{
						uni.showToast({
							title:"请检查网络",
							icon:"none"
						})
					}
				}
			}
		}
	}
</script>

<style>
	@import url("../../common/css/details.css");
</style>

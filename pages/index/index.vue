<template>
	<view class="">
		<!-- 顶部信息 -->
		<view class="HomeTop">
			<view class="logoView">
				<!-- logo 变为相对路径，发行后才可以显示出来 -->
				<img src="../../static/index/logo.jpg" alt=""  class="logo"/>
			</view>
			<view class="inputView">
				<input class="textinput" style="text-align: center;" type="text" value="" placeholder="寻找商品" @click="toSearch"/>
			</view>
		</view>

		<!-- 顶部导航  scroll-view -->
		<view class="tabs">
			<scroll-view id="tab-bar" class="scroll-h" scroll-x="{true}">
				<!-- 循环遍历navData -->
				<view class="uni-tab-item" v-for="(item,index) in navData" :key="index">
					<!-- uni-tab-item-title-active uni-tab-item-title-->
					<text :class="activeIndex==index?'uni-tab-item-title-active  uni-tab-item-title':'uni-tab-item-title'"
						@click="toList(index,item.id)"
					>{{item.catename}}</text>
				</view>
			</scroll-view>
		</view>
		
		<!-- 推荐轮播图 -->
		<view class="banner-container">
			<swiper :indicator-dots="true" :autoplay="true" :interval="2000" :duration="1000">
				<!-- 循环banner -->
				<swiper-item v-for="(item,index) in banner" :key="item.img">
					<view class="swiper-item">
						<image :src="item.img"></image>
					</view>
				</swiper-item>

			</swiper>
		</view>

		<!-- 功能导航开始 -->
		<!-- 功能导航 -->
		<view class="FunctNavCon">
			<view class="FunctNavLi">
				<image src="@/static/index/xiaohuoban.png" alt class="FunImg" />
				<p>限时抢购</p>
			</view>
			<view class="FunctNavLi">
				<image src="@/static/index/jifentixicopy.png" alt class="FunImg" />
				<p>积分商城</p>
			</view>
			<view class="FunctNavLi">
				<image src="@/static/index/lianxiwomen.png" alt class="FunImg" />
				<p>联系我们</p>
			</view>
			<view class="FunctNavLi"  @click="_toClassifyPage">
				<image src="@/static/index/-shangpinfenlei-gai.png" alt class="FunImg" />
				<p>商品分类</p>
			</view>
		</view>

		<!-- 推荐部分 未写 -->
		<view class="HotGoods">
			<!-- 热推左侧 -->
			<view class="HotLeft">
				<view class="LimitedContent">
					<image class="LimitedImg" src="@/static/index/xianshi.jpg" alt />
					<label class="Limited">限时秒杀</label>
				</view>
				<p class="LimitedTitle">每天零点场，好货秒不停</p>
				<!-- 倒计时 -->
				<view class="LimitTimeAll">
					<!-- 绑定倒计时 -->
					<label class="LimitTime">{{activeTime.h}}</label>
					<view class="maohao">:</view>
					<label class="LimitTime">{{activeTime.m}}</label>
					<view class="maohao">:</view>
					<label class="LimitTime">{{activeTime.s}}</label>
					<label class="Seckill">秒杀</label>
				</view>
				<block v-if="seckill.length>0">
					<image :src="seckill[0].img" class="LimitedgoodsImg" alt="">
				</block>
				
			</view>

			<!-- 热推右侧 -->
			<view class="HotRight">
				<!-- 右侧顶部部分 -->
				<view class="HotTop">
					<view class="HomeTopInfo">
						<view class="HomeTopInfoOne">
							<label class="BrandNew">品牌上新</label>
							<label class="Discount">折</label>
						</view>
						<view class="HomeTopRobbig">
							<label>每日九点，抢大牌</label>
						</view>
					</view>
					<!-- <div> -->
					<view class="Cloth">
						<image src="@/static/index/goods1.jpg" alt="">
					</view>

					<!-- </div> -->
				</view>
				<!-- 右侧底部 -->
				<view class="HotBottom">
					<view class="HotBottomLeft">
						<view class="HotBottomLeftInfo">
							<label class="HotBottomLeftInfoTitle">每日十件</label>
							<label class="HotBottomLeftInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomLeftImage">
							<image src="@/static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
					<view class="HotBottomRight">
						<view class="HotBottomRightInfo">
							<label class="HotBottomRightInfoTitle">每日十件</label>
							<label class="HotBottomRightInfoDetail">只为你选好货</label>
						</view>
						<view class="HotBottomRightImage">
							<image src="@/static/index/goods1.jpg" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 轮播图2 -->
		<div class="Swiper2">
			<image class="Swiper2Img" src="@/static/index/swiper.jpg" alt />
		</div>

		<!-- 底部商品列表 -->
		<view class="products">
			<!-- 商品标签 -->
			<view class="tags">
				<!-- tag_list active_tag_list -->
				<view :class="active==0?'tag_list active_tag_list':'tag_list'" @click="changeActive(0)">
					<label for="">热门推荐</label>
				</view>
				<view :class="active==1?'tag_list active_tag_list':'tag_list'" @click="changeActive(1)">
					<label for="">最新好货</label>
				</view>
				<view :class="active==2?'tag_list active_tag_list':'tag_list'" @click="changeActive(2)">
					<label for="">所有商品</label>
				</view>
			</view>
			<!-- 标签对应的商品 -->
			<view class="tags_product">
				<!-- 循环goods -->
				<!--循环报错： TypeError: Cannot read property 'content' of undefined
					Vue出现该错误的原因很可能是因为请求服务器获取数据是异步的，
					请求回来的时候已经开始渲染页面，若此时定义的数据为空也就是没有该数据的属性，则其中的属性值为undefined。
					加一个判断条件：如果请求的数据长度小于0就不先不要渲染
				 -->
				<block v-if="goods.length>0">
					<view class="product" v-for="(item,index) in goods[active].content" :key="index" @click="toDetail(item.id)">
						<!-- 图片 -->
						<view class="GoodsLeft">
							<image class="GoodsImg" :src="item.img" alt />
						</view>
						<!-- 商品信息 -->
						<view class="GoodsCont">
							<view class="GoodConTit">{{item.goodsname}}</view>
							<view class="GoodsPrice">￥{{item.price}}</view>
							<view class="yimai">已售50件</view>
							<view class="Immed">立即抢购</view>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入域名
	import config from '../../utils/config'
	export default {
		data() {
			return {
				navData:[],//一级分类导航数据
				activeIndex:0,//一级分类动态样式下标
				banner:[],//轮播图数据\
				goods:[],//商品列表数据
				active:0,//底部导航动态样式下标
				seckill:[],//秒杀数据
				activeTime:{},//倒计时
			}
		},
		onLoad() {
			
		},
		onShow(){
			// 顶部导航
			this._getCate(),
			// 轮播图
			this._getBanner(),
			// 商品列表信息
			this._getGoods(),
			// 秒杀活动
			this._getSeckill()
		},
		
		onHide(){
			// 离开index页面的时候清楚定时器
			clearInterval(this.timer)
		},
		methods: {
			// 请求导航（一级分类）
			async _getCate(){
				let res = await this.$api._getFirstCate()
				// 给一级分类添加唯一标识
				res.data.list.map((item,index)=>{
					item['tag']="first"
					// 把tag存入缓存
					uni.setStorageSync("tag",item.tag)
				})
				this.$data.navData=res.data.list
				// console.log(this.$data.navData)
			},

			// 请求轮播图
			async _getBanner(){
				let resBanner  = await this.$api._getBanner()
			
				// 处理图片 在开发环境下需要域名
				resBanner.data.list.map((item,index)=>{
					item.img = config.baseurl+item.img
				})
				// console.log(resBanner.data.list)
				this.$data.banner=resBanner.data.list
			},
			
			// 请求商品列表
			async _getGoods(){
				let resGoods = await this.$api._getGoods()
				// 处理图片
				resGoods.data.list.map((item,index)=>{
					item.content.map((val,ind)=>{
						val.img = config.baseurl + val.img
					})
				})
				// console.log(res)
				this.$data.goods = resGoods.data.list;
				// console.log(this.$data.goods)
			},
			
			// 点击商品，跳转到详情
			toDetail(id){
				uni.navigateTo({
					url:"../details/details?id="+id
				})
			},
			// 底部商品导航选项卡
			changeActive(index){
				this.$data.active = index
			},
			
			// 获取秒杀
			async _getSeckill(){
				let resSeckill = await this.$api._getSeckill()
				resSeckill.data.list = resSeckill.data.list || []
				// 处理图片
				resSeckill.data.list.map((item,index)=>{
					resSeckill.data.list[index].img = config.baseurl + resSeckill.data.list[index].img
				})
				// console.log(resSeckill.data.list)
				this.seckill= resSeckill.data.list
				// 调用倒计时函数
				this.actionTime(resSeckill.data.list[0].endtime)
			},
			
			// 处理倒计时
			actionTime(endtime){
				let timer = setInterval(()=>{
					let etime = Math.ceil((endtime-new Date().getTime())/1000) //时间戳变为秒
					//转换时分秒
					let  h = parseInt(( etime %  86400) / 3600);
					let  m = parseInt((etime % 3600) / 60);
					let  s = etime % 60;
					
					h = h < 10 ? "0"+h : h;
					m < 10 ? "0"+m : m;
					s = s <10  ? "0"+s : s;
					// console.log({h,m,s})
					this.activeTime = {h,m,s}
				})
			},
			
			// 点击顶部导航，跳转到商品列表页
			toList(index,fid){
				// 改变导航index
				this.activeIndex = index
				uni.navigateTo({
					url:"../product/product?fid="+fid
				})
			},
			
			// 点击商品分类跳转到分类页面
			_toClassifyPage(){
				uni.navigateTo({
					url:"../classify/classify"
				})
			},
			
			// 点击搜索，跳转到搜索页面
			toSearch(){
				uni.navigateTo({
					url:"../search/search"
				})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/index.css");
</style>

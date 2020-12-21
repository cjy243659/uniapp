<template>
	<view class="container">
		<!-- left左侧列表 -->
		<view class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" v-for="(item,index) in  cate" :key="index" 
				:class="activeIndex===index?'left_list activeList':'left_list'"
				 @click="_changeCate(index)">
				<label for="">{{ item.catename }}</label>
			</view>
			
		</view>
		<!-- right右侧详细分类商品 -->
		<view class="right">
			<!-- 每一个小类 -->
			<view class="right_list"  v-if="cate.length>0">
				<!-- 商品 -->
				<view class="bottom" v-if="cate[activeIndex].children.length>0">
					<block v-if="cate.length>0">
						<view class="bottom_list" v-for="(item,index) in  cate[activeIndex].children"
						:key="index" @click="_toClissify(item.id)">
							<view>
								<image :src="item.img" alt="">
								<span>{{ item.catename }}</span>
							</view>
						</view>
					</block>
				</view>
				<view class="tishi" v-else>
						暂无分类
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import config  from '../../utils/config.js'
	export default {
		data() {
			return {
				cate:[],//左边一级分类商品
				activeIndex:0,//一级分类动态样式下标
				page:1,
				size:4
			}
		},
		onShow(){
			// 获取一级分类二级分类
			this._getCates()
		},
		methods: {
			// 获取一级分类二级分类标题
			async _getCates(){
				let resCates = await this.$api.getFirstClassify()
				// 处理图片
				resCates.data.list.map((item,index)=>{
					item.children = item.children || []
					item.children.map((item,index)=>{
						item.img = config.baseurl + item.img
						// 给二级分类加一个标识
						item["tag"]="second"
						// 将标识存入缓存
						uni.setStorageSync("tag",item.tag)
					})
				})
				// console.log(resCates.data.list)
				this.$data.cate = resCates.data.list
			},
			
			// 点击一级分类，显示对应的二级分类
			_changeCate(index){
				this.$data.activeIndex=index
			},
			
			// 跳转到二级分类
			async _toClissify(id){
				// 跳转到商品页
				uni.navigateTo({
					url:"../product/product?fid="+id
				})
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");

	/* 点击左侧导航，显示动态样式 */
	.activeList {
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}

	.bottom {
		text-align: center;
		display: flex;
		flex-direction: row;
	}
	.tishi{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>

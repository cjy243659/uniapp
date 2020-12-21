<template>
	<view class="container">
		<!-- 登录的时候显示 -->
		<block v-if="isLogin">
			<view class="notGoods" v-if="cartList.length <= 0">空空如也</view>
			<view class="top" v-else>
				<scroll-view class="scroll-view_H" scroll-x="true" v-for="(item, index) in cartList" :key="item.id">
					<view class="cartInfo">
						<view class="cartInfochild">
							<!-- 选择框 -->
							<view class="cartInfo_switch common">
								<!-- 点击当前商品 -->
								<!-- 动态绑定每一个商品的状态 -->
								<switch type="checkbox" :checked="item.checked == 1 ? true : false" @change="oneChecked($event, index)" />
							</view>
							<!-- 图片 -->
							<view class="cartInfo_image common"><image :src="item.img" mode=""></image></view>

							<!-- 信息 -->
							<view class="cartInfo_info">
								<label for="" style="font-size: 26rpx;">{{ item.goodsname }}</label>
								<label for="" style="font-size: 24rpx; color: #ccc;">规格：白色</label>
								<label for="" style="color: red;">￥{{ item.price }}</label>
							</view>
							<!-- 加减数量 -->
							<view class="cartInfo_num">
								<view class="cartInfo_num_child">
									<label for="" @click="sub(index)">-</label>
									<label for="">{{ item.num }}</label>
									<label for="" @click="add(index)">+</label>
								</view>
							</view>
						</view>
					</view>
					<view class="cartDel"><label for="" @click="delList(index)">删除</label></view>
				</scroll-view>
			</view>
			<!-- 底部 -->
			<view class="foot">
				<view class="footd1">
					<switch type="checkbox" @change="allChecked" :checked="_allChecked" />
					<label>全选</label>
				</view>
				<view class="footd2">
					<view class="footd2sp1">
						总计：
						<label style="color: red;">{{ _totalPrice }}</label>
					</view>
					<label class="footd2sp2">不含运费，已优惠￥0.00</label>
				</view>
				<!-- 跳到提交订单，结算页面 -->
				<view class="footd3" @click="toConfirm">
					<!-- 被选中的商品的个数 -->
					<label>去结算({{ _totalNum }}件)</label>
				</view>
			</view>
		</block>

		<!-- 没有登录显示 -->
		<block v-else>
			<view class="">
				<view class="nologin">登录后即可同步信息</view>
				<text class="goLogin" @click="goLogin">去登录</text>
			</view>
		</block>
	</view>
</template>

<script>
import config from '../../utils/config.js';
export default {
	data() {
		return {
			isLogin: false, //登录状态
			cartList: [] //购物车列表
		};
	},
	methods: {
		// 获取购物车列表
		async getCartList() {
			// 条件 用户uid 请求头中携带token
			let data = {
				uid: uni.getStorageSync('status').uid
			};
			let header = {
				authorization: uni.getStorageSync('status').token
			};
			// 发送请求
			let resList = await this.$api.getCart(data, header);
			resList.data.list = resList.data.list || [];
			// 处理图片
			resList.data.list.map((item, index) => {
				item.img = config.baseurl + item.img;
			});
			// console.log(resList);
			// 渲染页面
			this.cartList = resList.data.list;
		},

		//点击去登陆，跳转到登录页
		goLogin() {
			uni.navigateTo({
				url: '../login/login'
			});
		},

		// 处理加减商品
		add(index) {
			this.cartList[index].num++;
			// 更新数据库
			this.updateCart(index);
		},

		sub(index) {
			this.cartList[index].num--;
			if (this.cartList[index].num <= 1) this.cartList[index].num = 1;
			// 更新数据库
			this.updateCart(index);
		},

		// 修改购物车
		async updateCart(index) {
			// 条件id num checked authorization
			// 购物车不止一条数据，所以要取出每一条数据的id，num，checked
			// 用index作为标识
			let { id, num, checked } = this.cartList[index];
			let data = { id, num, checked };
			let header = {
				authorization: uni.getStorageSync('status').token
			};
			// console.log(data)
			// 发送请求
			let resUpdate = await this.$api.editCart(data, header);
			// console.log(resUpdate)
			// 如果登陆过期就不能添加
			if (resUpdate.data.code == 403) {
				// token失效（未登录）
				uni.showToast({
					title: '登录过期，请重新登录',
					icon: 'none'
				});
			}
		},

		// 全选状态
		allChecked(e) {
			// console.log(e)
			let val = e.detail.value ? 1 : 0; //要更改的状态
			// 让cartList中所有的checked都跟随全选按钮的状态变化
			this.cartList.map((item, index) => {
				item.checked = val;
				// 更新数据库
				this.updateCart(index);
			});
			// console.log(this.cartList);
		},

		// 一个没有选中就不全选
		oneChecked(e, index) {
			this.cartList[index].checked = e.detail.value ? 1 : 0;
			this.updateCart(index);
		},

		// 删除
		async delList(index) {
			// 条件 商品id 请求头中携带token验证条件 authorization
			let { id } = this.cartList[index];
			let data = { id };
			let header = {
				authorization: uni.getStorageSync('status').token
			};
			console.log({data,header})
			// 发送请求
			let resDel = await this.$api.delCart(data, header);
			// console.log(resDel);
			if (resDel.data.code === 403) {
				uni.showToast({
					title: '登录过期，请重新登录',
					icon: 'none'
				});
			}
			/*
				这里注意：要先更新数据库，再更新页面，
					因为更新数据库需要index，而更新页面是把index对应的数据从获取到的cartList中删除了，
					再去更新列表的时候就找不到当前index了
			*/
			// 更新数据库
			this.updateCart(index);
			// 更新页面
			this.cartList.splice(index,1)
		},

		//点击去结算，跳转到订单页面
		toConfirm() {
			// 要判断是那个钱购物车是否有被选中的商品
			let res = this.cartList.findIndex((item, index) => {
				return item.checked == 1;
			});
			// 判断
			if (res == -1) {
				uni.showToast({
					title: '还没有选择商品',
					icon: 'none'
				});
			} else {
				uni.navigateTo({
					url: '../confirm/confirm'
				});
			}
		},
		
		
	},
	// 页面一显示就判断是否登录
	async onShow() {
		// 检测是否登录
		let res = await this.$_checkToken(this);
		// 赋值登录状态，
		this.isLogin = res;
		if (res) {
			this.getCartList();
		}
	},

	computed: {
		// 全选按钮状态
		_allChecked() {
			// 如果当前购物车列表没有东西，就不全选
			if (this.cartList.length <= 0) {
				// 直接return false
				return false;
			} 
			// 有东西，就去查找是否有没有选中的
			else {
				let ind = this.cartList.findIndex(item => {
					return item.checked == 0;
				});
				if (ind == -1) {
					//没有0
					return true;
				} else {
					//有0
					return false;
				}
			}
		},

		// 总价
		_totalPrice() {
			let totalPrice = 0; //初始化总价
			// 遍历列表集合，先判断是否被选中
			this.cartList.map((item, index) => {
				if (item.checked) {
					// 计算总价 ：总价=单价*数量 每一个商品累加
					totalPrice += parseFloat(item.price) * parseFloat(item.num);
				}
			});
			return totalPrice;
		},

		// 总数
		_totalNum() {
			let totalNum = 0; //初始化数量
			// 判断当前商品是否被选中
			this.cartList.map((item, index) => {
				if (item.checked) {
					totalNum += parseInt(item.num);
				}
			});
			return totalNum;
		}
	}
};
</script>

<style>
@import url('../../common/css/cart.css');

.cartInfo_image_img {
	width: 120rpx;
	height: 120rpx;
}
.foot {
	bottom: var(--window-bottom);
}
</style>

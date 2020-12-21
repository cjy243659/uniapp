<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.name }}</label>
				<label for="">{{ information.phone }}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{ information.address }}</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">
			<!-- cartsInfo 循环体 -->
			<view class="cartsInfo"  v-for="(item,index) in cartList" :key="index">
				<!-- 70px -->
				<view class="carts_detail">
					<view class="carts_image">
						<image :src="item.img" mode=""></image>
					</view>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:白色</view>
					</view>
					<view class="carts_price">
						<label for="">￥{{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="sub(index)">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="add(index)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥420</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{_totalPrice}}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="toConfirm">提交订单</button>
		</view>
	</view>
</template>

<script>
	import config from '../../utils/config.js'
	export default {
		data() {
			return {
				information: {
					name: 'YouSu',
					phone: '15811112222',
					address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层'
				},
				
				cartList:[],//存放购物车信息
			}
		},
		onLoad(){
			this.getCart()
		},
		methods: {
			// 获取购物车信息
			async getCart(){
				// 条件 用户uid 请求头中携带token authorization
				let {uid,token} = uni.getStorageSync("status")
				let data = {uid}
				let header = {authorization:token}
				// 发送请求
				let resCart = await this.$api.getCart(data,header)
				resCart.data.list = resCart.data.list ||[]
				//过滤商品状态，只留下被选中的
				this.cartList = resCart.data.list.filter((item,index)=>{
					return item.checked==1
				})
				// 处理图片
				this.cartList.map((item,index)=>{
					item.img = config.baseurl+item.img
				})
				// console.log(this.cartList)
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
			
			// 商品数量处理--加减
			add(index){
				this.cartList[index].num++;
				this.updateCart(index)
			},
			
			sub(index){
				this.cartList[index].num--;
				if(this.cartList[index].num<=1)this.cartList[index].num=1;
				this.updateCart(index)
			},
			
			// 添加订单
			async toConfirm(){
				// 处理条件
				// 用户uid和请求头携带token验证字段
				let {uid,token} = uni.getStorageSync("status")
				// 用户名，手机号，地址
				let {username,userphone,address} = this.$data.information
				// 订单总价，订单数量，订单时间，购物车数据id字符串(订单中商品id的集合)
				let countmoney = this._totalPrice
				let countnumber = this._totalNum
				let addtime = new Date().getTime()
				let idstr = ""//后台要的就是字符串
				let oldidstr = this.cartList.map((item)=>{
					return item.id
				})
				// 处理购物车数据id
				idstr = oldidstr.join(",")
				// console.log(countmoney,countnumber,addtime,idstr)
				//其他参数变为json串格式
				let params = JSON.stringify({uid,username,userphone,address,countmoney,countnumber,addtime})
				// 条件
				let data = {params,idstr}
				let header={authorization:token}
				// 发送添加请求
				let res = await this.$api.addConfirm(data,header)
				if(res.data.code==200){
					uni.showToast({
						title:"下单成功",
						icon:"none"
					}),
					setTimeout(()=>{
						uni.redirectTo({
							url:"../order/order"
						})
					},1500)
				}
			},
			
			
		},
		
		computed:{
			// 计算总价
			_totalPrice(){
				// 在这里不需要去判断是否选中了，因为在获取的时候过滤过了
				let totalPrice = 0;//初始化总价
				this.cartList.map((item, index) => {
					totalPrice += parseFloat(item.price) * parseFloat(item.num);
				})
				return totalPrice
			},
			
			// 计算数量
			_totalNum(){
				let totalNum = 0;
				this.cartList.map((item,index)=>{
					totalNum+=item.num
				})
				return totalNum
			}
		}
	}
</script>

<style>
	@import url("../../common/css/confirm.css");
</style>

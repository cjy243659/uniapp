<script>
// 项目的根组件
export default {
	async onLaunch() {
		let res = await this.$_checkToken(this);
	}
};
</script>

<style>
/*每个页面公共css */
</style>

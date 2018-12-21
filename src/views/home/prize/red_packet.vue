<template>
	<div class="seckill_list">
		
		<div class="fixedTop">
			<nav-bar
                title="红包雨" 
                @back="backTo"/>
		</div>

        <!-- <div class="hby_start_page">
            <div class="hby_start_top">
                <div class="hby_start_top_fanhui"><a href="">&lt;返回首页</a></div>
                <div class="hby_start_hdsm">
                    <a href="javascript:;">活动规则&gt;</a>
                </div>
            </div>
            <div class="hby_start_time">
                <div class="hby_start_time_l">'下次活动开始':'本次活动结束'还有</div>
                <div class="hby_start_time_cen" id="promlimt_show_id">
                    <span class="hby_time">03</span>&#58;
                    <span class="hby_time">45</span>&#58;
                    <span class="hby_time">42</span>
                </div>
                <div class="hby_start_time_cen">
                    <span class="hby_time">00</span>&#58;
                    <span class="hby_time">00</span>&#58;
                    <span class="hby_time">00</span>
                </div>
            </div>


                    <a id="prize"  class="hby_start_btn">
                        <img src="_img_/rain/rain_waiting.png?v=1.00" alt="">
                    </a>
                   
                
                        <a id="notbegin"  class="hby_start_btn">
                            <img src="_img_/rain/rain_waiting.png?v=1.00" alt="">
                        </a>
                        
                    
                    <a href="{:url('rain_money','prizeid='.$info.id)}"  class="hby_start_btn">
                        <img src="_img_/rain/hby_start_btn.png" alt="">
                    </a>
                    
            <a id="end"  class="hby_start_btn">
                <img src="_img_/rain/rain_waiting.png?v=1.00" alt="">
            </a>
            
           
        </div>

        <div class="hby_start_hdgz">
            <div class="hby_start_hdgz_text">
                
            </div>
            <div class="hby_start_hdgz_goback">返回</div>
        </div> -->
	</div>
</template>

<script>
	import { PROMOTE_SECKILL_LIST } from '@/api/activity';
	
    import NavBar from '@/vue/components/NavBar/'
	
	export default {
		name: "Item-list",
		props: {
			itemClass: {
				type: [String, Number],
				default: ""
			}
		},
		
		mixins: [],
		
		data(){
			
			return {
				sortVal: "",
                showArrow: false
			}
		},

		watch: {
			
		},
		
		activated(){
			
		},
		
		deactivated(){
			
		},
		
		created(){
			
		},
		
		methods:{
			initData(){
				this.$reqGet(PROMOTE_PRIZE_INFO, {
					id: ''
				},{
					hideLoading: true
				}).then(res => {
					const { list, page } = res.data;
                    this.items.push(...list);
                    this.stamp = res.data.servertime;
					return page
				})
			},
            backTo() {
                this.$router.back(-1)
            }
		},
		
		components:{
            [NavBar.name]: NavBar,
		}
	}
</script>

<style lang="scss" scoped>
	

</style>

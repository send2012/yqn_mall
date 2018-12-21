<template>
	<div class="user_point">
        <nav-bar 
            title="积分流水"
            @back="backTo"/>

        <div class="user_point_banner">
            <img v-lazy="img_banner" alt="" class="user_point_banner_bg">
            <div class="user_point_banner_text">
                <span class="user_point_banner_text_all">当前 <span>{{user_info.point}}</span> 积分</span>
                <span class="user_point_banner_text_btn" @click="jumpTo">去兑换商品</span>
            </div>
            
            
        </div>
    
		<van-cell-group>
			<van-cell v-for="(item,index) in point_list" :key="index">
                <template slot="title" class="user_point_item">
                    <span class="user_point_item_title">{{item.reson}}</span>
                    <span class="user_point_item_desc">
                        <span class="user_point_item_desc_time">{{item.createdate}}</span>
                        <span :class="getPointClass(item.point)">{{(item.point < 0) ? item.point:'+'+ item.point}}</span>
                    </span>
                    
                </template>
			</van-cell>
		</van-cell-group>


        <!-- <div class="exchange_area">
            <van-button class="exchange">
                <span>去兑换商品</span>
            </van-button>
        </div> -->

       
		
		<!-- <van-popup v-model="showSex" position="bottom">
			<van-picker 
				showToolbar
				:columns="sexColumns"
				title="选择性别"
				@cancel="showSex = false"
				@confirm="onSexConfirm"/>
		</van-popup> -->



	</div>
</template>

<script>
	import { Uploader, Picker, Button } from 'vant';

    import { POINT_LIST } from '@/api/point';
    import { USER_BASE_INFO } from '@/api/system'
    
    import NavBar from "@/vue/components/NavBar/";
    import POINT_BANNER from "@/assets/images/user_point_banner.png";
	
	export default {
		
		data(){
			return {
				showSex: false,
				avatar: "",
				nick_name: "",
				gender: -1,
                mobile: "",
                point_list: [],             //积分列表
                user_info: {},              //用户信息
                img_banner: POINT_BANNER            //页面banner
			}
		},
		
		computed: {
			
		},
		
		created(){
            this.getUserPoint();
            this.getUserInfo();
		},
		
		methods: {
			avatarAfterRead(file){
				console.log(file);
            },
            getUserInfo() {
                //获取用户积分
                this.$reqGet(USER_BASE_INFO).then(res => {
                    this.user_info = Object.assign({},res.data)
                })
            },
			// onSexConfirm(value, index){
			// 	this.$reqPut(USER_POINT, {
			// 		gender: index[0]
			// 	}).then(res => {
			// 		this.gender = res.data.data.gender;
			// 		this.showSex = false;
			// 	})
			// },
			getUserPoint(){
                // 获取用户积分列表
				this.$reqGet(POINT_LIST).then(res => {
                    this.point_list.push(...res.data.list)
				})
            },
            getPointClass(point) {
                //根据积分正负选取样式
                return point < 0?'user_point_item_desc_point_add':'user_point_item_desc_point_sub'
            },
            jumpTo() {
                this.$router.push({name: 'user-point-mall'})
            },
            backTo() {
                this.$router.back(-1)
            }
		},
		
		components: {
			[Uploader.name]: Uploader,
            [Picker.name]: Picker,
            [Button.name]: Button,
            [NavBar.name]:  NavBar
        },
        
        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy();
            next();
        }
	}
</script>


<style lang="scss" scoped>
	
	.user_point{
        padding-top: 46px;
        padding-bottom: 0;
        .user_point_banner {
            display: flex;
            justify-content: space-between;
            align-content: center;
            position: relative;
            &_bg {
                width: 100%;
                height: auto;
            }
            &_text {
                position: absolute;
                width: 50%;
                right: 0;
                top: 0;
                height: 100%;
                line-height: 1.44rem;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                &_all {
                    margin-top: .6rem;
                    font-size: $sub-title-size;
                    span {
                        font-size: 21px;
                    }
                }
                &_btn {
                    display: inline-block;
                    width: 4.72rem;
                    height: 1.32rem;
                    background: #fff;
                    text-align: center;
                    line-height: 1.32rem;
                    color: $main-color;
                    font-size: $sub-title-size;
                    border-radius: 5px;
                }
            }
        }
		&_item {
            display: flex;
            flex-direction: column;
            &_title {
                font-weight: 700;
                color: $main-title-color;
                font-size: $product-title-size;
            }
            &_desc {
                display: flex;
                justify-content: space-between;
                color: $main-title-color;
                font-size: $extra-size;
                &_point_sub {
                    color: $price-color;
                    font-size: $main-title-size;
                }
                &_point_add {
                    color: #13D618;
                    font-size: $main-title-size;
                }

            }
        }
        // .exchange_area {
        //     padding: 15px 20px; 
        //     .exchange {
        //         width: 100%;
        //         height: 44px;
        //         border-radius: 5px;
        //         background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
        //         color: #fff;
        //     }
        // }
        
	}
</style>
<style lang="scss">
.user_information {
    i.van-cell__right-icon {
        position: relative;
    }
}
</style>



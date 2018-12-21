<template>
	<div class="member_center">
		<nav-bar 
            title="会员中心"
            @back="backTo"/>

        <div class="member_center_process">
            <div class="member_center_process_title">
                <img :src="level" alt="等级图示">
                <span>{{storelv}}门店<span>（当前等级）</span></span>
            </div>
            <div class="member_center_process_content">
                <div>本月成长值：{{userlv.score}}</div>
                <vm-progress :percentage="percentage" :show-text="false" :stroke-width="6" status="exception" striped class="member_center_process_content_progress" stroke-color="#fff" track-color="#FD6D14"/>
                <div class="member_center_process_content_side">
                    <span>普通（0）</span>
                    <span>高级（10000）</span>
                    <span>VIP（20000）</span>
                </div>
            </div>
        </div>

        <div class="member_center_action">
            <img :src="update_rule" alt="">
            <div>
                <img :src="action_btn" alt="" @click="toUpdate">
            </div>
        </div>

        <div class="member_center_info">
            <img :src="level_info" alt="">
        </div>
	</div>
</template>

<script>
import NavBar from "@/vue/components/NavBar/"

import LEVEL1 from "@/assets/images/user/user_member_lv1.png";
import LEVEL2 from "@/assets/images/user/user_member_lv2.png";
import LEVEL3 from "@/assets/images/user/user_member_lv3.png";
import UPDATE_RULE from "@/assets/images/user/user_update_rule.png";
import ACTION_BTN from "@/assets/images/user/user_update.png";
import LEVEL_INFO from "@/assets/images/user/user_update_excel.png";

	export default {

        props:{
            level_point:null
            
        },

        data() {
            const userlv=JSON.parse(this.level_point)
            console.log(userlv)
            return {
                userlv,
                storelv:'',
                level: '',
                percentage:0,
                update_rule: UPDATE_RULE,
                action_btn: ACTION_BTN,
                level_info: LEVEL_INFO,
            }
        },

        created(){
            this.userinfo()
        },
        
        methods: {
            userinfo(){
                if(this.userlv.vip === 1){
                    this.storelv = '普通';
                    this.level = LEVEL1
                }else if(this.userlv.vip === 2){
                    this.storelv = '高级';
                    this.level = LEVEL2;
                }else{
                    this.storelv = 'vip';
                    this.level = LEVEL3;
                }

                this.percentage=(this.userlv.score/200).toFixed(2)
            },
            toUpdate() {
                //去升级
                this.$router.push({name: 'home'});
            },
            backTo() {
                this.$router.back(-1)
            }
        },

        components: {
            [NavBar.name]: NavBar
        }
	}
</script>


<style lang="scss" scoped>
	.member_center {
        padding-top: 46px;
        &_process {
            padding: 1rem 1.28rem 0;
            height: 4.44rem;
            background: linear-gradient(0deg,rgba(253,109,20,1),rgba(253,180,88,1));
            &_title {
                display: flex;
                align-items: center;
                img {
                    width: 1.6rem;
                    height: auto;
                }
                span {
                    font-size: $sub-title-size;
                    color: #fff;
                    margin-left: 6px;
                    span {
                        font-size: $extra-size;
                    }
                }
            }
            &_content {
                margin-top: .42rem;
                >div {
                    color: #702F06;
                    font-size: $extra-size;
                }
                &_side {
                    width: 100%;
                    margin-top: 5px;
                    display: flex;
                    justify-content: space-between;
                }
                &_progress {
                    margin-top: 5px;
                }
            }
        }
        &_action {
            padding: 5px 9px 10px;
            height: 2.12rem;
            background: #fff;
            margin-top: 5px;
            display: flex;
            justify-content: space-between;
            >img {
                width: 5.2rem;
                height: 1.92rem;
            }
            >div {
                position: relative;
                img {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 2.4rem;
                    height: auto;
                    z-index: 1000;
                }
            }
        }
        &_info {
            padding: 5px 5px 2.16rem;
            margin-top: 5px;
            background: #fff;
            >img {
                width: 14.4rem;
                height: auto;
            }
        }
    }
</style>
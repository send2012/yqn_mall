<template>
	<div class="set_user_info">

        <nav-bar 
            title="个人资料"
            @back="backTo"/>
    

		<van-cell-group>
			<van-field
                v-model="company"
                label="店名："
                :error="!!$vuelidation.error('nickName')" />

            <van-field
                v-model="truename"
                label="联系人："
                :error="!!$vuelidation.error('nickName')" />

            <van-field
                v-model="telephone"
                label="手机号码："
                :error="!!$vuelidation.error('nickName')" />

            <van-field
                v-model="area"
                label="选择地址："
                readonly
                :error="!!$vuelidation.error('nickName')" 
                @click.native="showArea"/>

            <van-field
                v-model="address"
                label="详细地址："
                :error="!!$vuelidation.error('nickName')" />


		</van-cell-group>
		
		<div class="bottom_btn">
			<van-button type="danger" @click="saveBasic" class="save">确认修改</van-button>
		</div>


        <van-popup v-model="show" position="bottom">
            <van-area 
                :area-list="areaList" 
                :value="areacode"
                @confirm="enterArea"
                @cancel="cancelArea" />
        </van-popup>
	</div>
</template>


<script>
    import { Area, Popup } from 'vant';
    import { USER_BASIC_INFO, USER_BASIC_EDIT } from '@/api/user';
    import {SYS_AREA_LIST} from '@/api/system'
    import valid from '@/api/user';
    import NavBar from "@/vue/components/NavBar/";
    import AREA_LIST from "../../../../../mock/area-list.js";
	
	export default {
		data(){
			return {
                company: "",
                truename: "",
                telephone: "",
                area: "",
                address: "",
                areacode: "",           //地区编码
                show: false,            //省市区弹出层
                areaList: []         //省市区数据
			}
		},
		
		vuelidation: {
			data: {
				company: {
					required: {
						msg(){
							return "请填写店名"
						}
					}
				}
			}
		},
		
		created(){
            this.getBasicInfo();
            this.getarealist();
            
		},
		
		methods: {
            getBasicInfo() {
                //进入页面时获取用户信息
                this.$reqGet(USER_BASIC_INFO).then((res)=>{
                    const user_data = res.data;
                    this.company = user_data.company;
                    this.truename = user_data.truename;
                    this.telephone = user_data.telephone;
                    
                    // this.area = user_data.province + '，' + user_data.county + '，' + user_data.city;
                    this.areacode = user_data.areacode;
                    this.address = user_data.address;
                    
                })
            },
            getarealist(){
                this.$reqGet(SYS_AREA_LIST).then((res)=>{
                    this.areaList=res.data
                    this.initaddress();
                })
            },
            initaddress(){
                let str = this.areacode
                let province = str.substr(0,2)
                let city = str.substr(0,4)
                let county = str
                let currentarea=[]
                currentarea.push(this.areaList.province_list[`${province}0000`])
                currentarea.push(this.areaList.city_list[`${city}00`])
                currentarea.push(this.areaList.county_list[county])
                this.area=currentarea.join(',')
            },
			getNick(){
				this.company = localStorage.getItem('nick_name') || '';
			},
			saveBasic(){
				if(this.mixValid()){
                    const { company, truename, telephone, address, areacode } = this;
                    this.$reqPost(USER_BASIC_EDIT,{
                        company,
                        truename,
                        telephone,
                        address,
                        areacode,     
                    }).then((res)=>{
                        this.$toast('修改成功')
                    })
					// this.$reqPut(USER_PROFILE, {nick_name: this.nickName}).then(res => {
					// 	localStorage.setItem('nick_name', res.data.data.nick_name);
					// 	 return this.$dialog.alert({message: '保存成功'})
					// }).then(() => {
					// 	this.$router.go(-1);
					// })
				}
            },
            showArea() {
                // 显示出省市区弹出层
                this.show = true;
            },
            enterArea(value) {
                //选中省市区后确认
                let str = [];
                value.map((item)=>{
                    str.push(item.name);
                }) 
                this.area = str.join('，');
                this.show = false;
                console.log(value)
                this.areacode = value[2].code;
            },
            cancelArea() {
                //取消省市区的选中
                this.show = false;
            },
            backTo() {
                this.$router.back(-1)
            }
        },
        components: {
            [Area.name]: Area,
            [NavBar.name]: NavBar
        }
	}
</script>


<style lang="scss" scoped>
    .set_user_info {
        padding-top: 46px;
        .bottom_btn{
            width: 100%;
            padding-top: 1.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .save {
            width: 13.76rem;
            background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
        }
    }
	
</style>
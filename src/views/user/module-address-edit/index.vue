<template>
    <div class="user_address_edit">
        <nav-bar 
            :title="(addressId === -1?'新增':'编辑') + '收货地址'"
            @back="backTo"/>
        <van-address-edit
            v-if="areaList"
            style="background-color: #fff;"
            :areaList="areaList"
            :addressInfo="addressInfo"
            :isSaving="isSave"
            :show-delete="addressId === -1?false:true"
            show-set-default
            :save-button-text="'确认' + (addressId === -1?'新建':'修改')"
            delete-button-text="删除收货地址"
            @save="onSave"
            @delete="onDelete"
        />
    </div>
	
</template>

<script>
    import { USER_ADDRESS_ADD, USER_ADDRESS_EDIT, USER_ADDRESS_INFO, USER_ADDRESS_DEL } from '@/api/user'
    import { SYS_AREA_LIST } from '@/api/system'
	import { AddressEdit } from 'vant';
    import areaList from './area.json';
    import NavBar from "@/vue/components/NavBar/";
	export default {
		name: "address-edit",
		
		props:{
			addressId: [Number, String],
		},
		
		data(){
            
			return {
				areaList: null,
				isSave: false,
				addressInfo: {},
			}
		},
		
		activated(){
			// setTimeout(() => {
			// 	this.addressInfo = {
			// 		id: this.addressId,
			// 		name: "qianzhaoy",
			// 		tel: "13454193338",
			// 		province: "浙江省",
			// 		city: "杭州市",
			// 		county: "西湖区",
			// 		address_detail: "是的是的",
			// 		area_code: "330106",
			// 		postal_code: 123456
			// 	}
			// }, 1000);
        },
        
        created() {

            this.getAreaList();

            if(this.addressId && this.addressId !== -1) {
                this.getAddressInfo();
            }
        },
		
		methods: {
            getAddressInfo() {
                //获取收货地址详情
                let _this = this;
                this.$reqGet(USER_ADDRESS_INFO,{address_id: _this.addressId}).then((res)=>{
                    if(!(res.data instanceof Array)) {
                        _this.addressInfo = { 
                            address_id: this.addressId,
                            name: res.data.truename,
                            tel: res.data.mobile,
                            province: res.data.province,
                            city: res.data.city,
                            county: res.data.county,
                            addressDetail: res.data.address,
                            areaCode: res.data.areacode,
                            isDefault: res.data.mr === 0?false:true
                        }
                    }else {
                        _this.addressInfo = {
                                address_id: '',
                                name: '',
                                tel: '',
                                province: '',
                                city: '',
                                county: '',
                                addressDetail: '',
                                areaCode: '',
                                isDefault: false
                            }
                    }
                    
                })

            },
            addAddress(address_data) {
                //添加收货地址
                this.$reqPost(USER_ADDRESS_ADD,address_data).then((res)=>{
                    this.$toast("添加成功");
                    this.$bus.$emit('address_id',res.data.address_id)
                    setTimeout(()=>{
                        this.$router.back(-1)
                    },500)
                })
            },
            editAddress(address_data) {
                //修改收货地址
                this.$reqPost(USER_ADDRESS_EDIT,address_data).then((res)=>{
                    this.$toast("修改成功");
                    this.$bus.$emit('address_id',res.data.address_id)
                    setTimeout(()=>{
                        this.$router.back(-1)
                    },500)
                })
            },
            delAddress(id) {
                let _this = this;
                //删除收货地址
                this.$dialog.confirm({
                    title: '确认删除？'
                }).then(() => {
                    this.$reqPost(USER_ADDRESS_DEL,{address_id: id}).then((res)=>{
                        this.$toast('收货地址删除成功')
                    })
                }).catch(() => {

                })
                
            },
            getAreaList() {
                //获取地区数据
                this.$reqGet(SYS_AREA_LIST).then(res => {
                    this.areaList = Object.assign({},res.data)
                })
            },
			onSave(data){
                let address_data = {};
                address_data.truename = data.name;
                address_data.mobile = data.tel;
                address_data.areacode = data.areaCode;
                address_data.address = data.addressDetail;
                address_data.mr = data.isDefault?1:0;
                if(this.addressId === -1) {
                    this.addAddress(address_data);
                }else {
                    address_data.address_id = data.address_id;
                    this.editAddress(address_data);
                }
            },
            onDelete(data){
                let _this = this;
                this.$dialog.confirm({
                    title: '确认提示',
                    message: '您确定要删除该收货地址吗？'
                }).then(() => {
                    // on confirm
                    _this.delAddress(_this.addressId);
                }).catch(() => {
                    // on cancel
                });
            },
            backTo() {
                this.$router.back(-1)
            }
		},
		
		components: {
            [AddressEdit.name]: AddressEdit,
            [NavBar.name]: NavBar
        },
        
        beforeRouteLeave (to, from, next) {
            // ...
            this.$destroy();
            next();
        }
	}
</script>
<style lang="scss">
@import "../../../assets/scss/_var.scss";
.user_address_edit {
    padding-top: 46px;
    .van-button--danger {
        background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
    }
    .van-button--default {
        border: 1px solid $main-color;
        color: $main-color;
    }
    
}
</style>

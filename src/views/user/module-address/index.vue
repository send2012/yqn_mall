<template>
	<div class="user_address">
    
    <nav-bar 
        title="收货地址"
        @back="backTo"/> 
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        
	<van-radio-group v-model="default_address" class="user_address_addressGroups">
		<van-cell-group v-for="(item,index) in items" :key="item.address_id" class="user_address_addressGroups_addressGroup">
				<van-cell class="user_address_addressGroups_addressGroup_cell" @click="checkTheOrder(item.address_id)">
                    <template slot="title">
                        
                        <span class="user_address_addressGroups_addressGroup_cell_title">{{item.truename}}</span>
                        <span class="user_address_addressGroups_addressGroup_cell_mobile">{{item.mobile}}</span>
                        
                        <div class="user_address_addressGroups_addressGroup_cell_address">
                            <span>{{item.province + item.city + item.county + item.address}}</span>
                        </div>
                    </template>  
				</van-cell>
			
				<van-cell>
					<van-radio
						slot="title"
						:name="item.address_id" 
						@click="setDefaultAddress(item.address_id,index)">
						<span :class="item.isDefault && 'red'">{{item.mr==1 ? '默认地址' : '设为默认'}}</span>
					</van-radio>
					<div>
						<router-link
							:to="{name: 'address-edit', params: {addressId: item.address_id}}"
							style="margin-right: 10px;">
							<van-icon name="yqn_edit" />
							编辑
						</router-link>
						<span @click="deleteUserAddress(item.address_id)">
							<van-icon name="yqn_trashbin" />
							删除
						</span>
					</div>
				</van-cell>
			
			</van-cell-group>
		</van-radio-group>
    
        <div class="bottom_btn">
            <van-button class="bottom_btn_inner" @click="setNewAddress" type="primary"  bottomAction>
			新增地址
		    </van-button>
        </div>

        <is-empty v-if="is_empty">
            <div class="is-empty">
                <span class="is-empty_text">您还没有设置收货地址</span>
                <div>
                    <span class="is-empty_btn" @click="setNewAddress">立即创建</span>
                </div>
            </div>
        </is-empty>
		</van-pull-refresh>
	</div>
    
</template>

<script>
    import { USER_ADDRESS_LIST, USER_ADDRESS_DEFAULT, USER_ADDRESS_DEL } from '@/api/user'
    import { Checkbox, Radio, RadioGroup, PullRefresh } from 'vant';
    import NavBar from "@/vue/components/NavBar/"
    import isEmpty from "@/vue/components/is-empty/"
    import loadMore from '@/vue/mixin/list-load-more';
	export default {

        mixins: [loadMore],

		data(){
			return {
                default_address: '',
                items: [],
                isLoading:false,
                is_empty: false,          //是否为空数据
                route_name: ''              //上一层路由·name
			}
        },
        
        created() {
            this.resetInit();
        },
		
		methods: {
            initData() {
                //获取收货地址列表
                return this.$reqGet(USER_ADDRESS_LIST,{
                    pagesize: this.pages.perPage,
					page: this.pages.currPage
                },{
                    hideLoading: true
                }).then((res)=>{
                    //是否为空地址
                    const { list, hasmore } = res.data.list;
                    this.items.push(...list);
                    if (list.length === 0) this.isEmpty = true;
                    this.has_more = hasmore;
                    
                    this.items.map((item)=>{
                        if(item.mr == 1){
                            this.default_address=item.address_id;
                        }
                    })
                    return hasmore;
                })
            },
			setDefaultAddress(id,index){
                this.$reqPost(USER_ADDRESS_DEFAULT,{address_id:id}).then((res)=>{
                    this.$toast('设置默认地址成功');
                    this.items.forEach((item,index) => {
                        item.mr = 0;
                    });
                    this.items[index].mr = 1;
                })
				
			},
			setNewAddress(){
				this.$router.push({name: 'address-edit', params: {addressId: -1}})
            },
            deleteUserAddress(id) {
                let _this = this;
                this.$dialog.confirm({
                    title: '确认提示',
                    message: '您确定要删除该收货地址吗？'
                }).then(() => {
                    // on confirm
                    _this.$reqPost(USER_ADDRESS_DEL,{address_id: id}).then((res)=>{
                        _this.$toast('删除成功');
                        this.items.map((item,index) => {
                            if(item.address_id === id) {
                                this.addressList.splice(index,1)
                            }
                        })

                        if(this.items.length === 0) {
                            //地址被全部删除
                            this.is_empty = true;
                        }
                    })
                }).catch(() => {
                    // on cancel
                });
            },
            checkTheOrder(address_id) {
                //如果是订单页过来的，则点击选中跳转
                console.log(this.route_name)
                if(this.route_name === 'placeOrderEntity') {
                    //是从订单确认页跳转过来的
                    sessionStorage.setItem('address_id',address_id);
                    //eventbus传递收货地址
                    this.$bus.$emit('address_id',address_id);
                    this.$router.back(-1);
                }else if(this.route_name === 'user-point-mall-order') {
                    //从积分订单页过来的
                    sessionStorage.setItem('address_id',address_id);
                     //eventbus传递收货地址
                    this.$bus.$emit('address_id',address_id);
                    this.$router.back(-1);
                }
            },
            onRefresh() {
                this.refresh()
            },
            async refresh(){
                this.pages.currPage=1;
                const result = await this.resetInit()
                this.isLoading = false;
                this.$toast({
                    message:'刷新成功'
                })
            },
            // newAddress() {
            //     //跳转至新建收货地址
            //     this.$router.push({name: 'address-edit', params: {addressId: 0}})
            // },
            backTo() {
                this.$router.back(-1);
            }
		},
		
		components: {
			[Checkbox.name]: Checkbox,
			[Radio.name]: Radio,
            [RadioGroup.name]: RadioGroup,
            [NavBar.name]: NavBar,
            [isEmpty.name]: isEmpty,
            [PullRefresh.name]: PullRefresh
        },
        
        beforeRouteEnter (to, from, next) {
            // ...
            next(vm => {
                vm.route_name = from.name;
                if(from.name === 'address-edit') {
                    //从新增或修改地址传递过来的
                    if(sessionStorage.getItem('from_order')) {
                        vm.$router.back(-1)
                    }
                }
            })
        },
        beforeRouteLeave (to, from, next) {
            this.$destroy();
            next()
        }

	}
</script>


<style lang="scss" scoped>
@import "../../../assets/scss/_var.scss";
    .user_address {
        padding-top: 46px;
        padding-bottom: 0;
        .van-pull-refresh{
            height: 100%;
            overflow: auto;
        }
        &_addressGroups {
            padding: 0 8px 50px;;
            &_addressGroup {
                margin-bottom: 5px;
                border-radius: 5px;
                // &:last-child{
                //     margin-bottom: 0;
                // }
                &_cell {
                    border-bottom: 1px solid #E6E6E6;
                    &_title {
                        display: inline-block;
                        font-size: $sub-title-size;
                        color: $main-title-color;
                    }
                    &_mobile {
                        display: inline-block;
                        margin-left: 1.72rem;
                        font-size: $product-title-size;
                        color: $main-title-color;
                    }
                    &_address {
                        margin-top: .1rem;
                        color: $sub-title-color;
                        font-size: $extra-size;
                    }
                }
            }
        }
        
        
        .bottom_btn{
            width: 100%;
            height: 2.56rem;
            background: #fff;
            position: fixed;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            &_inner {
                width: 13.76rem;
                // height: 1.76rem;
                background: linear-gradient(to right ,#fe5d28 , #fe8246)!important;
            }
        }


        .is-empty {
            width: 100%;
            display: flex;
            flex-direction: column;
            &_text {
                color: $explain-text-color;
                font-size: $sub-title-size;
            }
            div {
                padding: .4rem 0;
            }
            &_btn {
                display: inline-block;
                border: 1px solid $main-color; 
                border-radius: 3px;
                color: $main-color;
                font-size: $product-title-size;
                width: 3.12rem;
                height: 1.32rem;
                line-height: 1.32rem;
                text-align: center;
            }
        }
    }
	
</style>

<style lang="scss">
.user_address {
    .van-radio {
        span{
            &:nth-child(2) { 
                margin-left: .2rem;
            }
        }
        
    }
    .van-pull-refresh__track {
        height: 100%;
    }
    .van-cell{
        font-size:$product-title-size !important;
    }
}
</style>

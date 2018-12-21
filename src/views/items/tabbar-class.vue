<template>
	<div class="tab_class">
		<div class="tab_class_searchBox" @click="jumpSearch">
			<van-search
                :placeholder="placeholder" disabled/>
			<div class="tab_class_searchMask"  @click="$router.push({ name: 'search' })"></div>
		</div>

        <keep-alive>
            <class-tree
                v-if="list.length"
                @class-click="toItemList"
                @all-click="toItemList"
                :list="list"
            ></class-tree>
        </keep-alive>

		<is-empty v-if="isEmpty">抱歉,店主还未上架商品</is-empty>
	</div>
</template>

<script>
	import { CLASS_ALL_LIST } from '@/api/product';

	import { Search } from 'vant';
	import classTree from './tabbar-class-tree';
	import IsEmpty from "@/vue/components/is-empty/";

	export default {
		data(){
			return {
				list: [],
                isEmpty: false,
                placeholder: '点击前往搜索'         //默认placeholder
			}
		},

		created(){
            this.initData();
            //先从本地拿出默认关键词
            this.placeholder = sessionStorage.getItem('search_default') || '请输入搜索关键词';
            //否则监听从tabbar过来的关键词
            this.$bus.$on('search_default', keyword => {
                this.placeholder = keyword;
                this.keyword = this.placeholder;
            })
		},

		methods: {
			initData(){
				const shop_id = this.$util.getLocationParam("shop_id");
				this.$reqGet(CLASS_ALL_LIST).then(res => {
					const data= this.removeNoChild(res.data);
					this.list = data;
					this.isEmpty = !data || !data.length;
				})
			},
			removeNoChild(data){
				return data.filter(item => (item.children && item.children.length))
			},
			toItemList(item = {id: '', pcid: ''}){
                let type = '';
                if(item.id === 0) {
                    //点击全部
                    type = 'all';
                    this.$router.push({name: "list", query: {keyword: "", itemPcid: item.pcid}})
                }else {
                    if(item.titlee) {
                        //从品牌进入
                        type = 'brand';
                        this.$router.push({name: "list", query: {keyword: "", itemBid: item.id, itemPcid: item.pcid}})
                    }else {
                        //从子分类进入
                        type = 'children';
                        this.$router.push({name: "list", query: {keyword: "", itemCid: item.id, itemPcid: item.pcid}})
                    }
                }
            },
            jumpSearch() {
                //跳至搜索
                this.$router.push({name: 'search'})
            }
		},
		components: {
			[Search.name]: Search,
			[classTree.name]: classTree,
			[IsEmpty.name]: IsEmpty
        },

        beforeRouteEnter (to, from, next) {
            // ...
            next(vm => {
                if(from.name === 'login' || vm.list.length === 0) {
                    vm.initData();
                }
            })
        },
        beforeRouteLeave (to, from, next) {
            // ...
            if(to.name === 'login') {
                this.$destroy();
            }

            next();
        }
	}
</script>


<style scoped lang="scss">
	.tab_class{
        background-color: #fff;
        padding-top: 44px;
        &_searchBox {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
        }
	}

	.tal_class_searchBox{
		position: relative;
	}

	.tal_class_searchMask{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 9;
	}
</style>

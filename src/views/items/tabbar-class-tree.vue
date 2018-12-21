<template>
	<div class="class_tree clearfix">
		<ul class="class_tree_nav" ref="class_tree_nav">
			<li
				v-for="(item ,index) in list"
				:key="item.id"
				:class="{active_nav: navActive == index}"
				@click="navclick(index)">
				{{item.title}}
			</li>
		</ul>
		<div class="class_tree_content" ref="class_tree_content">
			<!-- <div class="class_tree_all">
				<span @click="allClick">全部 <i class="van-icon van-icon-arrow"></i></span>
			</div> -->
            <!-- <div v-if="banner()">
                <img :src="banner()" alt="">
            </div> -->
            <div class="class_tree_content_title">{{title}}</div>
			<div class="class_tree_items_wrap clearfix">
				<div @click="classClick(item,'cid')" v-for="item in goods" :key="item.id">
					<div class="class_tree_item_img"><img v-lazy="item.picpath" :alt="item.title" ></div>
					<div class="class_tree_item_name">{{item.title}}</div>
				</div>
			</div>
            <div class="class_tree_content_title">热卖品牌</div>
            <div class="class_tree_items_wrap clearfix">
				<div @click="classClick(item,'bid')" v-for="item in brands" :key="item.id">
					<div class="class_tree_item_img"><img :src="item.picpath" :alt="item.title"></div>
					<div class="class_tree_item_name">{{item.title}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "class-tree",

		model: {
			prop: 'activeIndex'
		},

		props: {
			activeIndex: {
				type: Number,
				default: 0
			},
			list: Array
		},

		data(){
			let navActive = this.activeIndex >= this.list.length ? 0 : this.activeIndex;
			return {
                navActive,
                title: '',
                nav_scroll_top: 0,          //左侧滚动轴高度
                content_scroll_top: 0              //右侧滚动轴高度
			}
        },

        created() {
            this.getTitle();
        },

        activated() {
            this.eventListen(true);
            let class_tree_nav = this.$refs['class_tree_nav'];
            let class_tree_content = this.$refs['class_tree_content'];
            class_tree_nav.scrollTop = this.nav_scroll_top;
            class_tree_content.scrollTop = this.content_scroll_top;
        },

        deactivated() {
            this.eventListen(false);
        },

        mounted(){
            const vm = this;
            let class_tree_nav = vm.$refs['class_tree_nav'];
            let class_tree_content = vm.$refs['class_tree_content'];
            class_tree_nav.addEventListener('scroll', vm.$util.debounce(function() {
                vm.nav_scroll_top = class_tree_nav.scrollTop;
            }, 50))
            class_tree_content.addEventListener('scroll', vm.$util.debounce(function() {
                vm.content_scroll_top = class_tree_content.scrollTop;
            }, 50))
        },

		computed: {
            // banner() {
            //     const list = this.list,
            //           navActive = this.navActive;
            //     return (list && list.length) ? list[navActive].picpath : false;
            // },
			goods(){
				const list = this.list,
                      navActive = this.navActive;
                if(list && list.length && list[navActive].children[0].id !== 0) {
                    let obj = {};
                    obj.id = 0;        //点击全部，则传的是分类id
                    obj.pcid = list[navActive].id;
                    obj.title = '全部';
                    obj.picpath = list[navActive].picpath;
                    list[navActive].children.unshift(obj);
                }

				return (list && list.length) ? list[navActive].children : [];
            },
            brands() {
                const list = this.list,
                      navActive = this.navActive;
              if(list && list.length && list[navActive].brand[0].id !== 0) {
                let obj = {};
                obj.id = 0;        //点击全部，则传的是分类id
                obj.pcid = list[navActive].id;
                obj.title = '全部';
                obj.picpath = list[navActive].picpath;
                list[navActive].brand.unshift(obj);
              }
				return (list && list.length) ? list[navActive].brand : [];
            }
		},

		methods: {
            eventListen(isBind = true) {
                let class_tree_nav = this.$refs['class_tree_nav'];
                let class_tree_content = this.$refs['class_tree_content'];
                if (isBind) {
                    class_tree_nav.addEventListener("scroll", ()=>{});
                    class_tree_content.addEventListener("scroll", ()=>{});
                } else {
                    class_tree_nav.removeEventListener("scroll", ()=>{});
                    class_tree_content.removeEventListener("scroll", ()=>{});
                }
            },
			allClick(){
				this.$emit("all-click");
			},
			navclick(i){
				this.navActive = i;
                this.$emit("nav-click", i);
                this.getTitle(i);
			},
			classClick(item){
                console.log(item)
				this.$emit("class-click", item);
            },
            getTitle(i = 0) {
                //获取商品分类标题
                const list = this.list;
                this.title = list[i].title;
            }
		},
	}
</script>

<style lang="scss" scoped>

	@import "../../assets/scss/mixin";
	.class_tree{
		position: relative;
		background-color: #fff;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		height: 100%;
		// padding-bottom: 50px;
		box-sizing: border-box;
	}
	.class_tree_nav{
		float: left;
		width: 4rem;
		height: 100%;
		background-color: #fff;
		overflow: scroll;
		>li{
			@include one-border;
			height: 1.6rem;
			line-height: 1.6rem;
			text-align: center;
			border-left: 2px solid $background-color;
		}
		>li.active_nav{
				background-color: $background-color;
				border-left: 2px solid $main-color;
				color: $main-color;
		}
	}
	.class_tree_content{
		margin-left: 4rem;
		height: 100%;
		overflow-x: hidden;
        overflow-y: scroll;
        background: $background-color;
        padding: 0 4px;
		.class_tree_all{
			text-align: right;
			padding-right: .4rem;
			height: 1.6rem;
			line-height: 1.6rem;
			color: $main-title-color;
			font-size: $product-title-size;
		}
		.van-icon-arrow{
			font-size: $font-size-small;
		}
		.class_tree_items_wrap{
            background: #fff;
      padding: .4rem 0 .4rem .4rem;
      /* padding-right: -3%; */
      text-align: center;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;

            > div
            {
              box-sizing: border-box;
              margin-right: .3rem;
              margin-bottom: .8rem;
              overflow : hidden;

              &:nth-of-type(3n)
              {
                margin-right: 0;
              }
            }
			img{
				max-width: 100%;
        max-height : 100%;
        vertical-align : middle;
			}

			.class_tree_item_img{
				display: inline-block;
				max-width: 100%;
				width: 3.08rem;
				height: 3.08rem;
        line-height : 3.08rem;
        overflow : hidden;
			}
			.class_tree_item_name{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
        }
        &_title {
            padding-left: 4px;
            height: 1.6rem;
			line-height: 1.6rem;
            font-size: $sub-title-size;
            color: $main-title-color;
        }
	}
</style>

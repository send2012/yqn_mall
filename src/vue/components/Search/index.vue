<template>
	<div class="item_search">
		<form action="/search" @submit="disabledSubmit" class="search_form">
			<van-icon name="yqn_leftIcon" class="back_arrow" @click.native="backTo"/>
			<van-search 
				:placeholder="placeholder" 
				v-model="keyword" 
				@search="enterSearch" 
				 
				class="search_bar"
				show-action>
				<div slot="action" @click="enterSearch">搜索</div>
			</van-search>
		</form>
		<div class="item_search_content" v-if="wordHistory.length !== 0">
			<div class="item_search_text clearfix">
				<div class="float-l">历史搜索</div>
				<div class="float-r" @click="clearHistory">
					<van-icon name="yqn_trashBin" style="font-size: 12px;margin-right: 3px" class="item_search_text_icon"/>
				</div>
			</div>
			<div class="item_search_history">
				<word-tag 
					v-for="(his, i) in wordHistory" 
					:key="i" 
					@click="toSearchResult(his)"
				>{{his}}</word-tag>
			</div>
		</div>
		<div class="item_search_content">
			<div class="item_search_text clearfix">
				<div class="float-l">热门搜索</div>
				<!-- <div class="float-r" @click="clearHistory">
					<van-icon name="lajitong" style="font-size: 12px;margin-right: 3px" />
					清空历史记录
				</div> -->
			</div>
			<div class="item_search_history">
				<word-tag 
					v-for="(his, i) in word_hot" 
					:key="i" 
					@click="toSearchResult(his)"
				>{{his}}</word-tag>
			</div>
		</div>
	</div>	
</template>

<script>
	import { Search } from 'vant';
	import SrarchTag from './search-tag';
	
	export default {

        name: 'search-compo',

        props: {
            popup: {
                type: Boolean,
                default: false
            }
        },
		data(){
			return {
				keyword: "",
				focusStatus: true,
                wordHistory: [],                //搜索历史
                word_hot: [],                    //搜索热词
                placeholder: '请输入搜索关键词'         //默认搜索的词          
			}
        },
        created() {
            this.word_hot = sessionStorage.getItem('search_hot')?JSON.parse(sessionStorage.getItem('search_hot')):[];
            this.wordHistory = this.getKeyWordHistory()
            //先从本地拿出默认关键词
            this.placeholder = sessionStorage.getItem('search_default') || '请输入搜索关键词';
            //否则监听从tabbar过来的关键词
            this.$bus.$on('search_default', keyword => {
                this.placeholder = keyword;
                // if(!this.keyword) {
                //     this.keyword = this.placeholder;
                // }
            })
        },
        watch: {
            '$route': 'changeHotWord'
		},
		methods:{
            changeHotWord() {
                //监听路由改变热词
                this.word_hot = sessionStorage.getItem('search_hot')?JSON.parse(sessionStorage.getItem('search_hot')):[];
            },
			enterSearch(){
                const keyword = this.keyword || this.placeholder;
				this.pushHistoryTolocal(keyword);
				this.toSearchResult(keyword);
			},
			toSearchResult(word){
				this.keyword = word.trim();
                // this.$router.push({name: "search-result", query: {keyword: word.trim()}});
                this.pushHistoryTolocal(word);
                if(this.popup) {
                    //关闭弹出层
                    this.$emit('SearchKeyword', word.trim())
                }else {
                    this.$router.push({name: "list", query: {keyword: word.trim()}})
                }
                
                
			},
			pushHistoryTolocal(keyword){
				let wordHistory = this.wordHistory;
				let historyKeyWord = this.getKeyWordHistory();
				if(!!keyword.trim() && historyKeyWord.indexOf(keyword) < 0){
                    //判断历史记录是否超过了10条
                    if(historyKeyWord.length >= 10) {
                        //超过了10条,删除第一条
                        wordHistory.pop();
                    }
					wordHistory.unshift(keyword);
					window.localStorage.setItem("keyword", wordHistory.join("|"));
				}
			},
			getKeyWordHistory(){
				const listWord =  window.localStorage.getItem("keyword");
				return listWord ? listWord.split("|") : [];
			},
			clearHistory(){
				this.$dialog.confirm({
				  message: '确认清除历史记录'
				}).then(() => {
					window.localStorage.setItem("keyword", "");
					this.wordHistory = [];
				});
			},
			disabledSubmit(){
				return false;
			},
			backTo () {
                if(this.popup) {
                    //关闭弹出层
                    this.$emit('closePopup');
                }else {
                    //跳转路由
                    this.$router.back(-1)
                }
                
            }
		},
		activated(){
			this.wordHistory = this.getKeyWordHistory()
		},
		components: {
			[Search.name]: Search,
			[SrarchTag.name]: SrarchTag,
		}
	}
</script>


<style lang="scss" scoped>
	

	.item_search{
        background-color: #fff;
		.search_form {
			display: flex;
            justify-content: space-between;
            background-color: $background-color;
			.back_arrow {
                font-size: 1rem;
				padding-left: 10px;
				width: 1.2rem;
				line-height: 1.76rem;
			}
			.search_bar {
				width: 85%;
				height: 1.76rem;
				padding-left: 0;
            }
            
            
		}
		
	}
	.item_search_content{
		padding: 15px 10px 0;
	}
	.item_search_text{
		font-size: $sub-title-size;
		color: $main-title-color;
        margin-bottom: 0.6rem;
        &_icon {
            
        }
	}
	
	.item_search_history > span{
		margin-right: 10px;
		margin-bottom: 10px;
	}
</style>

<style lang="scss">
.item_search {
    height: 100%;
    .search_form {
        .search_bar {
            .van-field {
                background: #E8E8E8;
                .van-cell__left-icon {
                    color: $sub-title-color;
                }
                #placeholder {
                    color: $explain-text-color;
                }
            }
        }
         
    }
}
</style>

export default {
	data(){
		return {
			pages: {
				perPage: 10,
				currPage: 1,
				pageCount: 1              
            },
            has_more: false,
            change_route: false,            //标记改变过路由
			items: [],
			loading: false,
			finished: false,
			isEmpty: false,
		}
	},
	
	methods: {
		async resetInit(params){
            console.log('resetInit')
			this.resetData();
            //有总页数
			// const page = await this.initData();
			// this.$nextTick(() => {
			// 	this.setPages(page);
            // })
            //无总页数
            const has_more = await this.initData();
            this.$nextTick(() => {
                // _this.has_more = has_more;
				this.setPages(has_more);
            })

		},
		isFinished() {
            console.log('isFinished')
			this.finished = true;
			this.loading = false;
		},
		async loadMore() {
            console.log("loadmore");
            const vm = this;
            // console.log(vm.pages)
            //有总页数
			// if (vm.pages.pageCount < vm.pages.currPage) {
			// 	vm.$toast({
			// 		message: "没有更多了~",
			// 		position: "top"
			// 	});
			// 	vm.isFinished();
			// }else{
			// 	const page = await vm.initData(true);
			// 	vm.nextPage(page.pageCount);
            // }
            //无总页数
            console.log(vm.change_route)

            if(this.change_tab_action) {
                this.change_tab_action = false;
                this.loading = false;
                return
            }

            console.log(vm.change_route)
            
            if(vm.change_route) {
                //改变过路由
                vm.change_route = false;
            }else {
                //没有改变过路由
                if(vm.has_more) {
                    const has_more = await vm.initData();
                    vm.has_more = has_more;
                    vm.nextPage();
                }else {
                    vm.$toast({
                        message: "没有更多了~"
                    });
                    vm.isFinished();
                }
            }
			vm.loading = false;
		},
		nextPage(pageCount = 1){
            console.log('nextPage')
            this.pages.currPage += 1;
            //有总页数
            // this.pages.pageCount = pageCount;

		},
		setPages(has_more){
            console.log('setPages')
            //有总页数
			// this.isEmpty = (page.totalCount === 0);
			// if(page.totalCount <= this.pages.perPage){
			// 	//不满一页
			// 	this.isFinished();
			// }else{
			// 	//下一页
			// 	this.nextPage(page.pageCount);
            // }
            //无总页数
            if(!has_more){
				//不满一页
				this.isFinished();
			}else{
				//下一页
				this.nextPage();
            }
		},
		resetData(){
            console.log('resetData')
			this.items = [];
			this.pages = {
				perPage: 10,
				currPage: 1,
				pageCount: 1
			}
			this.loading = false;
			this.finished = false;
			this.isEmpty = false;
		}
	}
}
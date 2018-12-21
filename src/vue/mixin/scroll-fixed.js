// 滚动条记录， 适用于 keep-alive 组件
export default {
    data(){
        return {
            scrollTop: 0
        }
    },
    
    created() {
        this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
    },
    
    mounted(){
        const vm = this;
        let scroll_div = vm.$refs['scroll_view'];
        scroll_div.addEventListener('scroll', vm.$util.debounce(function() {
            vm.scrollTop = scroll_div.scrollTop;
        }, 50))
    },
    
    activated(){
        const vm = this;
        let scroll_div = vm.$refs['scroll_view'];
        scroll_div.scrollTop = this.scrollTop;
    },
    
    methods: {
        eventListen(isBind = true) {
            let scroll_div = this.$refs['scroll_view'];
            if (isBind) {
              scroll_div.addEventListener("scroll", this.scrollShowArrow);
            } else {
              scroll_div.removeEventListener("scroll", this.scrollShowArrow);
            }
        },
        scrollShowArrow() {
            let scroll_div = this.$refs['scroll_view']
            this.show_arrow = scroll_div.scrollTop > 120;
            //首页搜索框
            this.search_opacity = scroll_div.scrollTop / 200;
            //带分类的二级页
            if(document.querySelector('#tabs')) {
                //将tabs固定到顶部
                let offsetTop = document.querySelector('#tabs').offsetTop;
                if(scroll_div.scrollTop > offsetTop) {
                    this.fixed = true
                }else {
                    this.fixed = false;
                }
                //滚动时切换tab
                if(this.content_offsetTop_arr) {
                    for(let i = 0; i < this.content_offsetTop_arr.length; i++) {
                        if(scroll_div.scrollTop < this.content_offsetTop_arr[0]) {
                            //比最小的还小
                            this.active = 0;
                        }else if(scroll_div.scrollTop + 100 >= this.content_offsetTop_arr[i] && scroll_div.scrollTop < this.content_offsetTop_arr[i+1]) {
                            //总有最大值和最小值
                            this.active = i;
                        }else if(scroll_div.scrollTop + 100 >= this.content_offsetTop_arr[this.content_offsetTop_arr.length -1]) {
                            //比最大值要大
                            this.active = this.content_offsetTop_arr.length - 1;
                        }
                        
                    }
                }
            }
            
            
        },
        backTop() {
            let scroll_div = this.$refs['scroll_view']
            //回到顶部
            scroll_div.scrollTop = 0;
        },
    }

}
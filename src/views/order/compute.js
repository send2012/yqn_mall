//计算每组活动头的计算过程
export default {
	props: {
		
	},
	data(){
		return {
            tag_desc: [],           //每个活动的文本
            full_gift: {}           //满赠活动的赠品件数
		}
	},
	methods:{
		computeText() {
            //第一次进入时的计算
            let tag_desc = [];
            this.carts.map((item,index) => {
                if(item.typeid == 2) {
                    //赠送商品
                    let str = '购买此商品可赠送';
                    this.checkedGoods.map(i => {
                        item.pros.map((m,n) => {
                            if(i == m.pro_id) {
                                //商品列表的信息在选中的数组中
                                m.zplist.map(x => {
                                    str += x.title + ' '
                                })
                            }
                        })
                    })
                }else if(item.typeid == 3) {
                    //满减
                    //定义规则
                    let rule = item.rule.mx;
                    //定义初始组价格
                    let group_total = 0
                    this.checkedGoods.map(i => {
                        item.pros.map(m => {
                            if(i == m.pro_id) {
                                //商品列表的信息在选中的数组中
                                group_total += m.price * m.buynum;
                            }
                        })
                    })
                    if(item.rule.type == 0) {
                        //阶梯式
                        //阶梯状判断
                        if(group_total == 0) {
                            //未勾选中
                            tag_desc.push('购满'+ rule[0].money + '元，' + '可减' + rule[0].jian + '元');
                        }else if(group_total > Number(rule[rule.length-1].money)){
                            //大于规则的最大值
                            tag_desc.push('已购满'+ rule[rule.length-1].money + '元，' + '可减' + rule[rule.length-1].jian + '元');
                        }else {
                            //在区间内
                            for(let i = 0; i <= rule.length - 1; i++) {
                                if(group_total < Number(rule[i].money)) {
                                    tag_desc.push('购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元，'+ '还差' + (Number(rule[i].money) - group_total) + '元');
                                    return 
                                }else if(rule[i+1] && group_total < Number(rule[i+1].money) && group_total >= Number(rule[i].money)) {
                                    //多项规则
                                    tag_desc.push('已购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元，' + '再购' + (rule[i+1].money - group_total) + '元，' + '可减' + rule[i+1].jian + '元');
                                    return
                                }else if(!rule[i+1] && group_total >= Number(rule[i].money)) {
                                    //一项规则
                                    tag_desc.push('已购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元。');
                                    return
                                }
                            }
                        }
                        
                        
                    }else if(item.rule.type == 1) {
                        //每满减
                        if(group_total == 0) {
                            //未勾选中
                            tag_desc.push('每购满' + rule[0].money + '元，' + '可减' + rule[0].jian + '元')
                        }else if(group_total < Number(rule[0].money)){
                            //不足第一个每满减
                            tag_desc.push('每购满' + rule[0].money + '元，' + '可减' + rule[0].jian + '元，' + '还差' + (rule[0].money - group_total) + '元')
                        }else {
                            //定义可以减免的次数
                            let time = parseInt(group_total/rule[0].money);
                            tag_desc.push('已购满' + (rule[0].money * time) + '元，' + '已减' + (rule[0].jian * time) + '元，' + '再购' + (rule[0].money * (time+1) - group_total) + '元，' + '可减' + (rule[0].jian * (time+1)) + '元');
                        }
                        
                    }
                    
                }else if(item.typeid == 4) {
                    //满赠
                    //定义规则
                    let rule = item.rule.mx;
                    //定义初始组价格
                    let group_total = 0;
                    this.checkedGoods.map(i => {
                        item.pros.map(m => {
                            if(i == m.pro_id) {
                                //商品列表的信息在选中的数组中
                                group_total += m.price * m.buynum;
                            }
                        })
                    })
                    if(item.rule.type == 0) {
                        //阶梯式
                        //阶梯状判断
                        if(group_total == 0) {
                            //未勾选中
                            tag_desc.push('购满'+ rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件');
                            //赠送0件
                            let json = {};
                            json[index] = 0;
                            Object.assign(this.full_gift,json);
                        }else if(group_total > Number(rule[rule.length-1].money)){
                            //大于规则的最大值
                            tag_desc.push('已购满'+ rule[rule.length-1].money + '元，' + '可赠送以下商品' + rule[rule.length-1].num + '件');
                            //赠送rule[rule.length-1].num件
                            let json = {};
                            json[index] = rule[rule.length-1].num;
                            Object.assign(this.full_gift,json);
                        }else {
                            //在区间内
                            for(let i = 0; i <= rule.length - 1; i++) {
                                if(group_total < Number(rule[i].money)) {
                                    tag_desc.push('购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件，'+ '还差' + (Number(rule[i].money) - group_total) + '元');
                                    //赠送0件
                                    let json = {};
                                    json[index] = 0
                                    Object.assign(this.full_gift,json);
                                    return 
                                }else if(rule[i+1] && group_total < Number(rule[i+1].money) && group_total >= Number(rule[i].money)) {
                                    //有多项规则
                                    tag_desc.push('已购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件，' + '再购' + (rule[i+1].money - group_total) + '元，' + '可赠送以下商品' + rule[i+1].num + '件');
                                    //赠送rule[i].num件
                                    let json = {};
                                    json[index] = rule[i].num;
                                    Object.assign(this.full_gift,json);
                                    return
                                }else if(!rule[i+1] && group_total >= Number(rule[i].money)) {
                                    //只有一项规则
                                    tag_desc.push('已购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件。');
                                    //赠送rule[i].num件
                                    let json = {};
                                    json[index] = rule[i].num;
                                    Object.assign(this.full_gift,json);
                                    return
                                }
                            }
                        }
                        
                        
                    }else if(item.rule.type == 1) {
                        //每满增
                        if(group_total == 0) {
                            //未勾选中
                            tag_desc.push('每购满' + rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件')
                            //赠送0件
                            let json = {};
                            json[index] = 0;
                            Object.assign(this.full_gift,json);
                        }else if(group_total < Number(rule[0].money)){
                            //不足第一个每满赠
                            tag_desc.push('每购满' + rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件，' + '还差' + (rule[0].money - group_total) + '元')
                            //赠送0件
                            let json = {};
                            json[index] = 0;
                            Object.assign(this.full_gift,json);
                        }else {
                            //定义可以减免的次数
                            let time = parseInt(group_total/rule[0].money);
                            tag_desc.push('已购满' + (rule[0].money * time) + '元，' + '可赠送以下商品' + (rule[0].num * time) + '件，' + '再购' + (rule[0].money * (time+1) - group_total) + '元，' + '可赠送以下商品' + (rule[0].num * (time+1)) + '件');
                            //赠送rule[0].num * time件
                            let json = {};
                            json[index] = rule[0].num * time;
                            Object.assign(this.full_gift,json);
                        }
                        
                    }
                }else {
                    //普通商品或者折扣商品或其他
                    tag_desc.push('');
                }
            })
            this.tag_desc.push(...tag_desc)
        },
        computeFullSub(index) {
            //点击物流，数量，选中计算tag_title满减
            let item = this.carts[index];
            //定义规则
            let rule = item.rule.mx;
            //定义初始组价格
            let group_total = 0
            this.checkedGoods.map(i => {
                item.pros.map(m => {
                    if(i == m.pro_id) {
                        //商品列表的信息在选中的数组中
                        group_total += m.price * m.buynum;
                    }
                })
            })
            if(item.rule.type == 0) {
                //阶梯式
                //阶梯状判断
                if(group_total == 0) {
                    //未勾选中
                    this.tag_desc.splice(index,1,'购满'+ rule[0].money + '元，' + '可减' + rule[0].jian + '元');
                }else if(group_total > Number(rule[rule.length-1].money)){
                    //大于规则的最大值
                    this.tag_desc.splice(index,1,'已购满'+ rule[rule.length-1].money + '元，' + '可减' + rule[rule.length-1].jian + '元');
                }else {
                    //在区间内
                    for(let i = 0; i <= rule.length - 1; i++) {
                        if(group_total < Number(rule[i].money)) {
                            this.tag_desc.splice(index,1,'购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元，'+ '还差' + (Number(rule[i].money) - group_total) + '元');
                            return 
                        }else if(rule[i+1] && group_total < Number(rule[i+1].money) && group_total >= Number(rule[i].money)) {
                            //多项规则
                            this.tag_desc.splice(index,1,'已购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元，' + '再购' + (rule[i+1].money - group_total) + '元，' + '可减' + rule[i+1].jian + '元');
                            return
                        }else if(!rule[i+1] && group_total >= Number(rule[i].money)) {
                            //一项规则
                            this.tag_desc.splice(index,1,'已购满'+ rule[i].money + '元，' + '可减' + rule[i].jian + '元，' + '再购' + (rule[i+1].money - group_total) + '元，' + '可减' + rule[i+1].jian + '元');
                            return
                        }
                    }
                }
                
                
            }else if(item.rule.type == 1) {
                //每满减
                if(group_total == 0) {
                    //未勾选中
                    this.tag_desc.splice(index,1,'每购满' + rule[0].money + '元，' + '可减' + rule[0].jian + '元')
                }else if(group_total < Number(rule[0].money)){
                    //不足第一个每满减
                    this.tag_desc.splice(index,1,'每购满' + rule[0].money + '元，' + '可减' + rule[0].jian + '元，' + '还差' + (rule[0].money - group_total) + '元')
                }else {
                    //定义可以减免的次数
                    let time = parseInt(group_total/rule[0].money);
                    this.tag_desc.splice(index,1,'已购满' + (rule[0].money * time) + '元，' + '已减' + (rule[0].jian * time) + '元，' + '再购' + (rule[0].money * (time+1) - group_total) + '元，' + '可减' + (rule[0].jian * (time+1)) + '元');
                }
                
            }
        },
        computeFullGifts(index) {
            //点击物流，数量，选中计算tag_title满赠
            let item = this.carts[index];
            //定义规则
            let rule = item.rule.mx;
            //定义初始组价格
            let group_total = 0
            this.checkedGoods.map(i => {
                item.pros.map(m => {
                    if(i == m.pro_id) {
                        //商品列表的信息在选中的数组中
                        group_total += m.price * m.buynum;
                    }
                })
            })
            if(item.rule.type == 0) {
                //阶梯式
                //阶梯状判断
                if(group_total == 0) {
                    //未勾选中
                    this.tag_desc.splice(index,1,'购满'+ rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件');
                    //赠送0件
                    let json = {};
                    json[index] = 0;
                    Object.assign(this.full_gift,json);
                }else if(group_total > Number(rule[rule.length-1].money)){
                    //大于规则的最大值
                    this.tag_desc.splice(index,1,'已购满'+ rule[rule.length-1].money + '元，' + '可赠送以下商品' + rule[rule.length-1].num + '件');
                    //赠送rule[rule.length-1].num件
                    let json = {};
                    json[index] = rule[rule.length-1].num;
                    Object.assign(this.full_gift,json);
                }else {
                    //在区间内
                    for(let i = 0; i <= rule.length - 1; i++) {
                        if(group_total < Number(rule[i].money)) {
                            this.tag_desc.splice(index,1,'购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件，'+ '还差' + (Number(rule[i].money) - group_total) + '元');
                            //赠送0件
                            let json = {};
                            json[index] = 0;
                            Object.assign(this.full_gift,json);
                            return 
                        }else if(rule[i+1] && group_total < Number(rule[i+1].money) && group_total >= Number(rule[i].money)) {
                            //规则有两个以上
                            this.tag_desc.splice(index,1,'已购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件，' + '再购' + (rule[i+1].money - group_total) + '元，' + '可赠送以下商品' + rule[i+1].num + '件');
                            //赠送rule[i].num件
                            let json = {};
                            json[index] = rule[i].num;
                            Object.assign(this.full_gift,json);
                            return
                        }else if(!rule[i+1] && group_total >= Number(rule[i].money)) {
                            //规则只有一个
                            this.tag_desc.splice(index,1,'已购满'+ rule[i].money + '元，' + '可赠送以下商品' + rule[i].num + '件。');
                            //赠送rule[i].num件
                            let json = {};
                            json[index] = rule[i].num;
                            Object.assign(this.full_gift,json);
                            return
                        }
                    }
                }
                
                
            }else if(item.rule.type == 1) {
                //每满增
                if(group_total == 0) {
                    //未勾选中
                    this.tag_desc.splice(index,1,'每购满' + rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件')
                    //赠送0件
                    let json = {};
                    json[index] = 0;
                    Object.assign(this.full_gift,json);
                }else if(group_total < Number(rule[0].money)){
                    //不足第一个每满减
                    this.tag_desc.splice(index,1,'每购满' + rule[0].money + '元，' + '可赠送以下商品' + rule[0].num + '件，' + '还差' + (rule[0].money - group_total) + '元')
                    //赠送0件
                    let json = {};
                    json[index] = 0;
                    Object.assign(this.full_gift,json);
                }else {
                    //定义可以减免的次数
                    let time = parseInt(group_total/rule[0].money);
                    this.tag_desc.splice(index,1,'已购满' + (rule[0].money * time) + '元，' + '可赠送以下商品' + (rule[0].num * time) + '件，' + '再购' + (rule[0].money * (time+1) - group_total) + '元，' + '可赠送以下商品' + (rule[0].num * (time+1)) + '件');
                    //赠送rule[0].num * time件
                    let json = {};
                    json[index] = rule[0].num * time;
                    Object.assign(this.full_gift,json);
                }
                
            }
        }
	},
	components:{
		
	}
}
<template>
    <div class="ser_home">
        <ul class="red_packet" id="red_packet">
            <template v-for="(item, index) in liParams">
                <li 
                    :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime}"
                    :class="item.cls" 
                    @webkitAnimationEnd="removeDom" 
                    :key="index"
                    @click="clickPocket(index)"
                >
                    <a href='javascript:;'>
<!--                         <i :style="{ transform: item.transforms, webkitTransform: item.transforms}"></i> -->
                        <img :src="item.src" alt="" :style="{ transform: item.transforms, webkitTransform: item.transforms}" />
                    </a>
                </li>
            </template>
        </ul>
    </div>
</template>


<script>
import RED_POCKET_CLOSE from '@/assets/images/activity/red_pocket_rain/hb1.png';
import RED_POCKET_OPEN from '@/assets/images/activity/red_pocket_rain/hb2.png'

export default {
    data () {
        return {
            liParams: [],
            timer: null,
            duration: 10000 // 定义时间
        }
    },
    mounted () {
        this.startRedPacket()
    },
    methods: {
        /**
         * 开启动画
         */
        startRedPacket() {
            let win = document.documentElement.clientWidth || document.body.clientWidth
            let left = parseInt(Math.random() * (win - 50) + 0);
            
            let rotate = (parseInt(Math.random() * (45 - (-45)) - 45)) + "deg";  // 旋转角度
            let scales = (Math.random() * (12 - 8 + 1) + 8) * 0.1;  // 图片尺寸
            let durTime = (Math.random() * (2.5 - 1.2 + 1) + 1.2) + 's'; // 时间  1.2和1.2这个数值保持一样
//             console.log(durTime)
            let src = RED_POCKET_CLOSE;
            this.liParams.push({left: left+'px', cls: 'move_1', transforms: 'rotate('+ rotate +') scale('+ scales +')', durTime: durTime, src: src})

            setTimeout( () =>  {   // 多少时间结束
                clearTimeout(this.timer)
                return;
            }, this.duration)


            this.timer = setTimeout( () => {
                this.startRedPacket()
            },100)   
        },
        /**
         * 回收dom节点
         */
        removeDom (e) {
            let target = e.currentTarget;
//             document.querySelector('#red_packet').removeChild(target)
        },
        clickPocket(index) {
            //点击红包后切换图片
            console.log(index)
            this.liParams[index].src = RED_POCKET_OPEN;
        }
    }
}
</script>


<style lang="scss" scoped>
    .ser_home {
        width: 100%;
        padding-bottom: 0;
        background-image: url('../../../assets/images/activity/red_pocket_rain/hby_bg.jpg');
        background-repeat: no-repeat;
        background-size: contain;
    }
    .red_packet {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
        li {
            position: absolute;
            animation: all 3s linear;
            top:-100px;
            z-index: 10;
            width: 48px;
            height: 69px;
            &.move_1 {
                -webkit-animation: aim_move 5s linear 1 forwards;
                animation: aim_move 5s linear 1 forwards;
            }
            img {
                width: 100px;
                height: auto;
            }
            i {
                width: 48px;
                height: 69px;
                display: block;
                background: url('../../../assets/images/activity/red_pocket_rain/hb1.png') no-repeat;
            }
        }
    //     i {
    //         width: 48px;
    //         height: 69px;
    //         display: block;
    //         background: url('../../../assets/images/activity/red_pocket_rain/hb1.png') no-repeat;
    //     }
    //     li {
    //         position: absolute;
    //         animation: all 3s linear;
    //         top:-100px;
    //         z-index: 10;
    //         width: 48px;
    //         height: 69px;
    //         border: 1px solid #999;
    //         &.move_1 {
    //             -webkit-animation: aim_move 5s linear 1 forwards;
    //             animation: aim_move 5s linear 1 forwards;
    //         }
    //         i {
    //             width: 48px;
    //             height: 69px;
    //             display: block;
    //             background: url('../../../assets/images/activity/red_pocket_rain/hb1.png') no-repeat;
    //         }
    //     }
        a {     
            display: block;
        }
    }


    @keyframes aim_move {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
        100% {
            -webkit-transform: translateY(120vh);
            transform: translateY(120vh);
        }
    }


</style>
<template>
    <section class="agreement">
        <nav-bar title="法律声明及隐私权政策"
                 @back="backTo"
                 no_more
        />

        <div ref="scroll_view" class="scroll_view">
            <img class="agreement-content"
                 src="../../../assets/images/legal_agreement.png"
                 alt="法律声明及隐私权政策"
            />

            <transition name="fade">
                <!-- <van-icon
                          name="arrowupcircle"
                          class="backTop"
                          @click.native="backTop"
                          v-show="showArrow"
                      /> -->
                <img src="../../../assets/images/topup.png"
                     alt="返回顶部按钮"
                     class="yqn-backToTop"
                     @click="backTop"
                     v-show="show_arrow"
                />
            </transition>
        </div>
    </section>
</template>

<script>
    import NavBar from '@/vue/components/NavBar/';

    import scrollFixed from "@/vue/mixin/scroll-fixed";

    export default {
        name: "agreement",

        mixins: [scrollFixed],

        data() {
            return {
                show_arrow: false
            }
        },

        // created() {
        //     this.scrollShowArrow = this.$util.throttle(this.scrollShowArrow, 100);
        // },

        activated() {
            this.eventListen(true);
        },

        deactivated() {
            this.eventListen(false);
        },

        methods: {
            backTo() {
                this.$router.back(-1);
            },
        },

        components: {
            [NavBar.name]: NavBar,
        },
    }
</script>

<style lang="scss" scoped>
    .agreement {
        padding: 0 .2rem;

        .scroll_view
        {
            height: 100%;
            overflow-y: auto;

            .agreement-content {
                width: 100%;
                height: auto;
            }
        }
    }
</style>

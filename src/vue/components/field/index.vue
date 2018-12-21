<template>
	<div class="md_field" :class="{md_field_hasIcon: !!icon, md_field_isError: isError}">
		<van-icon v-if="icon" :name="icon" class="md_feld_icon"/>
		<div class="md_field_control">
			<input 
				:type="type" 
				v-on="listeners"
				v-bind="$attrs"
				:value="value"
				:placeholder="placeholder" />
		</div>
		<div>
			<slot name="rightIcon">
				<van-icon :name="rightIcon" @click="rightClick" v-show="value" />
			</slot>
		</div>

		<div v-if="sendMsg">
			<slot name="sendMsg">
				<van-button :name="sendMsg" slot="button" size="small" type="warning" plain @click="countDown" class="sendMsg_btn">{{sendMsg_text}}</van-button>
			</slot>
		</div>
	</div>	
</template>

<script>
    
	export default {
		name: 'md-field',
		
		props: {
			value: {},
			type: {
				type: String,
				default: "text"
			},
			rightIcon: String,
			sendMsg: String,
			icon: String,
			isError: Boolean,
            placeholder: String,
            mobile: {
                type: [String, Number],
                default: ''
            }
		},
		data () {
			return {
                sendMsg_text: '获取验证码',
                timer: null,                        //计时器
				disabled: false						//发送验证码按钮是否可用
			}
		},
		computed: {
			listeners() {
			  return {
				...this.$listeners,
				input: this.onInput,
			  };
			}
		},
		
		methods: {
			onInput(event){
				this.$emit('input', event.target.value);
			},
			rightClick(event){
				this.$emit('right-click');
			},
			countDown() {
                if(this.mobile) {
                    if(this.sendMsg_text === '获取验证码') {
                        //调用发送验证码
                        this.$emit('mobileCode');
                        this.sendMsg_text = '59秒';
                        let num = 59;
                        this.timer = setInterval(()=>{
                            num--;
                            this.sendMsg_text = num + '秒';
                            if(num === 0) {
                                clearInterval(this.timer);
                                this.sendMsg_text = '获取验证码';
                                this.disabled = false;
                            };

                        },1000)
                    }else {
                        this.$toast("请勿频繁获取验证码");
                    }
                }else {
                    this.$emit('mobileCode');
                }
				
            },
            clearTimer() {
                //清除计时器
                clearInterval(this.timer);
                this.sendMsg_text = '获取验证码';
                this.disabled = false;
            }
		},
	}

</script>


<style lang="scss" scoped>
	.md_field {
		position: relative;
		border-bottom: 1px solid $border-color;
		border-radius: 5px;
		padding-top: 10px;
		padding-bottom: 10px;
		padding-left: 10px;
		display: table;
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		>div {
			display: table-cell;
		}
		>.md_field_control {
			padding-right: 10px;
			box-sizing: border-box;
			input {
				border: 0;
				line-height: 1.32rem;
				font-size: 14px;
				width: 100%;
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
                color:    $explain-text-color;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                color:    $explain-text-color;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
                color:    $explain-text-color;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
                color:    $explain-text-color;
            }
		}

		.md_feld_icon {
			position: absolute;
			top: 50%;
            left: 10px;
            font-size: $main-title-size;
			transform: translate(0, -50%);
		}
		.sendMsg_btn {
            width: 3.08rem;
            font-size: $extra-size;
            color: $main-color;
            padding: 0;
		}
	}
	
	.md_field_hasIcon{
		padding-left: 40px;
	}
	
	.md_field_isError{
		color: $red;
		background-color: #fcf5f5;
		border: 1px solid $red;
		input{
			color: $red;
			background-color: #fcf5f5;
		}
		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0 1000px #fcf5f5 inset !important;
		}
	}

</style>

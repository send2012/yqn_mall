<template>
	<div class="md_field" :class="{md_field_hasIcon: !!icon, md_field_isError: isError}">
        <span class="required" v-if="required">*</span><label class="md_field_label">{{label}}<span class="little_label">{{little_label}}</span></label> 
		<van-icon v-if="icon" :name="icon" class="md_feld_icon"/>
		<div class="md_field_control logis_field_control">
            <!-- 输入框 -->
			<input 
                v-if="formType === 'input'"
				:type="type" 
				v-on="listeners"
				v-bind="$attrs"
				:value="value"
				:placeholder="placeholder" />
            <!-- 下拉框 -->
            <select id="sendSybol" v-model="value" v-if="formType === 'select'">   
                <option value="" style="display: none">{{placeholder}}</option>
                <option  
                    v-for="(send, index)  in selectList" 
                    :key="index"
                    name="sendSymbolId" 
                    :value="send.id"
                    @click="selectEvent" >
                    {{send.value}}
                </option>
            </select>
            <!-- <input 
                v-if="formType === 'select'"
				:type="type" 
				v-on="listeners"
				v-bind="$attrs"
				:value="value"
                readonly
				:placeholder="placeholder"
                @click="()=>{show = !show}" />

            <van-popup 
                v-model="show" 
                position="bottom">
                <van-picker :columns="selectList" @change="onChange" />
            </van-popup> -->

            <!-- 多选框 -->
            <van-checkbox-group v-model="result" class="checkGroup" @change="checkEvent" v-if="formType === 'checkGroup'">
                <van-checkbox
                    v-for="(item, index) in list"
                    :key="item"
                    :name="index"
                    shape="square"
                    class="checkItem"
                >
                    {{ item }}
                </van-checkbox>
            </van-checkbox-group>

            <!-- 步进器 -->
            <van-stepper
                v-if="formType === 'stepper'"
                v-model="value"
                integer
                :min="min"
                :max="max"
                :step="step"
            />


            <!-- 文本域 -->
            <textarea 
                v-if="formType === 'textarea'"
                row="3"
				v-on="listeners"
				v-bind="$attrs"
				:value="value"
				:placeholder="placeholder"
                class="textarea" />

            <!-- 上传图片 -->
            <div class="uploadGroup" v-if="formType === 'uploadGroup'">
                <div class="uploadItem" v-for="(item,index) in 2" :key="index">
                    <!-- <van-uploader  :after-read="onRead.bind(this,index)"  class="upload"  >
                        <span></span>
                        <span></span>
                        <span>图片上传</span>
                    </van-uploader> -->
                    
                   
                    <div class="upload" >
                        
                        <div class="uploadimg">
                            <img :src="imgsrc[index]" v-show="imgsrc[index]" alt="">
                        </div>
                        <vue-core-image-upload
                            class="user_avatar_uploader"
                            text=""
                            :crop="false"
                            :maxWidth="200"
                            inputOfFile="file"
                            @imageuploading="imageuploading"
                            @imageuploaded="imageuploaded"
                            :credentials="false"
                            :data="data"
                            :headers="headers"
                            @click.native="uploadImages(index)"
                            :url="url" >
                        </vue-core-image-upload>
                        <span class="upload_H" v-show="!imgsrc[index]"></span>

                        <span class="upload_V" v-show="!imgsrc[index]"></span>

                        <span class="upload_T" v-show="imgsrc[index]" v-on:click="deletimg(index)">
                         <van-icon name="yqn_delete"  />   删除
                        </span>
                    </div>
                    
                </div>
                <div class="notice"> 最多上传2张图片</div>
            </div>
            
            <!-- 其他 -->

            <slot name="extra" />
            
		</div>
		<div class="rightIcon">
			<slot name="rightIcon">
				<van-icon :name="rightIcon" @click="rightClick" v-show="value" />
			</slot>
		</div>

		<div v-if="sendMsg" class="send_msg">
			<slot name="sendMsg">
				<van-button :name="sendMsg" slot="button" size="small" type="warning" plain @click="countDown" class="sendMsg_btn">{{sendMsg_text}}</van-button>
			</slot>
		</div>

        <div v-if="extra_text" class="extra_text">
            {{extra_text}}
        </div>
	</div>	
</template>

<script>
    import area_list from '../../../../mock/area-list.js'
    import { Popup, Checkbox, CheckboxGroup, Uploader, Picker, Stepper } from 'vant';
    import VueCoreImageUpload from 'vue-core-image-upload'
	export default {
		name: 'logis-field',
		
		props: {
            required: {
                type: String,
                default: ''
            },
            label: String,
			value: {
                default: ''
            },
			type: {
				type: String,
				default: "text"
            },
            little_label: String,
			rightIcon: String,
			sendMsg: String,
			icon: String,
			isError: Boolean,
            placeholder: String,
            formType: String,
            //下拉框数据
            selectList: {
                type: Array,
                default: []
            },
            //多选框选项
            list: Array,
            //上传文件组下面的文字
            uploadGroupText: Array,
            //额外文字
            extra_text: String,
            //步进器
            max: Number,
            min: {
                type: Number,
                default: 1
            },
            step: {
                type: Number,
                default: 1
            }
		},
		data () {
            let Authorization = localStorage.getItem('Authorization');
            let basic_url = this.getApi();
            let app = this.$util.checkTheTerminalHeader();
			return {
				sendMsg_text: '发送验证码',
                disabled: false,						//发送验证码按钮是否可用
                show: false,                             //省市区下拉框    
                areaList: area_list || {},                      //省市区数据
                result: [],
                current_num:0,
                value: '',
                imgsrc:[0,0],                              //退款图片链接
                uploadimgsrc:[0,0],  
                headers: {
                    Authorization,
                    app
                },
                url: basic_url + '/sys/upfile',
                data: {
                    path: 'refund',
                    back_size: 'small',
                },
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
        
        watch: {
            value() {
                if(this.formType === 'select') {              
                    this.$emit("selectSEvent",this.value);
                }else if(this.formType === 'stepper') {
                    this.$emit("stepperEvent",this.value);
                }
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
				if(this.sendMsg_text === '发送验证码') {
					this.sendMsg_text = '59秒';
					let num = 59;
					let time = setInterval(()=>{
						num--;
						this.sendMsg_text = num + '秒';
						if(num === 0) {
							clearInterval(time);
							this.sendMsg_text = '发送验证码';
							this.disabled = false;
						};

					},1000)
				}else {
					this.$toast("请勿频繁获取验证码");
				}
				
            },
            getApi() {
                let local_pro = window.location.href;
                if (local_pro.match(/newmobile.yqn.com/g)) {
                    //本地服务器
                    return '//api.yqn.com/shop';
                } else if (local_pro.match(/m.yqnmy.com/g)) {
                    //外网测试服务器
                    return '//api.yqnmy.com/shop'
                } else if (local_pro.match(/m.naifenpifa168.com/g)) {
                    return '//api.naifenpifa168.com/shop';
                } else {
                    // return 'http://lhl.service.heyzhima.com'
                    // return '//api.yqn.com/shop'
                    return 'https://api.yqnmy.com/shop'
                }
            },
            selectEvent(value) {
                console.log(1)
                console.log(this.value)
                this.$emit("selectSEvent",value);
            },
            checkEvent(value) {
                this.$emit("checkEvent",value);
            },
            onRead(index,file) {
                console.log(index);
                console.log(file)
            },
            // 当图片上传过程中触发
            imageuploading() {
                this.$toast.loading({
                    mask: true,
                    duration: 0,
                    position: 'middle'
                });
            },
            imageuploaded(res) {
            //上传图片插件(压缩型)
            // this.$set(this.index_info,'logopic',res.data.url);if (res.code === 200) 
                this.$toast.clear();
                this.imgsrc.splice(this.current_num,1,res.data.url)
                this.uploadimgsrc.splice(this.current_num,1,res.data.path)
                let data=[]
                data.push(this.uploadimgsrc[this.current_num])
                data.push(this.current_num)
                this.$emit('imgurl',data)
            },
            deletimg(index){
                this.imgsrc.splice(index,1,0)
                this.uploadimgsrc.splice(index,1,0)
                let data=[]
                data.push(0)
                data.push(index)
                this.$emit('imgurl',data)
            },
            uploadImages(index) {
                this.current_num = index;
                // console.log(index);
            },
            onChange(picker, value, index) {
                this.$toast(`当前值：${value}, 当前索引：${index}`);
            }
        },
        components: {
            [Popup.name]: Popup,
            [Picker.name]: Picker,
            [Checkbox.name]: Checkbox,
            [CheckboxGroup.name]: CheckboxGroup,
            [Uploader.name]: Uploader,
            [Stepper.name]: Stepper,
            'vue-core-image-upload': VueCoreImageUpload,
        }
        
	}

</script>


<style lang="scss" scoped>
	
	
	.md_field {
		position: relative;
		// border-bottom: 1px solid $border-color;
		border-radius: 5px;
		padding: 10px;
		display: table;
		width: 100%;
		box-sizing: border-box;
        background-color: #fff;
        font-size: 12px;
        display: flex;
        // align-items: center;
        .user_avatar_uploader{
            width: 100%;
            height: 100%;
        }
        .uploadimg{
            position: absolute;
            left: 0;right: 0;
            top: 0;bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            img{
                width: 100%;
                height: 100%;
            }
        }
        &_label {
            padding-top: .32rem;
        }
        .little_label {
            margin-left: 5px;
            font-size: 12px;
        }
        span.required {
            color: red;
            font-size: 150%;
        }
		>div {
			display: table-cell;
		}
		>.md_field_control {
            display: inline-block;
			padding-right: 10px;
            box-sizing: border-box;
            // width: 60%;
			input {
				background-image: none;
                border: 1px solid #ccc;
                padding: 0 0 0 12px;
                border-radius: 4px;
				line-height: 34px;
				font-size: 14px;
				width: 100%;
            }
            select {
                height: 34px;
                padding: 6px 12px;
                color: #555;
                background-image: none;
                appearance:none;
                -moz-appearance:none;
                -webkit-appearance:none;
                border: 1px solid #ccc !important;
                border-radius: 4px;
                background: #fff;
                outline: none;
            }
            
            .checkGroup {
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;
                .checkItem {
                    display: inline-block;
                    font-size: 12px;
                    width: 25%;
                    margin-bottom: 5px;
                }
                
            }
            .textarea {
                width: 100%;
                padding: 0 0 0 12px;
                height: 60px;
                resize: none;
                font-size: 13px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .uploadGroup {
                margin-top: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                padding-bottom: 2rem;
                .notice{
                    color: #FF6600 !important;
                }
                .uploadItem {
                    // height: 4.5rem;
                    margin-right: .5rem;
                    .upload {
                        // width: 100%;
                        // line-height: 32px;
                        // padding: 0 5px;
                        // border: 1px solid #CECECE;
                        // text-align: center;
                        // color: #fff;
                        // background-image: linear-gradient(to bottom,#5bc0de 0,#2aabd2 100%);
                        // background-repeat: repeat-x;
                        // border-color: #28a4c9;
                        // border-radius: 4px;
                        // i {
                        //     font-size: 40px;
                        //     line-height: 80px;
                        // }
                        width: 2.28rem;
                        height: 2.28rem;
                        border: 1px dashed #CECECE;
                        text-align: center;
                        position: relative;
                        &_H {
                            position: absolute;
                            left: 22%;
                            top: 49%;
                            width: 1.4rem;
                            height: 0;
                            /* border: 1px dashed rgba(0,0,0,.4); */
                            border: 1px dashed #cecece;
                            /* background-color: #000; */
                        }

                        &_V {
                            position: absolute;
                            left: 23%;
                            top: 48%;
                            width: 1.4rem;
                            height: 0;
                            /*border: 1px dashed rgba(0,0,0,.4);*/
                            border: 1px dashed #cecece;
                            transform: rotate(90deg);
                        }

                        &_T {
                            position: absolute;
                            left: .1rem;
                            bottom: -1rem;
                            display: inline-block;
                            width: 100%;
                            text-align: center;
                            font-size: $extra-size;
                            color: $explain-text-color;
                            .van-icon{
                                font-size: 14px !important;
                                color:#FE0101 !important;
                            }
                        }
                        // span {
                        //     margin:0 auto;      
                        //     &:nth-child(1) {
                        //         width: 50%;
                        //         height: 1px;
                        //         left: 25%;
                        //         top: 50%;
                        //     }
                        //     &:nth-child(2) {
                        //         top: 25%;
                        //         left: 50%;
                        //         width: 1px;
                        //         height: 50%;
                        //     }
                        //     &:nth-child(3) {
                        //         display: inline-block;
                        //         background: transparent;
                        //         bottom: -.88rem;
                        //         left: 18%;
                        //         font-size: $extra-size;
                        //         color: #666666;
                        //         background: #C2C2C2;
                        //     }
                        // }
                        
                    }
                    // span {
                    //     margin-top: 5px;
                    //     display: inline-block;
                    //     width: 100%;
                    //     text-align: center;
                    //     font-size: 12px;
                    //     color: #B2B2B2;
                    // }
                }
                
            }
            
		}

		.md_feld_icon {
			position: absolute;
			top: 50%;
			left: 10px;
			transform: translate(0, -50%);
        }
        .rightIcon {
            position: absolute;
            bottom: 20px;
            right: 20px;
        }
        .send_msg {
            position: absolute;
            bottom: 20px;
            right: 20px;
            .sendMsg_btn {
                width: 5.5rem;
            }
        }
        .extra_text {
            display: block !important;
            width: 100%;
            word-break: break-all;
            margin-top: 10px;
            font-size: 12px;
            color: #B2B2B2;
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


<style lang="scss">
    //全局样式覆盖
    .logis_field_control {
        input::-webkit-input-placeholder {
            font-size: 13px;
        }
        .van-checkbox__icon {
            .van-icon {
                width: auto;
                height: auto;
                line-height: normal;
            }
        } 
        .van-checkbox__icon--checked {
            .van-icon {
                color: #fff;
                border-color: #FF6C19;
                background-color: #FF6C19;
            }
        } 
    }
</style>


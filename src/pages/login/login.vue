<template>
    <div id="login">
        <div class="content" @keyup.tab="changeFocus" @keyup.enter="login">
            <div class="inputBox" :class="!focusIndex?'border':''" @click="getFocus(0)">
                <img src="/static/img/ic_blue_mail.png" height="24">
                <input type="text" placeholder="邮箱" v-focus="!focusIndex" v-model="emailName">
                <span>@mobstazinc.com</span>
            </div>
            <div class="inputBox" :class="focusIndex?'border':''" @click="getFocus(1)">
                <img src=" /static/img/ic_blue_code.png" height="24">
                <input type="text" placeholder="token" v-focus="focusIndex" v-model="code">
                <span :class="codeBtnCanClick?'getCode':''" @click="getCode">{{codeText}}</span>
            </div>
            <p style="color: rgba(255,255,255,0.7);background: rgba(0, 0, 0, 0.4);position: relative;top: -22px;">
                token 有效期2000s
            </p>
            <div class="login" @click="login">
                <p :class="canLogin?'canLogin':''">{{canLogin?'登录':'请先输入邮箱名与验证码'}}</p>
            </div>
        </div>
    </div>
</template>

<script>
    // import { Message } from 'element-ui';
    export default {
        name: "login",
        data() {
            return {
                emailName: "",
                code: "",
                codeText: '点击获取token',
                codeBtnCanClick: true,
                Email: '',
                focusIndex: 0,
                canLogin: false,
            }
        },

        watch: {
            emailName(newVal, oldVal) {
                if (newVal && this.code) {
                    this.canLogin = true;
                } else {
                    this.canLogin = false;
                }
            },
            code(newVal, oldVal) {
                if (this.emailName && newVal) {
                    this.canLogin = true;
                } else {
                    this.canLogin = false;
                }
            }
        },

        mounted() {
            this.getFocus(0);
        },
        methods: {
            login() {
                if (this.canLogin) {
                    localStorage.setItem('token', this.code);
                    this.$router.push('/chart');
                } else {
                    this.err();
                }
            },
            getCode() {
                localStorage.clear('token');
                if (!this.codeBtnCanClick) return;
                this.codeBtnCanClick = false;
                this.clock(3);

                this.$ajax.get('/getToken', {
                    url: '/getToken',
                    baseURL: process.env.API_BASEURL,
                    params: {
                        user: this.emailName,
                    }
                }).then((res) => {
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                })

            },
            //倒计时
            clock(time) {
                this.codeText = time + 's后可重新获取';
                let interval = setInterval(() => {
                    if (time <= 0) {
                        this.codeText = '点击获取token';
                        this.codeBtnCanClick = true;
                        clearInterval(interval);
                    } else {
                        time--;
                        this.codeText = time + 's后可重新获取';
                    }
                }, 1000);
            },

            getFocus(index) {
                //触发自定义事件focus;
                this.focusIndex = -1;
                this.focusIndex = index;
            },

            changeFocus() {
                if (this.focusIndex == 0) {
                    this.focusIndex = 1
                }
            },

            err() {
                this.$message({
                    showClose: true,
                    message: '请先验证邮箱再进行登录',
                    type: 'error'
                });
            }
        }
    }
</script>

<style scoped>


    #login {
        width: 100vw;
        height: 100vh;
        background: url("/static/img/bg_login.jpg") center no-repeat;
        background-size: cover;
        padding-top: 0.1px;
    }

    .content {
        border-radius: 6px;
        text-align: center;
        width: 340px;
        padding: 26px;
        margin: 30vh auto;
        background: rgba(255, 255, 255, 0.5);
    }

    .content > div {
        border-radius: 4px;
        margin: 24px auto;
        box-sizing: border-box;
        color: white;
        overflow: hidden;
    }

    .inputBox {
        background: white;
        padding: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1.5px solid #c5cddb;
    }

    .inputBox:hover {
        border: 1.5px solid rgba(0, 0, 0, 0.4);
    }

    .border {
        border-color: #47a9f8;
    }

    .border:hover {
        border-color: #47a9f8;
    }

    .getCode {
        cursor: pointer;
    }

    .getCode:hover {
        color: #47a9f8;
    }

    .inputBox img {
        margin: 6px;
    }

    .inputBox span {
        /*background: #dce2ea;*/
        color: rgb(0, 0, 0);
        color: #616161;
        width: 145px;
        line-height: 40px;
        padding: 0px 6px;
    }

    input {
        margin: 0px;
        height: 40px;
        line-height: 40px;
        width: 150px;
        margin-left: 6px;
        background: transparent;
        border: none;
        outline: none;
        font-size: 16px;
        font-weight: bold;
        color: #000000;
    }

    .login {
        padding: 0px;
    }

    .login p {
        background: rgba(0, 0, 0, 0.4);
        border-radius: 6px;
        margin: 0px;
        width: 100%;
        height: 44px;
        line-height: 44px;
        cursor: not-allowed;
    }

    .login .canLogin {
        background: #47A9f8;
        cursor: pointer;
    }

    .login .canLogin:hover {
        background: #3182d9;
    }


</style>

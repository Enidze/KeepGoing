<template>
    <div>
        <nav class="header">
            <div class="myNav">
                <a href="#/home" class="homeBtn">Keep Going</a>
                <ul>
                    <li v-for="data in pathPages">
                        <router-link :to="data.path">{{data.text}}</router-link>
                    </li>
                </ul>
                <div class="loReBox">
                    <div v-if="userInfo">
                        <el-popover
                                placement="top-start"
                                width="200"
                                trigger="hover"
                                :content="'账号：'+userInfo.username">
                            <el-button slot="reference" @click="toPersonalPage">我</el-button>
                        </el-popover>
                        <a @click="exit">退出</a>
                    </div>
                    <div v-else>
                        <a @click="login">登录</a>
                        <a href="#/register">注册</a>
                    </div>
                </div>

            </div>
        </nav>
        <div class="bg" v-if="showLogin">
            <div class="background"></div>
            <div class="form">
                <div class="formHeader">
                    Keep Going | 登录
                    <i class="el-icon-close" @click="close"></i>
                </div>
                <Login></Login>
            </div>
        </div>
    </div>
</template>

<script>
  import router from '../router'
  import { exit, userInfo } from '../api'
  import Login from '../components/Login.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'Header',
    router,
    components: {
      Login
    },
    data() {
      return {
        showLogin: false
      }
    },
    computed: {
      ...mapState(['userInfo', 'pathPages']),
      path() {
        return this.$route.fullPath
      }
    },
    methods: {
      login() {
        this.showLogin = true
      },
      close() {
        this.showLogin = false
      },
      toPersonalPage() {
        window.localStorage.user === 'root' ? $(window).attr('location', '/#/system/courses') : $(window).attr('location', '/#/personalPage/home')
      },
      async exit() {
        let param = {
          id: this.userInfo.id
        }
        let { data: res } = await exit(param)
        if (res === 'success') {
          delete window.localStorage.id
          delete window.localStorage.user
          delete window.localStorage.token
          this.$router.go(0)
        } else {
          console.log('error')
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .header {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 4;
        width: 100%;
        background-color: #000;
        height: 50px;
        line-height: 50px;
        overflow: hidden;

        .myNav {
            width: 1000px;
            margin: 0 auto;

            .homeBtn {
                margin-left: 20px;
                font-weight: bold;
                font-size: 20px;
            }

            .loReBox {
                display: inline-block;
                float: right;
                margin-right: 100px;
                color: #ffffff;
            }

            .el-button {
                border: 0;
                background-color: transparent;
            }

            a, .el-button {
                text-decoration: none;
                padding: 0 10px;
                color: #fff;
            }

            a:hover {
                color: #FF5555;
                cursor: pointer;
            }


            ul {
                display: inline;
                margin: 0 auto;

                li {
                    display: inline;
                    margin-left: 100px;
                }
            }
        }
    }

    .bg {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 3;

        .background {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #000000;
            opacity: 0.3;
        }

        .form {
            width: 600px;
            background-color: #ffffff;
            opacity: 1;
            border-radius: 5px;
            box-shadow: 0 0 15px #888;
            position: absolute;
            z-index: 4;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);

            .formHeader {
                line-height: 50px;
                background-color: #333333;
                font-size: 25px;
                color: #ffffff;
                text-align: center;
                padding: 20px;
                position: relative;

                i {
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 10px;
                }

                i:hover {
                    color: #FF5555;
                    cursor: pointer;
                }
            }
        }
    }
</style>
<template>
    <div>
        <div class="login">
            <el-form :model="userInfo" status-icon :rules="rules" ref="userInfo" class="demo-ruleForm">
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="userInfo.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('userInfo')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from "../api";
    import PubSub from 'pubsub-js'

    export default {
        name: "Login",
        data(){
            let validateUSer = (rule,value,callback)=>{
                if (value===''){
                    callback(new Error('请输入账号'));
                }else {
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return{
                userInfo:{
                    username:'',
                    password:''
                },
                rules: {
                    username: [
                        { validator: validateUSer, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let {data:res} = await login(this.userInfo);
                        // console.log(res);
                        if(res.token){
                            window.localStorage.token = res.token;
                            window.localStorage.user = res.username;
                            window.localStorage.id = res.id;
                            this.$message('登录成功');
                            this.$router.go(0);
                        }else {
                            this.$message.error('账号不存在或密码错误');
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .el-form {
        margin: 50px 0;
        text-align: center;

        .el-button {
            margin-top: 30px;
        }
    }
</style>
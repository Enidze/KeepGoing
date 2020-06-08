<template>
    <div>
        <div class="register">
            <div class="outBox">
                <div class="head">
                    注册
                </div>
                <el-form :model="userInfo" status-icon :rules="rules" ref="userInfo" class="demo-ruleForm">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model.number="userInfo.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="userInfo.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="againPassword">
                        <el-input type="password" v-model="userInfo.againPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('userInfo')">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {register,login} from "../api";

    export default {
        name: 'register',
        data() {
            let validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else if (!new RegExp(/^[a-zA-Z]\w{4,19}$/).test(value)) {
                    callback(new Error('账号由字母开头，长度为5-20位，可包含数字、字母、下划线。'));
                } else {
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (!new RegExp(/^[0-9a-zA-Z]{5,19}$/).test(value)) {
                    callback(new Error('密码由数字、字母组成，长度为6-20位'));
                } else {
                    if (this.userInfo.againPassword !== '') {
                        this.$refs.userInfo.validateField('againPassword');
                    }
                    callback();
                }
            };
            let validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userInfo.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return{
                userInfo:{
                    username:'',
                    password:'',
                    againPassword:''
                },
                rules:{
                    username: [
                        { validator: validateUser, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    againPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            if (window.localStorage.user){
                $(window).attr('location', '/#/home');
            }
        },
        methods:{
            submitForm(formName){
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        let {data:res} = await register(this.userInfo);
                        if (res === 'success'){
                            this.$message('注册成功');
                            let {data:res} = await login(this.userInfo);
                            // console.log('register->login response:'+res);
                            if(res!=='error'){
                                window.localStorage.token = res.token;
                                window.localStorage.id = res.id;
                                window.localStorage.user = res.username;
                                this.$router.go(0);
                            }else {
                                console.log('error');
                            }
                        }else if (res === 'exist'){
                            this.$message.error('该账号名已被注册');
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
    .register{
        height: 750px;
        padding: 50px;
        .outBox{
            margin: 0 auto;
            width: 800px;
            box-shadow: 0 0 5px #d9d9d9;
            .head{
                text-align: center;
                line-height: 100px;
                font-size: 25px;
                color: #ffffff;
                background-color: #333333;
            }
            .el-form{
                text-align: center;
                margin: 0 auto;
                padding: 50px 0;
                width: 300px;
                .el-button{
                    margin-top: 50px;
                }
            }
        }
    }
</style>
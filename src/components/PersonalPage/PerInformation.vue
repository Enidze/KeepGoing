<template>
    <div>
        <div class="perInformation">
            <div class="header">
                <span>我的信息</span>
            </div>
            <!--账号名 性别 身高 体重 出生日期-->
            <el-form
                    :model="info"
                    status-icon
                    :rules="rules"
                    ref="info"
                    label-width="80px">
                <el-form-item label="头像" prop="picture">
                    <el-upload
                            class="avatar-uploader image"
                            action="http://localhost:3000/uploader?fileDir=userImages"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <el-image v-if="info.picture" :src="info.picture" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="账号" prop="username">
                    <el-input type="text" v-model="info.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-radio-group v-model="info.gender">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                        <el-radio label="保密"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身高" prop="height">
                    <el-select v-model="info.height" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in heightList"
                                :key="index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="体重" prop="weight">
                    <el-select v-model="info.weight" placeholder="请选择">
                        <el-option
                                v-for="(item,index) in weightList"
                                :key="index"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                    <el-date-picker
                            v-model="info.birth"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-button type="primary" @click="submitForm('info')">提交</el-button>
            </el-form>
        </div>
    </div>
</template>

<script>
  import { userInfo } from '../../api'
  import { getImageUrlAndCover } from '../../js/func'
  import { mapState } from 'vuex'

  export default {
    name: 'PerInformation',
    created() {
      this.info = JSON.parse(JSON.stringify(this.userInfo))
    },
    data() {
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          this.info.username = window.localStorage.user
          callback(new Error('请输入账号'))
        } else if (!new RegExp(/^[a-zA-Z]\w{4,19}$/).test(value)) {
          callback(new Error('账号由字母开头，长度为5-20位，可包含数字、字母、下划线。'))
        } else {
          callback()
        }
      }
      return {
        heightList: ['140以下', '140-150', '150-160', '160-170', '170-180', '180-190', '190-200', '200以上'],
        weightList: ['35KG以下', '35-40', '40-45', '45-50', '50-55', '55-60', '60-70', '70KG以上'],
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ]
        },
        /*修改的信息*/
        info: null,
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let { data: res } = await userInfo('select', this.info)
            /*如果没有重复的返回的是[]*/
            if (res.length && res[0].username !== this.info.username) {
              this.$message({
                message: '该账号名已被使用，请重新填写',
                type: 'warning'
              })
            } else {
              let { data: res } = await userInfo('update', this.info)
              if (res) {
                this.$message('已成功修改')
                this.$router.go(0)
              } else {
                console.log('error')
              }
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      handleAvatarSuccess(res, file) {
        let object = getImageUrlAndCover(res, file, 'userImages')
        this.info.picture = object.cover
      },
      beforeAvatarUpload(file) {
        const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
        const isLt4M = file.size / 1024 / 1024 < 4
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!')
        }
        if (!isLt4M) {
          this.$message.error('上传头像图片大小不能超过 4MB!')
        }
        return isJPG && isLt4M
      }
    },
    computed: {
      ...mapState(['userInfo']),
      getInfoPicture(){
        this.info = JSON.parse(JSON.stringify(this.userInfo))
        return this.info.picture
      }
    },
  }
</script>

<style scoped src="../../css/personalPage.less">
</style>
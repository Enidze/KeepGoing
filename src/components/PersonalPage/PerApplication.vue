<template>
    <div>
        <div class="perApplication">
            <div class="header">
                <span>我的办理</span>
            </div>
            <div class="card" v-if="userInfo.applyIsCoach&&!applicationShow">
                <div class="info">
                    <span>姓名：{{userInfo.applyName}}</span>
                    <span>办理内容：{{userInfo.applyIsCoach==='true'?userInfo.applyCoachCourse+'（'+userInfo.applyCoach+'）':'普通健身'}}</span>
                    <div v-if="userInfo.applyDate">
                        <span>办理日期：{{userInfo.applyDate}}</span>
                        <span>到期时间：{{userInfo.applyDeadline}}{{IsOverdue(userInfo)}}</span>
                        <span>编号：{{userInfo.applyId}}</span>
                    </div>
                    <span v-else style="color: #FF5555">该服务还未生效</span>
                </div>
                <el-image :src="imgSrc"></el-image>
            </div>
            <el-button @click="showApplication" v-if="IsOverdue(userInfo)&&!applicationShow">办理服务</el-button>
            <div class="noApply" v-if="!userInfo.applyIsCoach && !applicationShow">
                <span>您还没有办理我们的服务哦(*･ω-q)</span>
                <el-button @click="showApplication">办理服务</el-button>
            </div>
            <el-form
                    class="apply"
                    ref="applyForm"
                    :rules="rules"
                    :model="applyForm"
                    label-width="100px"
                    v-if="applicationShow">
                <el-form-item label="姓名" prop="applyName">
                    <el-input
                            v-model="applyForm.applyName"
                            placeholder="请输入您的真实姓名">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否选择教练">
                    <el-switch v-model="applyForm.applyIsCoach"></el-switch>
                </el-form-item>
                <el-form-item label="教练" v-if="applyForm.applyIsCoach" prop="applyCoach">
                    <el-select v-model="applyForm.applyCoach" placeholder="请选择">
                        <el-option
                                v-for="coach in coachList"
                                :label='coach.name'
                                :value='coach.name'>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="课程" v-if="applyForm.applyIsCoach&&applyForm.applyCoach" prop="applyCoachCourse">
                    <el-select v-model="applyForm.applyCoachCourse" placeholder="请选择">
                        <el-option
                                v-for="course in getCourseList"
                                :label='course'
                                :value='course'>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="期效" prop="applyDuration">
                    <el-select v-model="applyForm.applyDuration" placeholder="请选择">
                        <el-option
                                v-for="duration in durations"
                                :label='duration.label'
                                :value='duration.value'>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="费用">
                    <span>{{costCount}}元</span>
                </el-form-item>
                <el-button type="primary" @click="submitForm('applyForm')">提交</el-button>
            </el-form>
            <div class="tipBox">
                <div class="tip">
                    <h5>温馨提示</h5>
                    <span> * 提交办理时请填写真实姓名，以便前往前台确认信息认证。 </span>
                    <span> * 生效时间从您到前台确认信息并缴费之日算起，请勿担心。 </span>
                    <span> * 建议您在提交申请后五个工作日内前往前台确认信息。 </span>
                    <span> * 前台工作时间为：周一到周五 上午9:00-11:00 下午14:00-16:00。 </span>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
  import { coach, userApply, userInfo } from '../../api'
  import { overdue } from '../../js/func'
  import cardBackground from '../../img/cardBackground.jpg'
  import { mapState } from 'vuex'

  export default {
    name: 'PerApplication',
    data() {
      let validateApplyName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入您的真实姓名'))
        } else if (!new RegExp(/^[\u4e00-\u9fa5a-zA-Z]{2,16}$/).test(value)) {
          callback(new Error('请输入您的中文或英文名，长度为2-16位。'))
        } else {
          callback()
        }
      }
      return {
        applyForm: {
          userName: window.localStorage.user,
          applyName: '',
          applyDuration: '',
          applyIsCoach: false,
          applyCoach: '',
          applyCoachCourse: '',
          applyCost: 0
        },
        durations: [
          { label: '一个月', value: 1 },
          { label: '一季度', value: 3 },
          { label: '半年', value: 6 },
          { label: '一年', value: 12 }
        ],
        coachList: {},
        coachCourseList: [],
        rules: {
          applyName: [
            { validator: validateApplyName, trigger: 'blur' }
          ],
          applyCoach: [
            { required: false, message: '请选择教练', trigger: 'change' }
          ],
          applyCoachCourse: [
            { required: false, message: '请选择课程', trigger: 'change' }
          ],
          applyDuration: [
            { required: true, message: '请选择期效', trigger: 'change' }
          ]
        },
        applicationShow: false
      }
    },
    async created() {
      let { data: res } = await coach('select', null)
      if (res) {
        this.coachList = res
      }
      this.applyForm = JSON.parse(JSON.stringify(this.userInfo))
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let { data: res } = await userApply(this.applyForm)
            if (res) {
              this.$alert('您的申请已提交，请在一个星期内前往健身房前台确认信息。', '提交成功', {
                confirmButtonText: '确定',
                callback: () => {
                  this.$router.go(0)
                }
              })
            } else {
              console.log('error')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      showApplication() {
        this.applicationShow = true
      }
    },
    computed: {
      ...mapState(['userInfo']),
      /*获取教练对应授课信息*/
      getCourseList() {
        for (let index in this.coachList) {
          this.coachList[index].name === this.applyForm.applyCoach ? this.coachCourseList = this.coachList[index].courses.split(',') : null
        }
        return this.coachCourseList
      },
      /*计算费用*/
      costCount() {
        this.applyForm.applyCost = 0
        if (this.applyForm.applyDuration) {
          this.applyForm.applyCost = this.applyForm.applyDuration * 100
          if (this.applyForm.applyCoach) {
            this.applyForm.applyCost += this.applyForm.applyDuration * 50
          }
          this.applyForm.applyCost = this.applyForm.applyCost * 0.9
        }
        return this.applyForm.applyCost
      },
      /*判断办理是否已经过期*/
      IsOverdue() {
        return function(userInfo) {
          if (userInfo.applyDate) {
            if (overdue(userInfo.applyDeadline)) {
              return '(已过期)'
            }
            return null
          }
        }
      },
      imgSrc() {
        return cardBackground
      }
    },
    watch: {
      'applyForm.applyIsCoach': function() {
        if (this.applyForm.applyIsCoach){
          this.rules.applyCoach[0].required = this.applyForm.applyIsCoach
          this.rules.applyCoachCourse[0].required = this.applyForm.applyIsCoach
        }else{
          this.applyForm.applyCoach = null
          this.applyForm.applyCoachCourse = null
        }
      }
    }
  }
</script>

<style scoped src="../../css/personalPage.less">
</style>
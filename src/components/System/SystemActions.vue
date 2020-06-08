<template>
    <div>
        <div class="systemActions">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm('添加',null)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
                <div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索（名称）"
                              @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search" @click="search"></i>
                </div>
            </el-row>
            <el-table
                    :data="show"
                    stripe
                    ref="multipleSelection"
                    @selection-change="handleSelectionChange"
                    @filter-change="filterTagTable">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column prop="name" label="名称">
                </el-table-column>
                <el-table-column
                        prop="type"
                        label="类型"
                        :filters="list.type"
                        :filter-multiple="false"
                        column-key='type'
                        filter-placement="bottom-end">
                    <template scope="scope">
                        <el-tag disable-transitions>{{scope.row.type}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="level"
                        label="级别"
                        :filters="list.level"
                        :filter-multiple="false"
                        column-key='level'
                        filter-placement="bottom-end">
                    <template scope="scope">
                        <el-tag disable-transitions>{{scope.row.level}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="mainMuscle"
                        label="主要肌肉群"
                        :filters="list.mainMuscle"
                        :filter-multiple="false"
                        column-key='mainMuscle'
                        show-overflow-tooltip
                        filter-placement="bottom-end">
                    <template scope="scope">
                        <el-tag disable-transitions>{{scope.row.mainMuscle}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="otherMuscle"
                        label="其他肌肉"
                        :filters="list.otherMuscle"
                        :filter-multiple="false"
                        column-key='otherMuscle'
                        filter-placement="bottom-end"
                        width="250">
                    <template scope="scope">
                        <el-tag v-for="otherMuscle in scope.row.otherMuscle"
                                disable-transitions>{{otherMuscle}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="equip" label="器械要求">
                </el-table-column>
                <el-table-column prop="times" label="训练次数">
                </el-table-column>
                <el-table-column label="操作" prop="id" width="250">
                    <template scope="scope">
                        <el-button icon="el-icon-search"
                                   @click="showVideo(scope.row)"></el-button>
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('修改',scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([scope.row])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <Paging :pages="pages" @func="pagingBack"></Paging>
            <!--点击查看 观看该动作的视频-->
            <div class="bg" v-if="videoShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        动作：{{actionInfo.name}}
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <video :src="actionInfo.video" autoplay loop class="videoFromSA"></video>
                </div>
            </div>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        {{operate}}课程
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-form
                            label-position="right"
                            label-width="100px"
                            :model="actionInfo">
                        <el-form-item label="名称">
                            <el-input v-model="actionInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="器械">
                            <el-input v-model="actionInfo.equip"></el-input>
                        </el-form-item>
                        <el-form-item label="建议训练次数">
                            <el-input v-model="actionInfo.times"></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select
                                    v-model="actionInfo.type"
                                    placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in list.type"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="级别">
                            <el-select
                                    v-model="actionInfo.level"
                                    placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in list.level"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="主要肌肉群">
                            <el-select
                                    v-model="actionInfo.mainMuscle"
                                    placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in list.mainMuscle"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="其他肌肉群">
                            <el-select
                                    multiple
                                    collapse-tags
                                    v-model="actionInfo.otherMuscle"
                                    placeholder="请选择（三个及以下）"
                                    multiple-limit="3">
                                <el-option
                                        v-for="(item,index) in list.otherMuscle"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value"
                                        :disabled="otherMuscleDisabled[index]">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传" v-if="operate==='添加'">
                            <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    action="http://localhost:3000/uploader?fileDir=actionVideos"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :on-exceed="handleExceed"
                                    :limit="1">
                                <el-button size="small" type="primary" class="el-button">点击上传
                                </el-button>
                                <div slot="tip" class="el-upload__tip">只能上传mp4视频文件，且不超过5Mb</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">提交</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { action, course, courseDate } from '../../api'
  import Paging from '../Paging.vue'
  import { getImageUrlAndCover, showList, filter } from '../../js/func.js'
  import { clear } from '../../js/func'
  import { mapState } from 'vuex'

  export default {
    name: 'SystemActions',
    data() {
      return {
        /*分页所用的变量*/
        show: [], // 当前页显示的数据
        page: 0, // 当前显示第几页
        pages: 0, // 一共有多少页
        /*显示所有数据所用的变量*/
        actions: [], // 获取到的所有数据
        /*form表单所用的数据*/
        otherMuscleDisabled: [],
        searchData: '',
        multipleSelection: [],
        filterList: {
          type: '',
          level: '',
          mainMuscle: '',
          otherMuscle: ''
        },
        actionInfo: {},
        formShow: false,
        videoShow: false,
        operate: ''
      }
    },
    created() {
      /*获取所有数据*/
      this.loading('select', null)
      this.$nextTick(() => {
        $('.systemActions').css({ pointerEvents: 'auto' })
      })
    },
    components: {
      Paging
    },
    computed: {
      ...mapState(['list'])
    },
    methods: {
      async loading(op, param) {
        let { data: res } = await action(op, param)
        if (res) {
          this.actions = res
          for (let index in this.actions) {
            if (!this.actions.hasOwnProperty(index)) continue
            this.actions[index].otherMuscle = this.actions[index].otherMuscle.split('、')
          }
        } else {
          this.actions = []
        }
        this.page = 1
        this.$nextTick(() => {
          this.pagingBack(this.page)
        })
      },
      pagingBack(data) {
        this.pages = Math.ceil(this.actions.length / 20)
        this.show = showList(data, this.actions, 20)
        this.multipleSelection = []
      },
      showForm(opera, item) {
        this.formShow = true
        this.operate = JSON.parse(JSON.stringify(opera))
        if (item) {
          this.actionInfo = JSON.parse(JSON.stringify(item))
        }
      },
      showVideo(item) {
        this.videoShow = true
        if (item) {
          this.actionInfo = JSON.parse(JSON.stringify(item))
        }
      },
      async search() {
        if (this.searchData) {
          this.loading('select', { data: this.searchData })
        } else {
          this.loading('select', null)
        }
      },
      async submitForm() {
        let operate = this.operate === '添加' ? 'insert' : 'update'
        this.actionInfo.otherMuscle = this.actionInfo.otherMuscle.toString().replace(/,/g, '、')
        for (let key in this.actionInfo) {
          if (!this.actionInfo.hasOwnProperty(key)) continue
          if (!this.actionInfo[key] && key !== 'id') {
            this.$message.error('请填写完全！')
            return
          }
        }
        for (let index in this.actions) {
          if (!this.actions.hasOwnProperty(index)) continue
          if (operate === 'update' && this.actions[index].name === this.actionInfo.name) continue
          if (this.actionInfo.name === this.actions[index].name) {
            this.$message.error('该动作视频信息已存在，请重新填写！')
            this.clear()
            return
          }
        }
        let { data: res } = await action(operate, this.actionInfo)
        console.log(res)
        if (res) {
          this.$message(`${this.operate}成功！`)
          this.$router.go(0)
        }
      },
      async del(delItem) {
        let ids = []
        let names = []
        let courses = []
        for (let index in delItem) {/*遍历所有选中的项*/
          if (!delItem.hasOwnProperty(index)) continue
          let { data: res } = await courseDate('select', { actions: delItem[index].name })
          for (let i in res) {/*遍历第一项匹配到的所有course*/
            if (!res.hasOwnProperty(i)) continue
            if (index === '0' && i === '0') courses.push(`${res[i].course}`)
            for (let j in courses) {/*遍历courses*/
              if (!courses.hasOwnProperty(j)) continue
              if (courses[j] === res[i].course) break
              if (parseInt(j) === courses.length - 1) {
                courses.push(`${res[i].course}`)
              }
            }
          }
          ids.push(delItem[index].id)
          if (parseInt(index) < 4) {/*只保留前四个*/
            names.push(`“${delItem[index].name}”`)
          }
        }
        let str = names.toString().replace(/,/g, '、')
        if (delItem.length >= 5) {
          str += `等${delItem.length}个`
        }
        let str2 = courses.toString().replace(/,/g, '、')
        let confirmText = [
          `是否确认删除  ${str} 动作的信息?`,
          courses.length ? `注意：有 ${courses.length} 个课程使用了这些动作！` : null
        ]
        let h = this.$createElement
        let newData = []
        for (let index in confirmText) {
          newData.push(h('p', null, confirmText[index]))
        }
        this.$confirm('提示',
          {
            title: '提示',
            message: h('div', null, newData),
            /*`是否确认删除动作视频${str}的信息?`,`${warn?warn:null}`*/
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
          let { data: res } = await action('delete', { id: ids.toString() })
          if (res) {
            this.$message(`动作视频${str}的信息已成功删除！`)
            this.$router.go(0)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      filterTagTable(filters) {
        this.filterList = filter(filters, this.list, this.filterList)
        this.loading('select', this.filterList)
      },
      close() {
        this.formShow = false
        this.videoShow = false
        clear(this.actionInfo)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleExceed() {
        this.$message.warning('仅能上传一个文件')
      },
      handleAvatarSuccess(res, file) {
        this.actionInfo.video = getImageUrlAndCover(res, file, 'actionVideos').cover
      },
      beforeAvatarUpload(file) {
        const isMP4 = file.type === 'video/mp4'
        const isLt = file.size / 1024 / 1024 < 5

        if (!isMP4) {
          this.$message.error('上传视频只能是 MP4 格式!')
        }
        if (!isLt) {
          this.$message.error('上传视频大小不能超过 5MB!')
        }
        return isMP4 && isLt
      }
    },
    watch: {
      'actionInfo.otherMuscle': function() {
        /*情况1-选择了“无”*/
        if (this.actionInfo.otherMuscle[0] === '无') {
          this.otherMuscleDisabled.push(false)
          for (let index in this.list.otherMuscle) {
            this.otherMuscleDisabled.push(true)
          }
          /*情况2-什么都还没选*/
        } else if (this.actionInfo.otherMuscle.length === 0) {
          this.otherMuscleDisabled = []
          /*情况3-选择了其他的，要将“无”设为disabled*/
        } else {
          this.otherMuscleDisabled = [true]
        }
      }
    }
  }
</script>

<style scoped lang="less" src="../../css/system.less">
</style>
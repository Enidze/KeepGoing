<template>
    <div>
        <div class="systemCourses">
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
                <el-table-column
                        type="selection">
                </el-table-column>
                <el-table-column prop="cover" label="封面" width="250">
                    <template scope="scope">
                        <el-image :src="scope.row.cover" class="w200-h100"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="250">
                </el-table-column>
                <el-table-column prop="equip" label="器械" width="150">
                </el-table-column>
                <el-table-column
                        prop="strong"
                        label="强度"
                        :filters="list.strong"
                        :filter-multiple="false"
                        column-key='strong'
                        filter-placement="bottom-end" width="100">
                    <template slot-scope="scope">
                        <el-tag disable-transitions>{{scope.row.strong}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="part"
                        label="部位"
                        :filters="list.part"
                        :filter-multiple="false"
                        column-key='part'
                        filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag v-for="part in scope.row.part"
                                disable-transitions>{{part}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="id" width="180">
                    <template scope="scope">
                        <el-button type="primary" icon="el-icon-edit"
                                   @click="showForm('修改',scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([show[scope.$index]])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Paging :pages="pages" @func="pagingBack"></Paging>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        {{operate}}课程
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-form label-position="right" label-width="80px" :model="courseInfo">
                        <el-form-item label="名称">
                            <el-input v-model="courseInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="器械">
                            <el-input v-model="courseInfo.equip"></el-input>
                        </el-form-item>
                        <el-form-item label="强度">
                            <el-select
                                    v-model="courseInfo.strong"
                                    style="margin-left: 20px;"
                                    placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in list.strong"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部位">
                            <el-select
                                    multiple
                                    collapse-tags
                                    v-model="courseInfo.part"
                                    style="margin-left: 20px;"
                                    placeholder="请选择（三个及以下）"
                                    multiple-limit="3">
                                <el-option
                                        v-for="(item,index) in list.part"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="封面">
                            <el-upload
                                    class="avatar-uploader"
                                    action="http://localhost:3000/uploader?fileDir=courseImages"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                <el-image v-if="imageUrl" :src="imageUrl" class="avatar"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
  import { course } from '../../api'
  import Paging from '../Paging.vue'
  import { getImageUrlAndCover, showList, filter } from '../../js/func.js'
  import { clear } from '../../js/func'
  import { mapState } from 'vuex'

  export default {
    name: 'SystemCourses',
    data() {
      return {
        courses: [],
        show: [],
        page: 0,
        pages: 0,
        searchData: '',
        multipleSelection: [],
        courseInfo: {},
        imageUrl: '',
        operate: '',
        formShow: false,
        filterList: {
          strong: '',
          part: ''
        }
      }
    },
    components: {
      Paging
    },
    computed: {
      ...mapState(['list'])
    },
    async created() {
      this.loading('select', null)
      this.$nextTick(() => {
        $('.systemCourses').css({ pointerEvents: 'auto' })
      })
    },
    methods: {
      async loading(op, param) {
        let { data: res } = await course(op, param)
        if (res) {
          this.courses = res
          for (let index in this.courses) {
            if (!this.courses.hasOwnProperty(index)) continue
            this.courses[index].part = this.courses[index].part.split('、')
          }
        }
        this.page = 1
        this.pages = Math.ceil(this.courses.length / 10)
        this.$nextTick(() => {
          this.pagingBack(this.page)
        })
      },
      pagingBack(data) {
        this.show = showList(data, this.courses, 10)
        this.multipleSelection = []
      },
      async search() {
        if (this.searchData) {
          this.loading('select', { data: this.searchData })
        } else {
          this.loading('select', null)
        }
      },
      showForm(opera, item) {
        this.formShow = true
        this.operate = opera
        if (opera === '修改') {
          /*因为是引用传递而不是值传递，所以不能直接赋值，先转为string在转为object*/
          this.courseInfo = JSON.parse(JSON.stringify(item))
          this.imageUrl = this.courseInfo.cover
        }
      },
      async submitForm() {
        let operate = this.operate === '添加' ? 'insert' : 'update'
        this.courseInfo.part = this.courseInfo.part.toString().replace(/,/g, '、')
        for (let key in this.courseInfo) {
          if (!this.courseInfo.hasOwnProperty(key)) continue
          if (!this.courseInfo[key] && key !== 'id') {
            this.$message.error('请填写完全！')
            return
          }
        }
        for (let index in this.courses) {
          if (!this.courses.hasOwnProperty(index)) continue
          if (operate === 'update' && this.courses[index].name === this.courseInfo.name) continue
          if (this.courseInfo.name === this.courses[index].name) {
            this.$message.error('该课程信息已存在，请重新填写！')
            this.clear()
            return
          }
        }
        let { data: res } = await course(operate, this.courseInfo)
        if (res) {
          this.$message(`${this.operate}成功！`)
          this.$router.go(0)
        }
      },
      del(delItem) {
        let ids = []
        let names = []
        for (let index in delItem) {
          if (!delItem.hasOwnProperty(index)) continue
          ids.push(delItem[index].id)
          names.push(delItem[index].name)
        }
        let str = names.toString().replace(/,/g, '、')
        this.$confirm(`是否确认删除课程${str}的信息?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let { data: res } = await course('delete', { id: ids.toString() })
          if (res) {
            this.$message(`课程${str}的信息已成功删除！`)
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
        clear(this.courseInfo)
        this.imageUrl = ''
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleAvatarSuccess(res, file) {
        let obj = getImageUrlAndCover(res, file, 'courseImages')
        this.imageUrl = obj.imageUrl
        this.courseInfo.cover = obj.cover
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
    }
  }
</script>

<style scoped lang="less" src="../../css/system.less">

</style>
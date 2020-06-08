<template>
    <div>
        <div class="systemArticles">
            <el-row>
                <el-button type="primary" icon="el-icon-plus" circle @click="showForm"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle @click="del(multipleSelection)"></el-button>
                <span v-show="multipleSelection.length">&nbsp;&nbsp;&nbsp;已选&nbsp;{{multipleSelection.length}}&nbsp;个</span>
                <div class="search">
                    <el-input type="text" v-model="searchData" placeholder="搜索（文章标题）"
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
                <el-table-column prop="cover" label="封面图片" width="220">
                    <template scope="scope">
                        <el-image :src="scope.row.cover" class="w200-h100"></el-image>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="sort"
                        label="类型"
                        :filters="list.sort"
                        :filter-multiple="false"
                        column-key="sort"
                        filter-placement="bottom-end"
                        width="100">
                    <template scope="scope">
                        <el-tag disable-transitions>{{scope.row.sort}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="fileName" label="文章标题" width="300">
                </el-table-column>
                <el-table-column prop="inter" label="内容" width="500">
                    <template scope="scope">
                        <span class="articleInter">{{scope.row.inter}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="author" label="上传者">
                </el-table-column>
                <el-table-column prop="id" label="操作" width="170">
                    <template scope="scope">
                        <el-button icon="el-icon-search"
                                   @click="showArticle(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   @click="del([scope.row])"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Paging :pages="pages" @func="pagingBack"></Paging>
            <div class="bg" v-if="formShow">
                <div class="background"></div>
                <div class="form">
                    <div class="formHeader">
                        添加健身知识文章
                        <i class="el-icon-close" @click="close"></i>
                    </div>
                    <el-form label-position="right" label-width="100px" :model="articleInfo">
                        <el-form-item label="标题">
                            <el-input type="text" v-model="fileName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="articleInfo.sort" placeholder="请选择" class="elsSelect">
                                <el-option
                                        v-for="(item,index) in list.sort"
                                        :key="index"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上传封面图片">
                            <el-upload class="avatar-uploader"
                                       action="http://localhost:3000/uploader?fileDir=articleImages"
                                       :show-file-list="false"
                                       :on-success="handleAvatarSuccess"
                                       :before-upload="beforeAvatarUpload">
                                <el-image v-if="imageUrl" :src="imageUrl" class="avatar"
                                          style="object-fit: cover;"></el-image>
                                <i v-else class="el-icon-plus avatar-uploader-icon"
                                   style="border: 1px dashed #aaa"></i>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="上传文章文件">
                            <el-upload
                                    class="upload-demo"
                                    ref="upload"
                                    action="http://localhost:3000/uploader?fileDir=articleFiles"
                                    :before-upload="beforeAvatarUpload2"
                                    :on-exceed="handleExceed"
                                    :limit="1">
                                <el-button size="small" type="primary" class="el-button">点击上传
                                </el-button>
                                <div slot="tip" class="el-upload__tip">只能上传DOCX视频文件，且不超过15Mb</div>
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
  import { articles } from '../../api'
  import Paging from '../Paging.vue'
  import { clear, filter, getImageUrlAndCover, showList } from '../../js/func'
  import { mapState } from 'vuex'

  export default {
    name: 'SystemArticles',
    data() {
      return {
        articles: [],
        pages: 0,
        page: 0,
        show: [],
        searchData: '',
        imageUrl: '',
        multipleSelection: [],
        articleInfo: {},
        fileName:'',
        formShow: false
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
        $('.systemArticles').css({ pointerEvents: 'auto' })
      })

    },
    methods: {
      async loading(op, param) {
        let { data: res } = await articles(op, param)
        if (res) {
          this.articles = res
        }
        this.page = 1
        this.pages = Math.ceil(this.articles.length / 10)
        this.$nextTick(() => {
          this.pagingBack(this.page)
        })
      },
      pagingBack(data) {
        this.show = showList(data, this.articles, 10)
        this.multipleSelection = []
      },
      showForm() {
        this.formShow = true
      },
      showArticle(item) {
        // articleHref(item.sort,item.id);
        window.open(`/#/article/${item.sort}-${item.id}`)
      },
      async search() {
        if (this.searchData) {
          this.loading('select', { fileName: this.searchData })
        } else {
          this.loading('select', null)
        }
      },
      async submitForm() {
        for (let key in this.articleInfo) {
          if (!this.articleInfo.hasOwnProperty(key)) continue
          if (!this.articleInfo[key] && key !== 'id') {
            this.$message.error('请填写完全！')
            return
          }
        }
        for (let index in this.articles) {
          if (!this.articles.hasOwnProperty(index)) continue
          if (this.articleInfo.fileName === this.articles[index].fileName) {
            this.$message.error('该健身知识文章已存在，请重新上传！')
            return
          }
        }
        this.articleInfo.author = window.localStorage.user
        let { data: res } = await articles('insert', this.articleInfo)
        if (res) {
          this.$message({
            message: `文章《${this.articleInfo.fileName}》上传成功！`,
            type: 'success'
          })
          this.$router.go(0)
        }
      },
      del(delItem) {
        let ids = []
        let names = []
        if (!delItem.length) return
        for (let index in delItem) {
          if (!delItem.hasOwnProperty(index)) continue
          ids.push(delItem[index].id)
          names.push(`《${delItem[index].fileName}》`)
        }
        let str = names.toString().replace(/,/g, '、')
        this.$confirm(`是否确认删除文章${str}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let { data: res } = await articles('delete', { id: ids.toString() })
          if (res) {
            this.$message({
              message: `文章${str}已成功删除！`,
              type: 'success'
            })
            this.$router.go(0)
          }
        }).catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
      },
      filterTagTable(filters) {
        this.loading('select', filter(filters, this.list, { sort: '' }))
      },
      close() {
        this.formShow = false
        clear(this.articleInfo)
        this.imageUrl = ''
        this.fileName = ''
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      handleAvatarSuccess(res, file) {
        let object = getImageUrlAndCover(res, file, 'articleImages')
        this.imageUrl = object.imageUrl
        this.articleInfo.cover = object.cover
      },
      beforeAvatarUpload(file) {
        const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
        const isLt = file.size / 1024 / 1024 < 4

        if (!isJPG) {
          this.$message.error('封面图片只能是 JPG 和 PNG 格式!')
        }
        if (!isLt) {
          this.$message.error('封面图片大小不能超过 4MB!')
        }
        return isJPG && isLt
      },
      beforeAvatarUpload2(file) {
        let suffix = file.name.split('.').pop()
        const isDocx = suffix === 'docx'
        const isLt = file.size / 1024 / 1024 < 15

        if (!isDocx) {
          this.$message.error('文章文档只能是 DOCX 格式!')
        }
        if (!isLt) {
          this.$message.error('文章文档大小不能超过 15MB!')
        }
        this.articleInfo.fileName = file.name.replace('.docx', '')
        this.fileName = this.articleInfo.fileName
        return isDocx && isLt
      },
      handleExceed() {
        this.$message.warning('仅能上传一个文件')
      }
    }
  }
</script>

<style scoped src="../../css/system.less">

</style>
<template>
    <div v-loading="loading"
    element-loading-text="文章加载中..请稍后"
    element-loading-spinner="el-icon-loading"
    element-loading-background="#F2F2F2">
        <div class="article">
            <div class="art">
                <div class="title">
                    {{article.fileName}}
                    <span class="author">上传者：{{article.author}}</span>
                </div>
                <div class="contentArticle">
                    <span class="htmlText" v-html="content"></span>
                </div>
                <el-button class="collectArticles" @click="collect" :disabled="btnDisabled">
                    {{collectState}}
                </el-button>
            </div>
            <div class="articleListSmall">
                <h3 class="sort">{{article.sort}}</h3>
                <a v-for="value_2 in list" class="page" @click="clickA(value_2)">
                    <img :src="value_2.cover" :alt="value_2.fileName">
                    <span>{{value_2.fileName}}</span>
                    <p>{{value_2.inter}}……</p>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
  import { article, articles, userCollect, userInfo } from '../../api'
  import { articleHref, collect } from '../../js/func'
  import { mapState } from 'vuex'

  function get5RandomNum(maxNum) {
    let numList = []
    let index = 1
    while (index <= 5) {
      let randomNumber = Math.ceil((Math.random() * maxNum))
      for (let i in numList) {
        if (!numList.hasOwnProperty(i)) continue
        if (numList[i] === randomNumber || randomNumber > maxNum) {
          break
        }
      }
      numList.push(randomNumber)
      index += 1
    }
    return numList
  }

  export default {
    name: 'Article',
    data() {
      return {
        id: parseInt(this.$route.path.match(/\/article\/.*-(.*)/)[1]),
        article: {},
        list: [],
        loading: true,
        show: false,
        collectState: '收藏文章',
        btnDisabled: false,
        content:''
      }
    },
    async created() {
      let { data: articleInfo } = await articles('select', { id: this.id })
      if (articleInfo) {
        this.article = articleInfo[0]
      }

      /*加载文章内容，添加到html标签中*/
      let { data: content } = await article({ sort: this.article.sort, fileName: this.article.fileName })
      if (content) {
        // $('.htmlText')[0].innerHTML = content.replace(this.article.fileName, '')
        this.content = content
      }
      let { data: res2 } = await articles('select', { sort: `'${this.article.sort}'` })
      if (res2) {
        for (let i = 0; i < 5; i++) {
          this.list.push(res2[i])
        }
      }
      this.$nextTick(() => {
        let p = $('p')
        p.css({ textIndent: '2em' })
        p.find('img').css({
          margin: '20px auto',
          display: 'block',
          maxHeight: '500px',
          maxWidth: '500px',
          objectFit: 'cover'
        })
        this.loading = false
        $('.article').css({ opacity: 1 })
      })

      if (this.userInfo && this.userInfo.collectArticles) {
        for (let index in this.userInfo.collectArticles) {
          if (!this.userInfo.collectArticles.hasOwnProperty(index)) continue
          if (parseInt(this.userInfo.collectArticles[index].id) === this.id) {
            this.collectState = '已收藏'
            this.btnDisabled = true
          }
        }
      }
    },
    methods: {
      async collect() {
        if (this.userInfo) {
          let { data: res } = await userCollect('collectArticles', {
            id: collect(this.userInfo.collectArticles, true, this.id),
            username: window.localStorage.user
          })
          if (res) {
            this.$message({
              message: `文章《${this.article.fileName}》收藏成功`,
              type: 'success'
            })
            this.$router.go(0)
          }
        } else {
          this.$message.error('您还未登录！')
        }
      },
      clickA(item) {
        articleHref(item.sort, item.id)
      }
    },
    computed: {
      ...mapState(['userInfo'])
    }
  }
</script>

<style scoped lang="less" src="../../css/knowledge.less">
</style>
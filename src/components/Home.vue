<template>
    <div>
        <div class="home">
            <div class="sliverBg">
                <div class="sliver">
                    <el-carousel height="600px">
                        <el-carousel-item v-for="item in 4" :key="item">
                            <img :src="imgSrc('home'+item)" :alt="item">
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <el-row class="inter">
                <el-col class="courses">
                    <div class="title">
                        {{pathPages[0].text}}
                        <a :href="'/#'+pathPages[0].path">更多<i class="el-icon-plus"></i></a>
                    </div>
                    <div class="course">
                        <a v-for="course in courses" @click="clickCourse(course)">
                            <span>{{course.name}}</span>
                            <img :src="course.cover" :alt="course.name">
                        </a>
                    </div>
                </el-col>
                <el-col class="articles">
                    <div class="title">
                        {{pathPages[1].text}}
                        <a :href="'/#'+pathPages[1].path">更多<i class="el-icon-plus"></i></a>
                    </div>
                    <div class="article">
                        <a v-for="article in articles" class="page" @click="clickArticle(article)">
                            <img :src="article.cover" :alt="article.cover">
                            <span>{{article.fileName}}</span>
                            <p>{{article.inter}}……</p>
                        </a>
                    </div>
                </el-col>
                <el-col class="sorts">
                    <div class="title">
                        {{pathPages[2].text}}
                        <a :href="'/#'+pathPages[2].path">更多<i class="el-icon-plus"></i></a>
                    </div>
                    <div class="sort">
                        <a v-for="sort in foodSorts" @click="clickFood(sort)">
                            <span>{{sort.sort}}</span>
                            <img :src="sort.img" alt="value['img']">
                        </a>
                    </div>
                </el-col>
                <el-col class="coaches">
                    <div class="title">教练信息</div>
                    <div class="coach" v-for="coach in coaches">
                        <div class="infoBackground"></div>
                        <img :src="coach.picture" :alt="coaches.name">
                        <div class="info">
                            {{coach.name}} <br>
                            年龄：<span>{{coach.age}}岁</span><br>
                            课程：<span>{{coach.courses.toString().replace(/,/g,'、')}}</span><br>
                        </div>
                    </div>
                </el-col>
                <el-col></el-col>
                <el-col></el-col>
            </el-row>


            <div>
                <!--健身房地址 联系电话-->
            </div>
        </div>
    </div>
</template>

<script>
  import { articles, coach, course, foodSort } from '../api'
  import home1 from '../img/home1.jpg'
  import home2 from '../img/home2.jpg'
  import home3 from '../img/home3.jpg'
  import home4 from '../img/home4.jpg'
  import { articleHref } from '../js/func'
  import {mapState} from 'vuex'

  export default {
    name: 'Home',
    data() {
      return {
        coaches: [],
        articles: [],
        foodSorts: [],
        courses: [],
        image: {
          home1: home1,
          home2: home2,
          home3: home3,
          home4: home4
        }
      }
    },
    async created() {
      let { data: res } = await coach('select', null)
      this.coaches = res
      let { data: res2 } = await foodSort('select', null)
      for (let index in res2) {
        if (res2[index]['belong'] === '食品') {
          this.foodSorts.push(res2[index])
        }
      }
      let { data: res3 } = await articles('select', null)
      for (let index = 0; index < 5; index++) {
        this.articles.push(res3[index])
      }
      let { data: res4 } = await course('select', null)
      for (let index = 0; index < 8; index++) {
        this.courses.push(res4[index])
      }
      for (let index in this.articles) {
        if (this.articles === undefined) {
          this.$router.go(0)
        }
      }
    },
    methods: {
      clickArticle(item) {
        return articleHref(item.sort, item.id)
      },
      clickCourse(item) {
        $(window).attr('location', `/#/courses/${item.id}-1`)
      },
      clickFood(item) {
        $(window).attr('location', `/#/meal/sort?data=${item.sort}`)
      }
    },
    computed: {
      ...mapState(['pathPages']),
      imgSrc() {
        return function(name) {
          return this.image[name]
        }
      }
    }
  }
</script>

<style scoped lang="less" src="../css/home.less">

</style>
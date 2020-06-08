<template>
    <div>
        <div class="courses">
            <div class="chooseBox">
                <h3><b>全部课程</b></h3>
                <el-form>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="部位">
                                <el-select v-model="part">
                                    <el-option
                                            v-for="(item,index) in partList"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="难度">
                                <el-select v-model="strong">
                                    <el-option
                                            v-for="(item,index) in strongList"
                                            :key="index"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="details"
                 v-loading="loading"
                 element-loading-text="课程加载中..请稍后"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="#F2F2F2">
                <div v-for="info in show" class="detail">
                    <a :href="'/#/courses/' + info.id +'-1'">
                        <img :src='info.cover' alt="图片不存在...">
                        <div class="titles">
                            <h4>{{info.name}}</h4>
                            <h5>{{info.strong}}&nbsp;{{info.equip}}</h5>
                            <h5>{{info.part}}</h5>
                        </div>
                    </a>
                </div>
                <!--分页-->
                <div class="paging">
                    <Paging :pages="pages" @func="pagingBack"></Paging>
                </div>
            </div>
        </div>


    </div>
</template>

<script>
  import { course } from '../../api'
  import { showList } from '../../js/func'
  import Paging from '../Paging.vue'

  export default {
    name: 'Courses',
    components: { Paging },
    data() {
      return {
        courses: [],
        part: '不限部位',
        strong: '不限强度',
        partList: ['不限部位', '默认', '胸部', '腹部', '腿部', '手臂', '肩部', '背部', '臀部', '全身'],
        strongList: ['不限强度', 'H1', 'H2', 'H3', 'H4'],
        loading: true,
        show: [],
        pages: 0,
        page: 0
      }
    },
    async created() {
      let { data: res } = await course('select', null)
      if (res) {
        this.courses = res
      }
      this.page = 1
      this.$nextTick(() => {
        this.pagingBack(this.page)
        this.loading = false
      })
    },
    methods: {
      async clickPartStrong() {
        let param = { part: [], strong: [] }
        for (let key in param) {
          if (!param.hasOwnProperty(key)) continue
          if (this[key] === '不限部位' || this[key] === '不限强度') {
            for (let index in this[`${key}List`]) {
              if (!this[`${key}List`].hasOwnProperty(index)) continue
              param[key].push(`'${this[`${key}List`][index]}'`)
            }
          } else {
            param[key] = `'${this[key]}'`
          }
        }
        let { data: res } = await course('select', param)
        if (res) {
          this.courses = res
          this.pagingBack(1)
        }
      },
      pagingBack(data) {
        this.pages = Math.ceil(this.courses.length / 18)
        this.show = showList(data, this.courses, 18)
      }
    },
    watch: {
      part: function() {
        this.clickPartStrong()
      },
      strong: function() {
        this.clickPartStrong()
      }
    }
  }
</script>

<style scoped lang="less">
    .courses {
        width: 1000px;
        min-height: 800px;
        margin: 0 auto;

        .chooseBox {
            padding: 20px 0 0 20px;
            width: 600px;

            label {
                font-weight: normal;
                margin: 0;
            }

            select {
                height: 23px;
                width: 100px;
                vertical-align: middle;
                margin: 10px;
            }
        }

        .details {
            margin: 5px;
            min-height: 800px;

            .paging {
                margin: 0 auto;
                width: 600px;
            }

            .detail {
                display: inline-block;
                margin: 15px;
                width: 300px;
                height: 150px;
                overflow: hidden;
                border-radius: 10px;
                background-color: #444444;

                a {
                    position: relative;
                    width: 300px;
                    height: 150px;
                    overflow: hidden;

                    img {
                        position: absolute;
                        z-index: 0;
                        width: 300px;
                        height: 150px;
                        opacity: 0.2;
                        overflow: hidden;
                        object-fit: cover;

                        -webkit-transition: opacity 0.2s ease-in-out;
                        -o-transition: opacity 0.2s ease-in-out;
                        transition: opacity 0.2s ease-in-out;
                    }

                    .titles {
                        width: 300px;
                        position: absolute;
                        top: 10px;
                        left: 15px;
                        z-index: 2;
                        color: #fff;

                        h4 {
                            margin: 15px 0;
                            font-size: 18px;
                        }
                    }
                }

                a:hover {
                    cursor: pointer;

                    img {
                        opacity: 0.5;
                    }
                }
            }
        }
    }

</style>
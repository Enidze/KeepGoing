<template>
    <div class="playOutsideBox"
         v-loading="loading"
         element-loading-text="课程加载中..请稍后"
         element-loading-spinner="el-icon-loading"
         element-loading-background="#F2F2F2">
        <div class="play" v-if="show">
            <div class="video">
                <Video :curData="actions" :cover="course.cover"></Video>
            </div>
            <!-- 这个课程的信息 -->
            <div class="courseInfo">
                <div class="title">{{information.name}}</div>
                <div class="info">
                    <span style="color: #FF5555">
                        {{information.date}}
                    </span>
                    <br>
                    强度：<span>{{information.strong}}</span>级
                </div>
                <div class="info">
                    部位：<span>{{information.part}}</span>
                    <br>
                    时长：<span>{{information.minute}}</span>分钟
                </div>
                <div class="info">
                    器械：<span>{{information.equip}}</span>
                    <br>
                    消耗：<span>{{information.cost}}</span>卡
                </div>
                <el-button class="collectCourses" @click="collect" :disabled="btnDisabled" v-model="collectState">{{collectState}}
                </el-button>
            </div>
            <!--小视频播放窗口-->
            <el-scrollbar class="list">
                <el-row class="tac">
                    <el-col>
                        <el-menu
                                :default-openeds="date.toString().split(',')"
                                class="el-menu-vertical-demo"
                                unique-opened
                                router>
                            <el-submenu :index="index.toString()" v-for="(course,index) in courseDate">
                                <template slot="title">
                                    <span style="margin: 0 10px">{{course.date}}</span>
                                    <a :href="'/#/courses/'+id+'-'+(index+1)">
                                        <i class="iconfont icon-bofang" :class="'bf_'+index"></i>
                                    </a>
                                </template>
                                <el-menu-item-group>
                                    <a class="el-menu-item" :href="'/#/action/'+action.id"
                                       v-for="(action,index_2) in course.actions" target="_blank">
                                        {{index_2+1}}.{{action.name}}
                                    </a>
                                </el-menu-item-group>
                            </el-submenu>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-scrollbar>
        </div>
        <!--  <div v-for="(dateInfo,index) in courseInfo" class="smallBox">
              <div class="smallVideoWindow">

                  &lt;!&ndash;天数和名称：第几天 名称&ndash;&gt;
                  <div class="dateAndName">
                      <div class="dateName">
                          &lt;!&ndash;第几天 标题-变量date、dateName&ndash;&gt;
                          {{dateInfo["name"]}}
                          <i class="iconfont icon-bofang" @click="boFang(index)" :class="'bf_'+index"></i>
                      </div>
                      <div class="dateInfo">
                          动作：{{dateInfo['ids'].length}}个
                          &nbsp;&nbsp;
                          时长：{{dateInfo["minute"]}}分钟
                          &nbsp;&nbsp;
                          消耗：{{dateInfo["cost"]}}卡
                          &nbsp;&nbsp;
                          &lt;!&ndash;下拉按钮：将下面的动作播放列表隐藏&ndash;&gt;
                          <div class="hideKey" :class="'hk_'+index">
                              <div @click="hide(index)">
                                  &lt;!&ndash;隐藏按键-i标签&ndash;&gt;
                                  <i class="iconfont icon-xiangxia"></i>
                              </div>
                          </div>
                      </div>
                  </div>

                  &lt;!&ndash;动作播放列表&ndash;&gt;
                  <div class="actionList" :class="'al_'+index">
                      &lt;!&ndash;向左向右移动按键&ndash;&gt;
                      <div class="keyLeftRight">
                          <div href="#" class="leftKey" @click="move('left',index)">
                              &lt;!&ndash;左键-i标签&ndash;&gt;
                              <i class="iconfont icon-left"></i>
                          </div>
                          <div href="#" class="rightKey" @click="move('right',index)">
                              &lt;!&ndash;右键-i标签&ndash;&gt;
                              <i class="iconfont icon-right"></i>
                          </div>

                          &lt;!&ndash;包裹下面的ul列表&ndash;&gt;
                          <div class="parcelUL">
                              <ul class="aUL" :class="'aUL_' + index"
                                  :style="'width:' + dateInfo['ids'].length*285 + 'px'">
                                  &lt;!&ndash;独立具体的每一个动作&ndash;&gt;
                                  <li class="detailAction" v-for="action_info in dateInfo['ids']">

                                      &lt;!&ndash;单独的动作&ndash;&gt;
                                      <div class="aloneAction">
                                          &lt;!&ndash;视频-变量actionSrc、actionTime&ndash;&gt;
                                          <video :src="action_info['video']" muted loop onMouseOver="this.play()"
                                                 onMouseOut="this.pause()"></video>
                                          <span class="time">{{action_info["times"]}}</span>
                                      </div>

                                      &lt;!&ndash;动作的名称&ndash;&gt;
                                      <div class="aloneActionName">
                                          &lt;!&ndash;动作的标题-变量actionName&ndash;&gt;
                                          {{action_info["name"]}}
                                          <i class="iconfont icon-shexiang" @click="addHash(action_info['id'])"></i>
                                      </div>

                                      &lt;!&ndash;两个视频之间的符号图标&ndash;&gt;
                                      <div class="nextSymbol">
                                          &lt;!&ndash;下一个的符号-i标签&ndash;&gt;
                                          <i class="iconfont icon-shizhong"></i>
                                          <br>
                                          <p>继续</p>
                                      </div>
                                  </li>
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          </div>-->
    </div>
</template>

<script>
  import { action, courseDate, course, userCollect, userInfo } from '../../api'
  import Video from './Video.vue'
  import { mapState } from 'vuex'
  import { collect } from '../../js/func'

  export default {
    name: 'Play',
    async created() {
      /*获取这个课程的信息*/
      let { data: res1 } = await course('select', { id: this.id })
      this.course = res1[0]
      this.information = this.course
      let { data: res2 } = await courseDate('select', { course: this.course.name })
      for (let index in res2) {
        if (!res2.hasOwnProperty(index)) continue
        let actions = []
        let actionArray = res2[index].actions.split('、')
        for (let index_2 in actionArray) {
          if (!actionArray.hasOwnProperty(index_2)) continue
          actions.push(`'${actionArray[index_2]}'`)
        }
        let { data: res3 } = await action('select', { name: actions })
        res2[index]['actions'] = res3
      }
      this.courseDate = res2
      this.information.date = this.courseDate[this.date].date
      this.information.minute = this.courseDate[this.date].minute
      this.information.cost = this.courseDate[this.date].cost
      this.actions = this.courseDate[this.date].actions

      /*查看是否已经收藏了*/
      if (this.userInfo && this.userInfo.collectCourses) {
        for (let index in this.userInfo.collectCourses) {
          if (!this.userInfo.collectCourses.hasOwnProperty(index)) continue
          if (parseInt(this.userInfo.collectCourses[index].id) === this.id) {
            this.collectState = '已收藏'
            this.btnDisabled = true
          }
        }
      }
      this.$nextTick(() => {
        this.loading = false
        this.show = true
      })
    },
    data() {
      return {
        id: parseInt(this.$route.path.match(/\/courses\/([0-9]{1,4})-[0-9]{1,2}/)[1]),
        date: parseInt(this.$route.path.match(/\/courses\/[0-9]{1,4}-([0-9]{1,2})/)[1]) - 1,
        course: [],
        courseDate: [],
        actions: [],
        information: [],
        loading: true,
        show: false,
        collectState: '收藏课程',
        btnDisabled: false
      }
    },
    components: {
      Video
    },
    methods: {
      async collect() {
        if (this.userInfo) {
          let { data: res } = await userCollect('collectCourses', {
            id: collect(this.userInfo.collectCourses,true,this.id),
            username: window.localStorage.user
          })
          if (res) {
            this.$message({
              message: `课程"${this.course.name}"收藏成功`,
              type: 'success'
            })
            this.collectState = '已收藏'
            // this.$router.go(0)
          }
        } else {
          this.$message.error('您还未登录！')
        }

      }
    },
    computed: {
      ...mapState(['userInfo'])
    }
    /*
    watch: {
        date: function () {
            this.tranData = [];
            for (let index in this.courseInfo[this.date]['actions']) {
                let name = this.courseInfo[this.date]['actions'][index]['name'];
                let src = this.courseInfo[this.date]['actions'][index]['video'];
                let time = this.courseInfo[this.date]['actions'][index]['times'];
                this.tranData.push({name: name, src: src, time: time});
            }
        }
    },*/
    /*
    computed: {
        /!*  合计消耗的热量数  *!/
        countCost() {
            let sum = 0;
            for (let index in this.courseInfo) {
                sum += parseInt(this.courseInfo[index]['cost']);
            }
            return sum;
        },
        /!*  合计消耗时间  *!/
        countTime() {
            let sum = 0;
            for (let index in this.courseInfo) {
                sum += parseInt(this.courseInfo[index]["minute"]);
            }
            return Math.floor(sum / this.courseInfo.length);
        },
    },*/
    /*
    methods: {
        addHash(id) {
            this.$router.push({
                path: `/action/`,
                query: {"id": id}
            })
        },
        /!*  重新加载一下大的视频播放窗口  *!/
        reload() {
            this.isRouterAlive = false;
            this.$nextTick(() => {
                this.isRouterAlive = true;
            })
        },
        /!*  点击了每一天的标题旁的播放按钮 *!/
        boFang(index) {
            this.date = index;
            this.reload();
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        },
        /!*  隐藏小的视频列表框   *!/
        hide(index) {
            $(".al_" + index).slideToggle(1000);
            let hkClassName = ".hk_" + index;
            let trans = $(hkClassName).css("transform");
            if (trans === 'none') {
                $(hkClassName).css({"transform": "rotateX(180deg)", "transition": "all 1s ease-in-out"});
            } else {
                $(hkClassName).css({"transform": "none"});
            }
        },
        /!*  移动小的视频播放列表  *!/
        move(direction, index) {
            let aULClassName = ".aUL_" + index;
            let allWidth = $(aULClassName).css("width").split('px')[0] - 960 - 56;
            let leftLong = $(aULClassName).css("left").split('px')[0] * -1;
            if (direction === "right") {
                if (leftLong <= allWidth - 340) {
                    leftLong += 340;
                } else {
                    leftLong = allWidth;
                }
            } else {
                if (leftLong >= 340) {
                    leftLong -= 340;
                } else if (leftLong >= 0 && leftLong < 340) {
                    leftLong = 0;
                }
            }
            $(aULClassName).css({left: "-" + leftLong + "px", webkitTransition: "all 0.5s linear"});
        }
    },
    provide() {
        return {
            reload: this.reload
        }
    }*/
  }
</script>

<style scoped lang="less" src="../../css/course.less">
</style>
import Vue from 'vue'
import Vuex from 'vuex'
import { articles, course, userInfo } from '../api'

Vue.use(Vuex)

const state = {
  userInfo: null,
  /*Header,Home*/
  pathPages: [
    { path: '/courses', text: '健身视频' },
    { path: '/knowledge', text: '健身知识' },
    { path: '/meal', text: '饮食查询' }
  ],
  list: {
    /*type,level,mainMuscle,otherMuscle => SystemActions
    * sort => SystemArticles
    * part,strong => SystemCourses*/
    type: [
      { text: '上肢', value: '上肢' },
      { text: '下肢', value: '下肢' },
      { text: '全身', value: '全身' },
      { text: '拉伸', value: '拉伸' },
      { text: '核心', value: '核心' },
      { text: '瑜伽', value: '瑜伽' }
    ],
    level: [
      { text: '初级', value: '初级' },
      { text: '中级', value: '中级' },
      { text: '高级', value: '高级' }
    ],
    mainMuscle: [
      { text: '胸肌', value: '胸肌' },
      { text: '颈部', value: '颈部' },
      { text: '三头肌', value: '三头肌' },
      { text: '斜方肌', value: '斜方肌' },
      { text: '审脊肌', value: '审脊肌' },
      { text: '背阔肌', value: '背阔肌' },
      { text: '胸大肌', value: '胸大肌' },
      { text: '腓肠肌', value: '腓肠肌' },
      { text: '腘生肌', value: '腘生肌' },
      { text: '腹直肌', value: '腹直肌' },
      { text: '臀大肌', value: '臀大肌' },
      { text: '髂腰肌', value: '髂腰肌' },
      { text: '内收肌群', value: '内收肌群' },
      { text: '股四头肌', value: '股四头肌' },
      { text: '肱三头肌', value: '肱三头肌' },
      { text: '肱二头肌', value: '肱二头肌' },
      { text: '胫骨前肌', value: '胫骨前肌' }
    ],
    otherMuscle: [
      { text: '无', value: '无' },
      { text: '胸肌', value: '胸肌' },
      { text: '颈部', value: '颈部' },
      { text: '三头肌', value: '三头肌' },
      { text: '三角肌', value: '三角肌' },
      { text: '下背部', value: '下背部' },
      { text: '斜方肌', value: '斜方肌' },
      { text: '审脊肌', value: '审脊肌' },
      { text: '背阔肌', value: '背阔肌' },
      { text: '腓肠肌', value: '腓肠肌' },
      { text: '腘生肌', value: '腘生肌' },
      { text: '腹直肌', value: '腹直肌' },
      { text: '胸大肌', value: '胸大肌' },
      { text: '髂腰肌', value: '髂腰肌' },
      { text: '内收肌群', value: '内收肌群' },
      { text: '股四头肌', value: '股四头肌' },
      { text: '肱三头肌', value: '肱三头肌' },
      { text: '肱二头肌', value: '肱二头肌' },
      { text: '腹外斜肌', value: '腹外斜肌' },
      { text: '比目鱼肌', value: '比目鱼肌' },
      { text: '胫骨前肌', value: '胫骨前肌' }
    ],
    sort: [
      { text: '增肌', value: '增肌' },
      { text: '瑜伽', value: '瑜伽' },
      { text: '减肥', value: '减肥' },
      { text: '健身知识', value: '健身知识' }
    ],
    part: [
      { text: '默认', value: '默认' },
      { text: '胸部', value: '胸部' },
      { text: '腹部', value: '腹部' },
      { text: '腿部', value: '腿部' },
      { text: '手臂', value: '手臂' },
      { text: '肩部', value: '肩部' },
      { text: '背部', value: '背部' },
      { text: '臀部', value: '臀部' },
      { text: '全身', value: '全身' }
    ],
    strong: [
      { text: 'H1', value: 'H1' },
      { text: 'H2', value: 'H2' },
      { text: 'H3', value: 'H3' },
      { text: 'H4', value: 'H4' }
    ]

  }
}

const mutations = {
  setInfo: (state, data) => {
    state.userInfo = data
  }
}

const actions = {
  getInfo: async ({ commit }, info) => {
    let { data } = await userInfo('select', { username: info.username })
    if (data.length) {
      data = data[0]
      if (data.collectCourses) {
        data.collectCourses = data.collectCourses.split(',')
        let { data: collectCourses } = await course('select', { id: data.collectCourses })
        data.collectCourses = collectCourses
      }
      if (data.collectArticles) {
        data.collectArticles = data.collectArticles.split(',')
        let { data: collectArticles } = await articles('select', { id: data.collectArticles })
        data.collectArticles = collectArticles
      }
      for (let key in data) {
        if (!data.hasOwnProperty(key)) continue
        if (data[key] === 'null' || data[key] === 'undefined' || data[key] === '') {
          data[key] = null
        }
      }
    }
    commit('setInfo', data)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
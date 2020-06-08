<template>
    <div class="big" v-if="showPage">
        <Header></Header>
        <div class="content">
            <router-view class="routerView" :key="$route.fullPath"></router-view>
            <Footer></Footer>
        </div>
    </div>
</template>

<script>
  import Header from './base/Header.vue'
  import Footer from './base/Footer.vue'
  import router from './router'
  import { articles, course, exit, login, userInfo } from './api'
  import { mapActions } from 'vuex'

  export default {
    name: 'App',
    async created() {
      let param = {
        id: this.id,
        token: this.token
      }
      /*本地localStorage有登录状态的情况下自动登录(更新token)*/
      if (this.id === 'undefined' || this.token === 'undefined') {
        delete window.localStorage.id
        delete window.localStorage.user
        delete window.localStorage.token
        this.$router.go(0)
      }
      if (this.id) {
        let { data: res } = await login(param)
        if (res) {
          window.localStorage.token = res.token
          this.token = res.token
        } else {
          await exit(param)
          delete window.localStorage.id
          delete window.localStorage.user
          delete window.localStorage.token
        }
        this.getInfo({
          id:this.id,
          username:this.username
        })
      }
      this.$nextTick(() => {
        this.showPage = true
      })
    },
    router,
    data() {
      return {
        showPage: false,
        id: window.localStorage.id || null,
        username: window.localStorage.user || null,
        token: window.localStorage.token || null
      }
    },
    components: {
      Header,
      Footer
    },
    methods: {
      ...mapActions(['getInfo']),
    }
  }
</script>

<style lang="less">
    * {
        padding: 0;
        margin: 0;
    }

    ul, li {
        list-style: none;
    }

    a {
        text-decoration: none;
    }

    .video, .know.meal.home {
        margin: 30px 0;
        width: 100%;
    }

    .content {
        background-color: #F2F2F2;
        margin: 50px 0 0 0;
        width: 100%;

        .routerView {
            position: relative;
            z-index: 1;
        }
    }

    .play .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-image__inner {
        object-fit: cover;
    }

    .el-select {
        margin-left: 20px;
    }

    .el-table-filter {
        width: 180px;
        max-height: 300px;
        overflow: auto;
    }

    .el-form-item {
        max-width: 350px;
        margin: 20px auto;
    }

    .el-form-item__error {
        margin-left: 20px;
    }

    .el-form-item__label {
        padding: 0;
        margin: 0;
    }

    .el-carousel__container {
        height: 100%;
    }

    .perInformation {
        .el-input__inner {
            height: 30px;
        }

        .el-form-item__label {
            font-weight: normal;
        }

        .el-input__icon {
            margin-left: 20px;
        }
    }

    .perCollection {
        .el-row .el-checkbox__input {
            position: absolute;
            padding: 10px;
            right: 0;
            top: 0;
        }
    }
</style>
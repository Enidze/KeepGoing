<template>
    <div>
        <div class="searchMeal">
            <div class="search">
                <div class="searchInputBox">
                    <el-input type="text" v-model="searchData" class="searchInput" placeholder="搜索" @keyup.enter.native="search"></el-input>
                    <i class="el-icon-search" @click="search"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SearchMeal",
        data() {
            return {
                searchData: '',
            }
        },
        methods: {
            search() {
                this.$router.push({path: `/meal/search?data=${this.searchData}`});
            }
        }
    }
</script>

<style scoped  src="../../css/meal.less">

</style>
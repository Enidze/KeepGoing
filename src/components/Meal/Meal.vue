<template>
    <div>
        <div class="meal">
            <SearchMeal></SearchMeal>
            <div class="box">
                <div class="foodSort">
                    <div class="title">食物分类</div>
                    <div class="sortList">
                        <ul>
                            <li v-for="value in foodSorts" @click="changePath(value)">
                                <span>{{value.sort}}</span>
                                <img :src="value.img" alt="value.img">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="restSort">
                    <div class="title">餐厅分类</div>
                    <div class="sortList">
                        <ul>
                            <li v-for="value in restSorts" @click="changePath(value)">
                                <span>{{value.sort}}</span>
                                <img :src="value.img" :alt="value.img">
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {foodSort} from "../../api";
    import SearchMeal from "./SearchMeal.vue";

    export default {
        name: "Meal",
        data() {
            return {
                foodSorts: [],
                restSorts: [],
            }
        },
        components: {
            SearchMeal
        },
        async created() {
            let {data: res} = await foodSort('select', {sort: 'all'});
            for (let index in res) {
                if (!res.hasOwnProperty(index))continue;
                if (res[index].belong === '食品') {
                    this.foodSorts.push(res[index]);
                } else if (res[index].belong === '餐厅') {
                    this.restSorts.push(res[index]);
                }
            }
        },
        methods: {
            changePath(item) {
                this.$router.push({path: `/meal/sort?data=${item.sort}`});
            }
        }
    }
</script>

<style scoped lang="less" src="../../css/meal.less">
</style>
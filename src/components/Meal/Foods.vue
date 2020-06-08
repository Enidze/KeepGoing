<template>
    <div>
        <div class="foods">
            <SearchMeal></SearchMeal>
            <div class="list">
                <ul>
                    <li class="tit">{{data}}</li>
                    <li v-for="value in show">
                        <img :src="value.img" :alt="value.img">
                        <div class="text">
                            <div class="name">{{value.name}}</div>
                            <div class="cost">{{value.cost}}卡/100克</div>
                        </div>
                    </li>
                </ul>
                <div class="paging">
                    <Paging :pages="pages" @func="showList"></Paging>
                </div>
                <el-col class="sorts">
                    <div class="title">食品</div>
                    <el-row class="sort">
                        <a v-for="sort in foodSorts.food" @click="clickFood(sort)">
                            <span>{{sort.sort}}</span>
                            <img :src="sort.img" alt="value['img']">
                        </a>
                    </el-row>
                    <el-row class="sort">
                        <div class="title">餐厅</div>
                        <a v-for="sort in foodSorts.restaurant" @click="clickFood(sort)">
                            <span>{{sort.sort}}</span>
                            <img :src="sort.img" alt="value['img']">
                        </a>
                    </el-row>
                </el-col>
            </div>
        </div>
    </div>
</template>

<script>
    import {food, foodSort} from "../../api";
    import Paging from "../Paging.vue";
    import SearchMeal from "./SearchMeal.vue";
    import {showList} from "../../js/func";

    export default {
        name: "Foods",
        data() {
            return {
                foods: [],
                pages: 0,
                show: [],
                data: decodeURI(decodeURI(this.$route.query.data.toString())),
                pathHash: decodeURI(decodeURI(this.$route.path.match(/\/meal\/(.*)/)[1])),
                foodSorts:{
                    'food':[],
                    'restaurant':[]
                }
            }
        },
        components: {
            Paging,
            SearchMeal
        },
        async created() {
            let {data:res} = await foodSort('select',null);
            if (res){
                for (let index in res){
                    if (!res.hasOwnProperty(index))continue;
                    if (res[index].belong === '食品'){
                        this.foodSorts.food.push(res[index]);
                    }else {
                        this.foodSorts.restaurant.push(res[index]);
                    }
                }
            }
            if (this.pathHash === "sort") {
                let {data: res} = await food('select', {sort: this.data});
                if (res) {
                    this.foods = res;
                }
            } else if (this.pathHash ==="search") {
                let {data: res} = await food('select', {data: this.data});
                if (res) {
                    this.foods = res;
                }
            }
            this.pages = Math.ceil(this.foods.length / 10);
            this.$nextTick(() => {
                this.showList(1);
            });
        },
        methods: {
            showList(data) {
                this.show = showList(data,this.foods,10)
            },
            clickFood(item){
                $(window).attr('location',`/#/meal/sort?data=${item.sort}`)
            },
        }
    }
</script>

<style scoped lang="less" src="../../css/meal.less">
</style>
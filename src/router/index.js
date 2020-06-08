import Vue from 'vue';
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "../components/Home.vue";
import Courses from "../components/Course/Courses.vue";
import Knowledge from "../components/Knowledge/Knowledge.vue";
import ArticleList from "../components/Knowledge/ArticleList.vue";
import Article from "../components/Knowledge/Article.vue";
import Meal from "../components/Meal/Meal.vue";
import Foods from "../components/Meal/Foods.vue";
import Play from "../components/Course/Play.vue";
import Action from "../components/Course/Action.vue";
import Register from "../components/Register.vue";
import System from "../components/System/System.vue";
import SystemCourses from "../components/System/SystemCourses.vue";
import SystemActions from "../components/System/SystemActions.vue";
import SystemCoursesDates from "../components/System/SystemCoursesDates.vue";
import SystemArticles from "../components/System/SystemArticles.vue";
import SystemFoods from "../components/System/SystemFoods.vue";
import SystemFoodSorts from "../components/System/SystemFoodSorts.vue";
import SystemCoaches from "../components/System/SystemCoaches.vue";
import SystemUsers from "../components/System/SystemUsers.vue";
import PersonalPage from "../components/PersonalPage/PersonalPage.vue";
import PerHome from "../components/PersonalPage/PerHome.vue";
import PerInformation from "../components/PersonalPage/PerInformation.vue";
import PerCollectCourses from "../components/PersonalPage/PerCollectCourses.vue";
import PerCollectArticles from "../components/PersonalPage/PerCollectArticles.vue";
import PerApplication from "../components/PersonalPage/PerApplication.vue";

let router = new VueRouter({
    routes: [
        {path: '', component: Home},
        {path: '/home', component: Home},
        {path: '/courses', component: Courses},
        {path: '/knowledge', component: Knowledge},
        {path: '/knowledge/:c', component: ArticleList},
        {path: '/article/:c', component: Article},
        {path: '/meal', component: Meal},
        {path: '/meal/sort', component: Foods},
        {path: '/meal/search', component: Foods},
        {path: '/courses/:c', component: Play},
        {path: '/action/:c', component: Action},
        {path: '/register', component: Register},
        {path: "/system", component: System,
            children:[
                {path: "courses", component: SystemCourses},
                {path: "actions", component: SystemActions},
                {path: "courses-dates", component: SystemCoursesDates},
                {path: "foods", component: SystemFoods},
                {path: "foodSorts", component: SystemFoodSorts},
                {path: "articles", component: SystemArticles},
                {path: "coaches", component: SystemCoaches},
                {path: "users", component: SystemUsers},
            ]
        },
        {path:'/PersonalPage',component:PersonalPage,
            children:[
                {path: "home", component: PerHome},
                {path: "information", component: PerInformation},
                {path: "collectCourses", component: PerCollectCourses},
                {path: "collectArticles", component: PerCollectArticles},
                {path: "application", component: PerApplication},
            ]
        }
        // {path: '*', redirect: '/home'}

    ]
});

export default router;
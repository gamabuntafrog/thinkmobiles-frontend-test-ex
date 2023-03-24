import {createRouter, createWebHistory} from 'vue-router'
import Home from "../pages/Home.vue";
import User from "../pages/User.vue";
import NotFound from "../pages/NotFound.vue";
import Register from "../pages/Register.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: {
                title: 'Home'
            }
        },
        {
            path: '/user/:id',
            name: 'UserById',
            component: User,
            meta: {
                title: 'User'
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: 'Register'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFound,
            meta: {
                title: 'Not found'
            }
        }
    ]
})

const DEFAULT_TITLE = 'V';

router.beforeEach((to, from) => {

    document.title = to?.meta?.title || DEFAULT_TITLE;
});

export default router

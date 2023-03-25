import {createRouter, createWebHistory} from 'vue-router'
import Home from "../pages/Home.vue";
import User from "../pages/User.vue";
import NotFound from "../pages/NotFound.vue";
import Register from "../pages/Register.vue";
import Login from "../pages/Login.vue";
import store from "../store";

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
                title: 'Register',
                hiddenForAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login',
                hiddenForAuth: true
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

router.beforeEach((to, from, next) => {
    const isLoggedIn = store.state.isLoggedIn
    const isHiddenForAuth = to.matched.some(record => record.meta.hiddenForAuth)

    if (isHiddenForAuth && isLoggedIn) {

        next({path: '/'})
    }

    document.title = to?.meta?.title || DEFAULT_TITLE;

    next()
});

export default router

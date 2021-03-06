import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
// 将Login、Home、Welcome打包在同个异步块 (chunk) 中
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ 'views/login/Login');
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ 'views/home/Home')
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ 'views/welcome/Welcome')

const Users = () =>
    import ('views/user/Users')
const Rights = () =>
    import ('views/rights/Rights')
const Roles = () =>
    import ('views/roles/Roles')
const GoodsCate = () =>
    import ('views/goods/cate/GoodsCate')
const CateParams = () =>
    import ('views/goods/params/CateParams')
const GoodsList = () =>
    import ('views/goods/goodsList/GoodsList')
const AddGoods = () =>
    import ('views/goods/goodsList/listChildren/AddGoods')
const Order = () =>
    import ('views/order/Order')
const Report = () =>
    import ('views/report/Report')
Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            },
            {
                path: '/categories',
                component: GoodsCate
            },
            {
                path: '/params',
                component: CateParams
            },
            {
                path: '/goods',
                component: GoodsList
            },
            {
                path: '/goods/add',
                component: AddGoods
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 挂载导航守卫
router.beforeEach((to, from, next) => {
    // next() 表示放行，next('路由名')表示强制跳转到某个路由
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) {
        return next('/login');
    }
    next();
})
export default router
import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/HomePage',
                    name: 'HomePage',
                    component: () => import('@/views/HomePage.vue')
                },
                {
                    path: '/CartPage',
                    name: 'CartPage',
                    component: () => import('@/views/CartPage.vue')
                }
            ]
        },

        
    ]
});
  
router.beforeEach((to, from, next) => {
    // เริ่มแสดง loading
    window.showLoading && window.showLoading();
  
    next();
  });
  
  router.afterEach(() => {
    // ซ่อน loading เมื่อหน้าเสร็จ
    window.hideLoading && window.hideLoading();
  });

export default router;

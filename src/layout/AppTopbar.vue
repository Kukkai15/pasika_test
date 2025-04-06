<script setup>
import { useLayout } from '@/layout/layout';
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';


const cartStore = useCartStore();

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();



const showCartDialog = ref(false);

</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars icon-color"></i>
            </button>
           
        </div>

        <div class="layout-topbar-actions">

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                  
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="showCartDialog" header="ตะกร้าสินค้า" modal style="width: 400px">
    <div v-if="cartStore.cartItems.length">
      <div v-for="item in cartStore.cartItems" :key="item.id" class="flex justify-between mb-2">
        <span>{{ item.name }} ({{ item.quantity }})</span>
        <span>${{ item.price * item.quantity }}</span>
      </div>
    </div>
    <div v-else>
      ไม่มีสินค้ายังในตะกร้า
    </div>
  </Dialog>
</template>

<style scoped>
.icon-color {
    color: var(--primary-color);
}
.language-toggle {
    display: flex;
    align-items: center; /* Vertical center */
    justify-content: center; /* Horizontal center */
}

.language-toggle button {
    background: none;
    border: none;
    font-weight: bold;
    font-size: 1rem;
    color: gray;
    cursor: pointer;
    padding: 0.3rem 0.5rem;
}

.language-toggle .active {
    font-size: 16px;
    color: var(--primary-color);
}

.layout-topbar {
    display: flex;
    align-items: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
    height: 60px; /* ปรับตามต้องการ */
    background-color: #f8f9fa;
    padding: 0 15px;
}

.layout-topbar-logo-container {
    display: flex;
    align-items: center;
}

.layout-topbar-logo img {
    height: 50px; /* ปรับขนาดสูงสุดของโลโก้ */
    max-width: 140px; /* ป้องกันไม่ให้รูปขยายใหญ่เกินไป */
    object-fit: contain; /* ปรับให้ภาพอยู่ในกรอบ */
}
</style>

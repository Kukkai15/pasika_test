import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref(JSON.parse(localStorage.getItem('cartItems') || '[]'));

    watch(cartItems, (newCart) => {
        localStorage.setItem('cartItems', JSON.stringify(newCart));
    }, { deep: true });

    const addToCart = (product, quantity = 1) => {
        const existing = cartItems.value.find(item => item.id === product.id);
        const totalRequested = (existing?.quantity || 0) + quantity;
    
        if (totalRequested > product.quantity) {
            alert(`สินค้าคงเหลือ ${product.quantity} ชิ้น คุณใส่เกินแล้วครับ`);
            return;
        }
    
        if (existing) {
            existing.quantity += quantity;
        } else {
            cartItems.value.push({ ...product, quantity });
        }
    };
    

    const removeFromCart = (productId) => {
        cartItems.value = cartItems.value.filter(item => item.id !== productId);
    };
    

    const totalQuantity = computed(() => 
        cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const clearCart = () => {
        cartItems.value = [];
    };
    const updateQuantity = (productId, quantity) => {
        const item = cartItems.value.find(item => item.id === productId);
    
            if (item) {
                item.quantity = quantity;
            }
        
    };



    return {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalQuantity,
        clearCart
    };
});
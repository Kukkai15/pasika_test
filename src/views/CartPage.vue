<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import { useToast } from 'primevue/usetoast';
import { ProductService } from '@/service/ProductService';

import { calculateDiscount } from '@/stores/discountUtils';

const userPointsall = 250; 
const pointsUsed = ref(0); 
const couponCode = ref('');
const isPointsUsed = ref(false); 

const cartStore = useCartStore();
const products = ref([]);
const selectedProduct = ref(null);
const selectedQuantity = ref(1);
const type = ref('percent');
const num = ref(0);

const showDialogss = ref(false);

const discountResult = computed(() => 
  calculateDiscount(cartStore.cartItems, type.value,num.value, pointsUsed.value) 
);

const toast = useToast();

onMounted(() => {
    ProductService.getProducts().then((data) => (products.value = data));
});

const updateQuantity = (item, operation) => {
    let newQuantity = item.quantity;
    if (operation === 'increase') {
        newQuantity++;
    } else if (operation === 'decrease') {
        newQuantity--;
    }

    if (newQuantity < 1) return;

    const product = products.value.find(p => p.id === item.id);
    const productInStock = product ? product.quantity : 0;

    if (newQuantity > productInStock) {
        toast.add({ severity: 'warn', summary: 'เกินจำนวนในคลัง', detail: `เหลือ ${productInStock} ชิ้น`, life: 3000 });
        return;
    }

    cartStore.updateQuantity(item.id, newQuantity);
};

const removeItemFromCart = (itemId) => {
    cartStore.removeFromCart(itemId);
};

const totalPrice = computed(() => {
    return cartStore.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
});

const applyPoints = () => {
    const totalAfterDiscount = discountResult.finalTotal; 
    if (pointsUsed.value > userPointsall) {
        toast.add({ severity: 'error', summary: 'แต้มไม่พอ', detail: `คุณมีแต้มเพียง ${userPointsall} แต้ม`, life: 3000 });
        return;
    }
    if (pointsUsed.value > totalAfterDiscount) {
        pointsUsed.value = totalAfterDiscount; 
    }
    isPointsUsed.value = true;
};

const applyCode = () => {
    if (couponCode.value === 'SALE50') {
        type.value = 'bath';
        num.value  = 50;
    } else if (couponCode.value === 'SALE15C') {
        type.value  = 'percent';
        num.value  = 15;
    } else {
        type.value  = '';
        num.value  = 0;
        toast.add({ severity: 'error', summary: 'โค้ดส่วนลดไม่ถูกต้อง', life: 3000 });
    }
};

const removeAllFromCart = () => {
    cartStore.cartItems = [];
    showDialogss.value = false;  
};

function confirm() {
    if (cartStore.cartItems.length > 0) {
        showDialogss.value = true; 
    } else {
        toast.add({ 
            severity: 'warn', 
            summary: 'ไม่มีสินค้าในตะกร้า', 
            detail: 'กรุณาเลือกสินค้าก่อนทำการชำระเงิน', 
            life: 3000 
        });
    }
}

</script>

<template>
    <div class="cart-page">
        <div class="cart-header">
            <h2>ตะกร้าสินค้า</h2>
        </div>

        <div v-if="cartStore.cartItems.length > 0" class="cart-table">
            <table class="table-auto w-full">
                <thead>
                    <tr>
                        <th>รูปภาพ</th>
                        <th>ชื่อสินค้า</th>
                        <th>ประเภทสินค้า</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                        <th>รวม</th>
                        <th>จัดการ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in cartStore.cartItems" :key="item.id">
                        <td>
                            <img :src="'https://primefaces.org/cdn/primevue/images/product/' + item.image" alt="product image" class="w-16 h-16 object-cover" />
                        </td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.price }} ฿</td>
                        <td>
                            <div class="flex items-center space-x-2">
                                <Button icon="pi pi-minus" @click="updateQuantity(item, 'decrease')" :disabled="item.quantity <= 1" />
                                <span class="w-8 text-center">{{ item.quantity }}</span>
                                <Button icon="pi pi-plus" @click="updateQuantity(item, 'increase')" />
                            </div>
                        </td>
                        <td>{{ item.price * item.quantity }} ฿</td>
                        <td>
                            <Button icon="pi pi-trash" class="p-button-danger" @click="removeItemFromCart(item.id)" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="cart-footer mt-4">
                <div class="text-right font-semibold text-xl">
                    <p>ยอดรวม: {{ totalPrice }} ฿</p>
                </div>
            </div>
        </div>

        <div v-else class="text-center text-lg font-medium">
            ไม่มีสินค้าภายในตะกร้า
        </div>
        <Toast />

        <div class="discount-section mt-4 max-w-md ml-auto text-right">
            <div class="mb-3">
                <label for="coupon" class="block mb-1">คูปองส่วนลด</label>
                <div class="flex justify-end space-x-2 mb-3"> 
                    <InputText
                        id="coupon"
                        v-model="couponCode"
                        placeholder="เช่น SALE50 หรือ SALE15C"
                        class="w-md"
                    />
                    <Button label="ใช้โค้ด" @click="applyCode" class="p-button-primary" />
                </div>
                
            </div>
            <label for="points" class="block mb-1">แต้มของคุณมี {{userPointsall}} แต้ม (1 แต้ม = 1 บาท)</label>
            <div class="flex justify-end space-x-2 mb-3"> 
                <InputNumber 
                    id="points" 
                    v-model="pointsUsed" 
                    :min="0" 
                    :max="userPointsall" 
                    inputStyle="width:100px" 
                />
                <Button label="ใช้แต้ม" @click="applyPoints" class="p-button-primary" />
            </div>
        </div>

        <div class="cart-footer mt-4">
            <div class="text-right font-semibold text-xl">
                <p>ยอดรวมก่อนลด: {{ discountResult.originalTotal.toFixed(2) }} ฿</p>
                <p v-if="discountResult.discountDetails.accessoriesDiscount > 0">โปรโมชั่น(หมวดหมู่สินค้า) -{{ discountResult.discountDetails.accessoriesDiscount.toFixed(2) }} ฿</p>
                <span class="detail" v-if="discountResult.discountDetails.accessoriesDiscount > 0">ซื้อ Accessories 3 ชิ้นขึ้นไป ลด 20 บาท</span>
                <p v-if="discountResult.discountDetails.couponDiscount > 0">ส่วนลดคูปอง: -{{ discountResult.discountDetails.couponDiscount.toFixed(2) }} ฿</p>
                <p v-if="discountResult.discountDetails.pointDiscount > 0">ส่วนลดจากแต้ม: -{{ discountResult.discountDetails.pointDiscount.toFixed(2) }} ฿</p>
                <hr class="my-2" />
                <p v-if="discountResult.discountDetails.finalTotal > 0">ยอดรวมหลังจากลดส่วนลดเสริม -{{ discountResult.discountDetails.finalTotal.toFixed(2) }} ฿</p>
                <p v-if="discountResult.discountDetails.additionalDiscount > 0">ส่วนลดปกติ -{{ discountResult.discountDetails.additionalDiscount.toFixed(2) }} ฿</p>
                <span class="detail" v-if="discountResult.discountDetails.additionalDiscount > 0">ส่วนลด 10 บาทต่อทุกๆ 250 บาทของยอดที่หักส่วนลดเพิ่มเติมแล้ว</span>
                <p class="text-2xl text-green-700 font-bold">ยอดสุทธิ: {{ discountResult.finalTotal.toFixed(2) }} ฿</p>
            </div>
        </div>

        <div class="flex justify-end mt-4">
            <Button label="ดำเนินการชำระเงิน" class="p-button-success" style="background-color:#6188c2; border: #6188c2" @click="confirm" />
        </div>
    </div>

    <Dialog
    v-model:visible="showDialogss"
    pt:root:class="!border-0 !bg-transparent rounded-xl border border-gray-300"
    pt:mask:class="backdrop-blur-[1px]"
    :style="{ width: '400px' }"
    :modal="true"
    :closable="false"
    :draggable="false"
    :blockScroll="true"
    dismissableMask="false"
>
    <div class="flex flex-col px-8 py-8 gap-6 rounded-2xl" style="background: linear-gradient(to bottom, #c4c4eb, #e0e0f5);">
        <img src="/src/assets/alert/alert_success.gif" alt="Alert" class="block mx-auto w-32 h-32" />
        <div class="text-center text-gray-800 font-semibold text-lg">สำเร็จ</div> <!-- แก้ไขการปิด div ที่หายไป -->
        <div class="text-center text-gray-600">ระบบจะทำการล้างค่าในตะกร้านะคะ</div>
        <div class="flex items-center gap-4">
            <Button label="OK" @click="removeAllFromCart" text class="!p-4 w-full default-btn"></Button>
        </div>
    </div>
</Dialog>


</template>





<style scoped>
.detail{
    font-size: 12px;
    color: #888;
}
.cart-page {
    padding: 20px;
    background-color: #f9f9f9;
}

.cart-header {
    text-align: center;
    margin-bottom: 20px;
}

.cart-table table {
    width: 100%;
    border-collapse: collapse;
}

.cart-table th, .cart-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.cart-table td img {
    border-radius: 8px;
}

.cart-footer {
    margin-top: 20px;
}

.cart-footer p {
    margin: 0;
}

.cart-footer .p-button-success {
    margin-right: 10px;
}
</style>

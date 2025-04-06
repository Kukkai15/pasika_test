<script setup>
import { onMounted, ref } from 'vue';
import { ProductService } from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import { useCartStore } from '@/stores/cartStore'; 
const toast = useToast();


const products = ref([]);
const showDialog = ref(false);
const selectedProduct = ref(null);
const selectedQuantity = ref(1);
const categories = ref([]);
const selectedCategory = ref(null); 

onMounted(() => {
    ProductService.getProducts().then((data) => {
        products.value = data;
        categories.value = [...new Set(data.map(product => product.category))];  
    });
});

function getSeverity(status) {
    switch (status) {
        case 'INSTOCK': return 'success';
        case 'LOWSTOCK': return 'warning';
        case 'OUTOFSTOCK': return 'danger';
        default: return null;
    }
}
function filterProductsByCategory(category) {
    return products.value.filter(product => product.category === category);
}

function openCartPopup(product) {
    selectedProduct.value = product;
    selectedQuantity.value = 1;
    showDialog.value = true;
}



function onQuantityInput() {
  if (selectedQuantity < 1) {
    selectedQuantity = 1;
  }
  if (selectedProduct && selectedQuantity > selectedProduct.quantity) {
    selectedQuantity = selectedProduct.quantity;
  }
}

function isNumber(evt) {
  const charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode < 48 || charCode > 57) {
    evt.preventDefault();
  }
}

function confirmAddToCart() {
    const cartStore = useCartStore();

    const existing = cartStore.cartItems.find(item => item.id === selectedProduct.value.id);
    const totalRequested = (existing?.quantity || 0) + selectedQuantity.value;

    console.log("Total Requested: ", totalRequested);  
    console.log("Product Quantity: ", selectedProduct.value.quantity);  

    if (totalRequested > selectedProduct.value.quantity) {
        toast.add({
            severity: 'warn',
            summary: 'เกินจำนวนสินค้า',
            detail: `สินค้า "${selectedProduct.value.name}" คงเหลือแค่ ${selectedProduct.value.quantity} ชิ้น`,
            life: 3000
        });
        console.log("Alert: เกินจำนวนสินค้า"); 
    } else {
        addToCart(selectedProduct.value, selectedQuantity.value);
        toast.add({
            severity: 'success',
            summary: 'เพิ่มสินค้าสำเร็จ',
            detail: `${selectedProduct.value.name} ถูกเพิ่มลงในตะกร้าแล้ว`,
            life: 3000
        });
        console.log("Alert: เพิ่มสินค้าสำเร็จ");  
        showDialog.value = false;
    }
}
function addToCart(product, quantity) {
    const cartStore = useCartStore(); 
    if (quantity <= 0) return;

    const existing = cartStore.cartItems.find(item => item.id === product.id);
    if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.quantity) return;
        existing.quantity = newQty;
    } else {
        cartStore.cartItems.push({ ...product, quantity });
    }
    const productInList = cartStore.productList?.find(p => p.id === product.id);
    if (productInList) productInList.quantity -= quantity;
}



</script>

<template>

<div class="card">

<div v-for="category in categories" :key="category" class="mb-8">
    <div class="font-semibold text-xl mb-4">{{ category }}</div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Loop through products of the current category -->
        <div v-for="product in filterProductsByCategory(category)" :key="product.id" class="border border-surface-200 dark:border-surface-700 rounded p-4">
            <div class="mb-4">
                <div class="relative mx-auto">
                    <img :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image" :alt="product.name" class="w-full rounded" />
                    <div class="dark:bg-surface-900 absolute rounded-border" style="left: 5px; top: 5px">
                        <Tag :value="product.inventoryStatus" :severity="getSeverity(product.inventoryStatus)" />
                    </div>
                </div>
            </div>
            <div class="mb-4 font-medium">{{ product.name }}</div>
            <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-xl">{{ product.price }} ฿</div>
                <span>
                    <Button 
                    icon="pi pi-shopping-cart" 
                    class="ml-2" 
                    :disabled="product.quantity === 0"
                    @click="openCartPopup(product)" />
                </span>
            </div>
        </div>
    </div>
</div>
</div>

<!-- <div class="card">
    <div class="font-semibold text-xl mb-4">Product List</div>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="product in products" :key="product.id" class="border border-surface-200 dark:border-surface-700 rounded p-4">
            <div class="mb-4">
                <div class="relative mx-auto">
                    <img :src="'https://primefaces.org/cdn/primevue/images/product/' + product.image" :alt="product.name" class="w-full rounded" />
                    <div class="dark:bg-surface-900 absolute rounded-border" style="left: 5px; top: 5px">
                        <Tag :value="product.inventoryStatus" :severity="getSeverity(product.inventoryStatus)" />
                    </div>
                </div>
            </div>
            <div class="mb-4 font-medium">{{ product.name }}</div>
            <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-xl">{{ product.price }} ฿</div>
                <span>
                    <Button 
                    icon="pi pi-shopping-cart" 
                    class="ml-2" 
                    :disabled="product.quantity === 0"
                    @click="openCartPopup(product)" />

                </span>
            </div>
        </div>
    </div>
</div> -->
<Toast />

<Dialog v-model:visible="showDialog" header="Add to Cart" :modal="true" class="w-full sm:w-96">
    <div class="flex flex-col gap-4">
        <div class="font-semibold text-lg">{{ selectedProduct?.name }}</div>
        <div class="text-sm text-gray-500">
            คงเหลือ: {{ selectedProduct?.quantity }} ชิ้น
        </div>
        <div class="flex items-center gap-2 mt-2">
            <Button icon="pi pi-minus" @click="selectedQuantity > 1 ? selectedQuantity-- : null" />
                <InputText
                    type="Text"
                    v-model.number="selectedQuantity"
                    class="w-16 text-center"
                    min="1"
                    :max="selectedProduct?.quantity"
                    @keypress="isNumber($event)"
                    @input="onQuantityInput"
                    />


            <Button 
                icon="pi pi-plus" 
                @click="selectedQuantity < selectedProduct.quantity ? selectedQuantity++ : null" 
                :disabled="selectedQuantity >= selectedProduct.quantity" 
            />
        </div>

        <div class="flex justify-end gap-2 mt-4">
            <Button label="Cancel" severity="secondary" @click="showDialog = false" />
            <Button
                label="Add to Cart"
                icon="pi pi-shopping-cart"
                @click="confirmAddToCart"
                :disabled="selectedQuantity < 1 || selectedQuantity > selectedProduct.quantity"
            />



        </div>
    </div>
</Dialog>

</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppMenuItem from './AppMenuItem.vue';

const { t } = useI18n();

const model = computed(() => {
    return [
        {
            label: 'MAIN MENU',
            items: [
                { label: 'HomePage', icon: 'pi pi-fw pi-home', to: '/HomePage' },
                { label: 'CartPage', icon: 'pi pi-shopping-cart', to: '/CartPage' },
            ]
        }
    ];
});
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>

<script setup>
import { useLayout } from '@/layout/layout';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import AppFooter from './AppFooter.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { t } = useI18n();
const route = useRoute();
const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);

const isDashboard = computed(() => route.path === '/');

const breadcrumbItems = computed(() => {
    const items = route.matched
        .filter((r) => r.meta.breadcrumb) // Include only routes with breadcrumbs
        .map((matchedRoute) => ({
            label: t(matchedRoute.meta.breadcrumb),
            route: matchedRoute.path !== '/' ? matchedRoute.path : null
        }));

    return [{ icon: 'pi pi-home', route: '/' }, ...items]; // Always start with Home icon
});

const selectedPageTitle = computed(() => {
    const lastItem = breadcrumbItems.value[breadcrumbItems.value.length - 1];
    return lastItem ? lastItem.label : ''; // Default to empty string if no label
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <div class="layout-main-container">
            <div class="flex justify-between items-center">
                <div class="ml-4 text-[20px] font-semibold">
                    {{ selectedPageTitle }}
                </div>

                <Breadcrumb v-if="!['/'].includes(route.path)" :model="breadcrumbItems" class="">
                    <template #item="{ item, props }">
                        <!-- Home icon (ONLY clickable item) -->
                        <router-link v-if="item.icon" v-slot="{ href, navigate }" :to="item.route" custom>
                            <a :href="href" v-bind="props.action" @click="navigate" class="breadcrumb-icon">
                                <i :class="item.icon"></i>
                            </a>
                        </router-link>

                        <!-- Non-clickable breadcrumb items -->
                        <span v-else :class="['breadcrumb-text', { 'breadcrumb-active': item === breadcrumbItems[breadcrumbItems.length - 1] }]">
                            {{ item.label }}
                        </span>
                    </template>
                </Breadcrumb>
            </div>

            <div class="layout-main">
                <div v-if="isDashboard" style="height: 1rem" />
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>

<style scoped>
::v-deep(.p-breadcrumb) {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

.breadcrumb-icon {
    padding: 0.5rem 0.5rem;
    color: var(--text-color);
}

.breadcrumb-text {
    padding: 0.5rem 0.5rem;
    color: var(--text-color);
    font-weight: normal;
}

/* Last breadcrumb (current page) is green */
.breadcrumb-active {
    color: var(--primary-color);
    font-weight: bold;
}
</style>

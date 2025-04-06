<script setup>
import { ref, onBeforeMount , provide ,onMounted } from 'vue'; // เพิ่มการ import ref
import { useLayout } from '@/layout/layout';
import { updatePreset, updateSurfacePalette } from '@primevue/themes';
import '@/assets/styles.css'; 
import GlobalDialog from '@/components/GlobalDialog.vue';
import Loading from '@/components/GlobalLoading.vue';

const isDialogVisible = ref(false);
const dialogType = ref("success"); // default เป็น success

const showDialog = (type) => {
  dialogType.value = type;
  isDialogVisible.value = true;
};

provide('showDialog', showDialog);


const loading = ref(null);
const showLoading = () => {
  loading.value.show(); // เรียกแสดง loading
};

const hideLoading = () => {
  loading.value.hide(); // ซ่อน loading
};

onMounted(() => {
  // ตั้งค่าให้สามารถเรียกใช้ showLoading และ hideLoading ทั่วทั้งแอป
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
});
 
const { setPrimary, setSurface } = useLayout();

const primaryColor = { name: 'tms', palette: { 50: '#d5d2f6', 100: '#c4c4eb', 200: '#8d8cb7', 300: '#8d8cb7', 400: '#6b699a', 500: '#5b5991', 600: '#49468f', 700: '#2b2a7c', 800: '#2b2a7c', 900: '#2b2a7c', 950: '#2b2a7c' } };

function getPresetExt() {
    const color = primaryColor;

    return {
        semantic: {
            primary: color.palette,
            colorScheme: {
                light: {
                    primary: {
                        color: '{primary.700}',
                        contrastColor: '#ffffff',
                        hoverColor: '{primary.600}',
                        activeColor: '{primary.700}'
                    },
                    highlight: {
                        background: '{primary.50}',
                        focusBackground: '{primary.100}',
                        color: '{primary.700}',
                        focusColor: '{primary.800}'
                    }
                },
                dark: {
                    primary: {
                        color: '{primary.300}',
                        contrastColor: '{surface.900}',
                        hoverColor: '{primary.300}',
                        activeColor: '{primary.200}'
                    },
                    highlight: {
                        background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                        focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                        color: 'rgba(255,255,255,.87)',
                        focusColor: 'rgba(255,255,255,.87)'
                    }
                }
            }
        }
    };
}

function updateColors(type, color) {
    if (type === 'primary') {
        setPrimary(color.name);
    } else if (type === 'surface') {
        setSurface(color.name);
    }

    applyTheme(type, color);
}

function applyTheme(type, color) {
    if (type === 'primary') {
        updatePreset(getPresetExt());
    } else if (type === 'surface') {
        updateSurfacePalette(color.palette);
    }
}

onBeforeMount(() => {
    updateColors('primary', primaryColor);
});
</script>


<template>
    <Loading ref="loading" />
    <GlobalDialog v-model:visible="isDialogVisible" :type="dialogType" />
    <router-view />
</template>


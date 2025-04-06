<script setup>
import { defineEmits, defineProps } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  visible: Boolean, // ควบคุมการแสดง Dialog
  type: String, // success, error, warning
});

const emit = defineEmits(["update:visible"]); // ใช้ emit เพื่อปิด Dialog

const closeDialog = () => {
  emit("update:visible", false);
};

// กำหนดค่าของ Dialog แต่ละประเภท
const dialogData = {
  success: {
    img: "/src/assets/alert/alert_success.gif",
    title: t("success.title"),
    message: t("success.save"),
  },
  error: {
    img: "/src/assets/alert/alert_error.gif",
    title: t("error.title"),
    message: t("error.save"),
  },
  warning: {
    img: "/src/assets/alert/alert_warning.gif",
    title: t("warning.title"),
    message: '',
  },
};
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
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
      <img :src="dialogData[type]?.img" alt="Alert" class="block mx-auto w-32 h-32" />
      <div class="text-center text-gray-800 font-semibold text-lg">{{ dialogData[type]?.title }}</div>
      <div class="text-center text-gray-600">{{ dialogData[type]?.message }}</div>
      <div class="flex items-center gap-4">
        <Button label="OK" @click="closeDialog" text class="!p-4 w-full default-btn"></Button>
      </div>
    </div>
  </Dialog>
</template>

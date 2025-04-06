<template>
    <div v-if="visible" class="loading-overlay">
      <img src="@/assets/alert/loading.gif" alt="Loading..." class="loading-img" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const visible = ref(false);
  
  const show = () => {
    visible.value = true;
  };
  
  const hide = () => {
    visible.value = false;
  };
  
  // export functions to use in other components
  defineExpose({
    show,
    hide
  });
  </script>
  
  <style scoped>
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(213, 213, 213, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .loading-img {
    width: 200px;
    height: 200px;
  }
  </style>
  
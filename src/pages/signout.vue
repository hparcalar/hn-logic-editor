<route lang="yaml">
    meta:
      layout: login-layout
</route>
<script setup lang="ts">
    import { onMounted } from 'vue';
    import {useRouter} from 'vue-router';

    const router = useRouter();

    onMounted(() => {
        localStorage.removeItem('hn_user');
        router.push({ name: 'login' });
    });

</script>
<template>
  
</template>

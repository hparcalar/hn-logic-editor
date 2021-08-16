<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit } from 'vue';
    import type { Ref } from 'vue';
    import { asyncComputed } from '@vueuse/core';
    import type { AppModel } from '../models/node.models';
    import VModalForm from './base/VModalForm.vue';
    import VFormText from './base/VFormText.vue';
    import { LogicService } from '../services/logic.service';

    const logicService: LogicService = new LogicService();

    const props = defineProps({
        recordId: {
            type: Number,
            required: true,
        },
        visible: {
            type: Boolean,
            default: false,
        },
        onSubmit: {},
        onCancel: {},
    });

    const emit = defineEmit({
        submit: () => true,
        cancel: () => true,
        'after-close': () => true,
    });

    const modalSize = ref(window.innerWidth * 0.5);
    
    const modelObject = asyncComputed(async() => {
        const data = await logicService.getApp(props.recordId);
        if (data)
            formData.value = data;
        else
            formData.value = { hnAppId:-1, appName: '', isActive:true };
    });

    const formData: Ref<AppModel> = ref({ hnAppId:0, isActive: true, appName:'' });

    const onSubmit = async() => {
        await logicService.saveApp(formData.value);
        emit('submit');
    };

    const onCancel = () => {
        emit('cancel');
    }
</script>
<template>
    <VModalForm
    class="app-model-form"
    :visible="props.visible"
    :title="'App Definition'"
    :description="''"
    :width="modalSize"
    :submit-text="'Kaydet'"
    :cancel-text="'Kapat'"
    @cancel="onCancel"
    @submit="onSubmit"
    @after-close="emit('after-close')"
  >
    <VFormText
          v-model="formData.appName"
          :label="'App Name'"
          :required="true"
        />
  </VModalForm>
</template>
<style lang="postcss" scoped>

</style>
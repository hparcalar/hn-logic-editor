<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit } from 'vue';
    import type { Ref } from 'vue';
    import { asyncComputed } from '@vueuse/core';
    import type { AppModel, ProcessModel } from '../models/node.models';
    import VModalForm from './base/VModalForm.vue';
    import VFormText from './base/VFormText.vue';
    import { LogicService } from '../services/logic.service';

    const logicService: LogicService = new LogicService();

    const props = defineProps({
        recordId: {
            type: Number,
            required: true,
        },
        hnProcessId: {
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
        const data = await logicService.getProcess(props.recordId);
        if (data) {
            formData.value = data;
        }
        else
            formData.value = {  };
    });

    const formData: Ref<ProcessModel> = ref({  });

    const onSubmit = async() => {
        // formData.value.hnAppId = props.hnAppId;
        await logicService.saveProcess(formData.value);
        emit('submit');
    };

    const onCancel = () => {
        emit('cancel');
    }
</script>
<template>
    <VModalForm
    class="step-model-form"
    :visible="props.visible"
    :title="'Step Definition'"
    :description="''"
    :width="modalSize"
    :submit-text="'Kaydet'"
    :cancel-text="'Kapat'"
    @cancel="onCancel"
    @submit="onSubmit"
    @after-close="emit('after-close')"
  >
    <VFormText
          v-model="formData.name"
          :label="'Process Name'"
          :required="true"
        />
  </VModalForm>
</template>
<style lang="postcss" scoped>

</style>
<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit } from 'vue';
    import type { Ref } from 'vue';
    import { asyncComputed } from '@vueuse/core';
    import type { AppModel, ProcessModel } from '../models/node.models';
    import VModalForm from './base/VModalForm.vue';
    import VFormText from './base/VFormText.vue';
    import { LogicService } from '../services/logic.service';
    import VFormNumber from './base/VFormNumber.vue';
    import VFormCheck from './base/VFormCheck.vue';

    const logicService: LogicService = new LogicService();

    const props = defineProps({
        recordId: {
            type: Number,
            required: true,
        },
        hnAppId: {
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
            formData.value.hnAppId = props.hnAppId;
        }
        else
            formData.value = { hnProcessId:-1, name: '', canRepeat: true,
            delayAfter:0, delayBefore:0, liveCondition: '', connectionResetMessage: '', connectionResetMessageDelay: 5000,
            isActive:true, hnAppId:props.hnAppId, steps: [] };
    });

    const formData: Ref<ProcessModel> = ref({ hnProcessId:-1, hnAppId:props.hnAppId, canRepeat: true,
            delayAfter:0, delayBefore:0, connectionResetMessage: '', connectionResetMessageDelay: 5000,
            isActive: true, name:'', liveCondition: '', steps: [] });

    const onSubmit = async() => {
        formData.value.hnAppId = props.hnAppId;
        await logicService.saveProcess(formData.value);
        emit('submit');
    };

    const onCancel = () => {
        emit('cancel');
    }
</script>
<template>
    <VModalForm
    class="process-model-form"
    :visible="props.visible"
    :title="'Process Definition'"
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
    
    <div class="grid grid-cols-12">
        <VFormNumber
            v-model="formData.delayBefore"
            :label="'Delay (Before)'"
            :required="true"
            class="col-span-3"
        />
        <VFormNumber
            v-model="formData.delayAfter"
            :label="'Delay (After)'"
            :required="true"
            class="col-span-3"
        />
        <VFormText
            v-model="formData.liveCondition"
            :label="'Live Condition'"
            :required="true"
            class="col-span-4"
        />
        <VFormCheck
            v-model="formData.canRepeat"
            :label="'Can Repeat'"
            :required="true"
            class="col-span-2"
        />
    </div>

    <div class="grid grid-cols-12">
        <VFormText
          v-model="formData.connectionResetMessage"
          :label="'Connection Err Message'"
          :required="false"
          class="col-span-6"
        />

        <VFormNumber
            v-model="formData.connectionResetMessageDelay"
            :label="'Error Message Delay (sn)'"
            :required="true"
            class="col-span-6"
        />
    </div>
    
  </VModalForm>
</template>
<style lang="postcss" scoped>

</style>
<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit, watch } from 'vue';
    import type { Ref } from 'vue';
    import { asyncComputed } from '@vueuse/core';
    import type { AppModel, ProcessModel, ProcessStepModel } from '../models/node.models';
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

    let allStepsOfProcess = [];
    const modalSize = ref(window.innerWidth * 0.5);
    
    const loadStep = async() => {
        const data = await logicService.getProcess(props.hnProcessId);
        if (data) {
            allStepsOfProcess = data.steps;
            formData.value = data.steps.find(d => d.processStepId == props.recordId);
            if (!formData.value){
                formData.value = { processStepId:-1, explanation:'', comparison:'', resultAction:'', 
                delayBefore:0, delayAfter:0, hnProcessId: props.hnProcessId, orderNo:999 };
            }

            if (!allStepsOfProcess)
                allStepsOfProcess = [];
        }
        else{
            allStepsOfProcess = [];
            formData.value = { processStepId:-1, explanation:'', comparison:'', resultAction:'', 
                delayBefore:0, delayAfter:0, hnProcessId: props.hnProcessId, orderNo:999 };
        }
    };

    const formData: Ref<ProcessStepModel> = ref({ processStepId:-1, explanation:'', comparison:'', resultAction:'', 
                delayBefore:0, delayAfter:0, hnProcessId: props.hnProcessId, orderNo: 999 });

    const onSubmit = async() => {
        const procData = await logicService.getProcess(props.hnProcessId);

        if (formData.value.processStepId <= 0){
            formData.value.orderNo = allStepsOfProcess.length + 1;
            formData.value.delayBefore = parseInt(formData.value.delayBefore);
            formData.value.delayAfter = parseInt(formData.value.delayAfter);
            procData.steps.push(formData.value);
        }
        else
        {
            var currentProcData = procData.steps.find(d => d.processStepId == formData.value.processStepId);
            currentProcData.explanation = formData.value.explanation;
            currentProcData.comparison = formData.value.comparison;
            currentProcData.resultAction = formData.value.resultAction;
            currentProcData.delayBefore = parseInt(formData.value.delayBefore);
            currentProcData.delayAfter = parseInt(formData.value.delayAfter);
            currentProcData.isTestResult = formData.value.isTestResult;
        }

        await logicService.saveProcess(procData);

        emit('submit');
    };

    const onCancel = () => {
        emit('cancel');
    }

    watch(
    [
        () => props.visible,
        () => props.recordId,
        () => props.hnProcessId,
    ],
    ([isVisible]) => {
        if (isVisible)
            loadStep();
    },
    );

    loadStep();
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
          v-model="formData.explanation"
          :label="'Explanation'"
          :required="true"
        />
    <VFormText
        v-model="formData.comparison"
        :label="'Condition'"
        :required="true"
    />
    <VFormText
          v-model="formData.resultAction"
          :label="'Result Action'"
          :required="true"
        />

    <VFormCheck
        v-model="formData.isTestResult"
        :label="'Is Test Result?'"
        :required="true"
        class="col-span-2 h-10 w-20"
    />

    <div class="grid grid-cols-12">
        <VFormNumber
            v-model="formData.delayBefore"
            :label="'Delay (Before)'"
            :required="true"
            class="col-span-4"
        />
        <VFormNumber
            v-model="formData.delayAfter"
            :label="'Delay (After)'"
            :required="true"
            class="col-span-4"
        />
        <VFormCheck
            v-model="formData.waitUntilConditionRealized"
            :label="'Wait for Condition'"
            :required="true"
            class="col-span-2"
        />
        <VFormNumber
            v-model="formData.conditionRealizeTimeout"
            :label="'Condition Timeout'"
            :required="true"
            class="col-span-2"
        />
    </div>
  </VModalForm>
</template>
<style lang="postcss" scoped>

</style>
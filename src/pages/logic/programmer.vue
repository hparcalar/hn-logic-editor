<script setup lang="ts">
    import { computed, ref,onMounted } from 'vue';
    import type { Ref } from 'vue';
    import toolbarImageUrl from '../../assets/toolbar-header.png';
    import type { AppModel, ProcessModel, ProcessStepModel } from '../../models/node.models';
    import { LogicService } from '../../services/logic.service';
    import AppForm from '../../components/AppForm.vue';
    import ProcessForm from '../../components/ProcessForm.vue';
    import StepForm from '../../components/StepForm.vue';

    const logicService: LogicService = new LogicService();

    const appFormVisible: Ref<boolean> = ref(false);
    const processFormVisible: Ref<boolean> = ref(false);
    const stepFormVisible: Ref<boolean> = ref(false);

    const selectedAppId: Ref<number> = ref(-1);
    const selectedProcessId: Ref<number> = ref(-1);
    const selectedStepId: Ref<number> = ref(-1);

    const appModel: Ref<AppModel> = ref({});
    const processModel: Ref<ProcessModel> = ref({});
    const stepModel: Ref<ProcessStepModel> = ref({});

    const appList: Ref<AppModel[]> = ref([]);
    const processList: Ref<ProcessModel[]> = ref([]);

    onMounted(() => {
        loadAppList();
    });

    const loadAppList = async() => {
        appList.value.splice(0, appList.value.length);
        const data = await logicService.getApps();
        data.forEach(d => {
            appList.value.push(d);
        });
    }

    const loadProcessList = async() => {
        processList.value.splice(0, processList.value.length);

        if (appModel.value && appModel.value.hnAppId > 0){
            const data = await logicService.getProcesses();
            const ownedProcesses = data.filter(d => d.hnAppId === appModel.value.hnAppId);
            ownedProcesses.forEach(d => {
                processList.value.push(d);
            });
        }

        selectedProcessId.value = -1;
    }

    const onSelectedAppChanged = async() => {
        appModel.value = appList.value.find(d => d.hnAppId === selectedAppId.value);
        await loadProcessList();
        await loadProcessModel();
    }

    const onSelectedProcessChanged = () => {
        loadProcessModel();
    }
    
    const loadProcessModel = async() => {
        processModel.value = await logicService.getProcess(selectedProcessId.value);
        if (!processModel.value)
            processModel.value = { steps: [] };
    }

    //#region APP FORM EVENTS
    const onAppFormClosed = () => {
        appFormVisible.value = false;
    }

    const editApp = (id: number) => {
        if (id == -1)
            selectedAppId.value = -1;

        appFormVisible.value = true;
    }

    const onAppSubmit = () => {
        loadAppList();
        appFormVisible.value = false;
    }

    const onAppCancel = () => {
        appFormVisible.value = false;
    }
    //#endregion

    //#region PROCESS FORM EVENTS
    const editProcess = (id: number) => {
        if (selectedAppId.value <= 0){
            alert('First you have to select an app.');
            return;
        }
        
        if (id == -1)
            selectedProcessId.value = -1;

        processFormVisible.value = true;
    }

    const onProcessFormClosed = () => {
        processFormVisible.value = false;
    }

    const onProcessSubmit = () => {
        loadProcessList();
        processFormVisible.value = false;
    }

    const onProcessCancel = () => {
        processFormVisible.value = false;
    }
    //#endregion

    //#region STEP EVENTS
    const editStep = (id: number) => {
        if (selectedProcessId.value <= 0){
            alert('First you have to select a process.');
            return;
        }
        
        if (id == -1)
            selectedStepId.value = -1;
        else
            selectedStepId.value = id;

        stepFormVisible.value = true;
    }

    const removeStep = async(id: number) => {
        if (confirm('Are you sure to remove this step?')){
            const stepData: ProcessStepModel = processModel.value.steps.find(d => d.processStepId == id);
            processModel.value.steps.splice(
                processModel.value.steps.indexOf(stepData),
                1
            );

            await logicService.saveProcess(processModel.value);
        }
    }

    const onStepFormClosed = () => {
        stepFormVisible.value = false;
    }

    const onStepSubmit = () => {
        stepFormVisible.value = false;
        loadProcessModel();
    }

    const onStepCancel = () => {
        stepFormVisible.value = false;
    }
    //#endregion
</script>
<template>
    <div class="container-fluid flex flex-col h-screen">
        <div class="flex-row page-header">
            <h4>
                <i class="fa fa-edit"></i>
                Programmer
            </h4>
        </div>
        <div class="flex flex-row h-screen page-body">
            <!-- TOOLBAR -->
            <div class="flex-col toolbar h-screen">
                <div class="toolbar-header">
                    <span>Apps</span>
                </div>

                <button type="button" class="py-0 px-1 w-full bg-green-100 border-1 border-green-500 text-green-700"
                    @click="editApp(-1)">
                    Create App
                </button>

                <div class="flex flex-row">
                    <select v-model="selectedAppId" class="w-full p-1" @change="onSelectedAppChanged">
                        <option v-for="item in appList" :key="item.hnAppId" :value="item.hnAppId">
                            {{ item.appName }}
                        </option>
                    </select>
                    <button 
                        @click="editApp(selectedAppId)"
                        class="py-0 px-1 bg-blue-100 border-1 border-blue-500 text-blue-500">
                        <i class="fa fa-edit"></i>
                    </button>
                </div>

                <div class="toolbar-header mt-5">
                    <span>Processes</span>
                </div>

                <button type="button" class="py-0 px-1 w-full bg-green-100 border-1 border-green-500 text-green-700"
                    @click="editProcess(-1)">
                    Create Process
                </button>

                <div class="flex flex-row">
                    <select v-model="selectedProcessId" class="w-full p-1" @change="onSelectedProcessChanged">
                        <option v-for="item in processList" :key="item.hnProcessId" :value="item.hnProcessId">
                            {{ item.name }}
                        </option>
                    </select>
                    <button 
                        @click="editProcess(selectedProcessId)"
                        class="py-0 px-1 bg-blue-100 border-1 border-blue-500 text-blue-500">
                        <i class="fa fa-edit"></i>
                    </button>
                </div>
            </div>

            <!-- STEP EDITOR -->
            <div class="flex-col flex-auto h-full overflow-auto">
                <div class="w-full h-full">
                    <button type="button" class="py-0 px-1 w-full bg-green-100 border-1 border-green-500 text-green-700"
                        @click="editStep(-1)">
                        Create Step
                    </button>
                    <div class="flex flex-col">
                        <div class="step-container" v-for="item in processModel.steps" :key="item.processStepId">
                            <h6>
                                <b>{{item.orderNo}} - </b>
                                {{item.explanation}}
                                <button 
                                    @click="editStep(item.processStepId)"
                                    class="py-0 px-1 bg-blue-100 border-1 border-blue-500 text-blue-500">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button 
                                    @click="removeStep(item.processStepId)"
                                    class="py-0 ml-1 px-1 bg-red-100 border-1 border-red-500 text-red-500">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </h6>
                            <p><b>Condition</b>: {{item.comparison}}</p>
                            <p><b>Action</b>: {{item.resultAction}}</p>
                            <p><b>Delay Before</b>: {{item.delayBefore}} ms</p>
                            <p><b>Delay After</b>: {{item.delayAfter}} ms</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AppForm
      :visible="appFormVisible"
      :record-id="selectedAppId"
      @submit="onAppSubmit"
      @cancel="onAppCancel"
      @after-close="onAppFormClosed"
    >
    </AppForm>

    <ProcessForm
      :visible="processFormVisible"
      :record-id="selectedProcessId"
      :hn-app-id="selectedAppId"
      @submit="onProcessSubmit"
      @cancel="onProcessCancel"
      @after-close="onProcessFormClosed"
    >
    </ProcessForm>

    <StepForm
      :visible="stepFormVisible"
      :record-id="selectedStepId"
      :hn-process-id="selectedProcessId"
      @submit="onStepSubmit"
      @cancel="onStepCancel"
      @after-close="onStepFormClosed"
    >
    </StepForm>
</template>
<style lang="postcss" scoped>
.toolbar {
    @apply 'w-50 space-y-1 h-[calc(100%)] bg-gray-200 p-2 shadow shadow-dark-200';
}
.toolbar-header{
    @apply '';
    & span{
        @apply text-xs font-bold px-1
    }
    & img{
        height:32px;
        display: inline;
    }
}

.step-container {
    @apply p-2 my-1 border-1 border-blue-500 bg-blue-50 text-blue-500;
    p {
        @apply p-1 text-left my-0;
    }
    h6 {
        @apply text-left p-2 bg-yellow-50 text-yellow-500 border-1 border-yellow-500;
    }
}

.btn-tool-group-toggle{
    @apply 'p-1 border-1 text-xs font-bold bg-light-50 block w-[calc(100%)]';
}
.tool-group{
    @apply shadow shadow-dark-900;
    &.collapsed{
        & button.btn-tool-item{
            @apply hidden;
        }
    }
}
</style>
<script setup lang="ts">
    import { computed, ref,onMounted } from 'vue';
    import type { Ref } from 'vue';
    import toolbarImageUrl from '../../assets/toolbar-header.png';
    import type { AppModel, ProcessModel, ProcessStepModel } from '../../models/node.models';
    import { LogicService } from '../../services/logic.service';
    import AppForm from '../../components/AppForm.vue';
    import ProcessForm from '../../components/ProcessForm.vue';

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
    }

    const onSelectedAppChanged = async() => {
        appModel.value = appList.value.find(d => d.hnAppId === selectedAppId.value);
        await loadProcessList();
    }

    const onSelectedProcessChanged = () => {
        processModel.value = processList.value.find(d => d.hnProcessId === selectedProcessId.value);
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

    }

    const onStepFormClosed = () => {
        stepFormVisible.value = false;
    }

    const onStepSubmit = () => {
        stepFormVisible.value = false;
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
            <div class="flex-col flex-auto">
                <div class="w-full h-full">
                    <button type="button" class="py-0 px-1 w-full bg-green-100 border-1 border-green-500 text-green-700"
                        @click="editStep(-1)">
                        Create Step
                    </button>
                    <div class="flex flex-col">
                        <div v-for="item in processModel.steps" :key="item.ProcessStepId">1</div>
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
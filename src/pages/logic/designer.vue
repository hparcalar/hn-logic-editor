<script setup lang="ts">
    import { computed, ref, onMounted } from 'vue';
    import toolbarImageUrl from '../../assets/toolbar-header.png';
    import { DeviceFactory, DeviceTypes } from '../../models/device-factory';
    import LeaderLine from 'leader-line-vue';

    const devFactory = new DeviceFactory();

    const selectedDeviceType = ref(DeviceTypes.MOXA_STANDART);
    const deviceModel = computed(() => devFactory.getDeviceData(selectedDeviceType.value));
    const collapsedToolGroups = ref(['INPUTS', 'OUTPUTS']);

    const isCollapsed = (toolGroup: string) : boolean => {
        return collapsedToolGroups.value.some(d => d == toolGroup)
    }

    const toggleToolGroup = (toolGroup: string) : void => {
        if (isCollapsed(toolGroup))
            collapsedToolGroups.value.splice(collapsedToolGroups.value.indexOf(toolGroup), 1);
        else
            collapsedToolGroups.value.push(toolGroup);
    }

    onMounted(() => {
        // LeaderLine.setLine(
        //     document.getElementById('dg1'),
        //     document.getElementById('dg2'),
        //     {color:'blue', size:2}
        // );
    });
    
</script>
<template>
    <div class="container-fluid flex flex-col h-screen">
        <div class="flex-row page-header">
            <h4>
                <i class="fa fa-sitemap"></i>
                Logic Designer
            </h4>
        </div>
        <div class="flex flex-row h-screen page-body">
            <!-- TOOLBAR -->
            <div class="flex-col toolbar h-screen">
                <div class="toolbar-header">
                    <img :src="toolbarImageUrl" />
                    <span>Tools</span>
                </div>

                <!-- ACTION TOOL GROUP -->
                <div class="tool-group" 
                    :class="[{'collapsed': isCollapsed('ACTIONS')}]">
                    <button type="button" class="btn-tool-group-toggle" v-on:click="toggleToolGroup('ACTIONS')">
                        ACTIONS <i class="fa" 
                            :class="[{'fa-chevron-down': isCollapsed('ACTIONS'), 'fa-chevron-up': !isCollapsed('ACTIONS') }]"></i>
                    </button>
                    <!-- ACTIONS -->
                    <button type="button" class="btn-tool-item btn-action-item">
                        IF
                    </button>
                    <button type="button" class="btn-tool-item btn-action-item">
                        LOOP
                    </button>
                    <button type="button" class="btn-tool-item btn-action-item">
                        WAIT
                    </button>
                    <button type="button" class="btn-tool-item btn-action-item">
                        SET OUTPUT
                    </button>
                    <button type="button" class="btn-tool-item btn-action-item">
                        DO NOTHING
                    </button>
                </div>

                <!-- INPUT TOOL GROUP -->
                <div class="tool-group" 
                    :class="[{'collapsed': isCollapsed('INPUTS')}]">
                    <button type="button" class="btn-tool-group-toggle" v-on:click="toggleToolGroup('INPUTS')">
                        INPUTS <i class="fa" 
                            :class="[{'fa-chevron-down': isCollapsed('INPUTS'), 'fa-chevron-up': !isCollapsed('INPUTS') }]"></i>
                    </button>
                    <!-- INPUTS -->
                    <button type="button" class="btn-tool-item btn-input-item" v-for="input in deviceModel.inputs" :key="input.order">
                        IN {{ input.code }}
                    </button>
                </div>

                <!-- OUTPUT TOOL GROUP -->
                <div class="tool-group"
                    :class="[{'collapsed': isCollapsed('OUTPUTS')}]">
                    <button type="button" class="btn-tool-group-toggle" v-on:click="toggleToolGroup('OUTPUTS')">
                        OUTPUTS <i class="fa"
                            :class="[{'fa-chevron-down': isCollapsed('OUTPUTS'), 'fa-chevron-up': !isCollapsed('OUTPUTS') }]"></i>
                    </button>
                    <!-- OUTPUTS -->
                    <button type="button" class="btn-tool-item btn-output-item" v-for="input in deviceModel.outputs" :key="input.order">
                        OUT {{ input.code }}
                    </button>
                </div>
            </div>
            <!-- PLAYGROUND -->
            <div class="flex-col flex-auto">
                <div class="playground h-full">
                    <vue-resizable class="program-step action" id="dg1" fit-parent :top="0" :left="0" :width="180" height="auto" :minWidth="180" :minHeight="200"
                        drag-selector="h4">
                        <h4>IF</h4>
                        <p class="condition">INPUT-1 = TRUE</p>
                        <p class="body">
                            <span class="body-title">THEN</span>
                            <span class="body-action output">SET DO1 = TRUE</span>
                            <span class="body-action output">SET DO2 = FALSE</span>
                        </p>
                        <p class="else">
                            <span class="body-title">ELSE</span>
                            <span class="body-action action">DO NOTHING</span>
                        </p>
                    </vue-resizable>

                    <vue-resizable class="program-step action" id="dg2" fit-parent :top="10" :left="300" :width="180" height="auto" :minWidth="180" :minHeight="200"
                         drag-selector="h4">
                        <h4>IF</h4>
                        <p class="condition">INPUT-1 = TRUE</p>
                        <p class="body">THEN</p>
                        <p class="else">ELSE</p>
                    </vue-resizable>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="postcss" scoped>
.playground{
    @apply m-2 relative;
    background-image: url('../../assets/dot-grid.png');
    background-repeat: repeat-x repeat-y;
}
.resizable-component {
  position: absolute!important;
}
.program-step{
    @apply bg-light-50 border-1 border-gray-400 shadow shadow-dark-800 text-xs;
    & h4 {
        @apply cursor-move text-sm font-bold my-0 py-1;
    }
    & p.condition{
        @apply bg-amber-50 text-amber-500 py-2 my-0;
    }
    &.action{
        & h4 {
            @apply bg-amber-100 text-amber-500 border-b-1 border-b-amber-500 cursor-move;
        }
    }
    & p.body{
        @apply bg-green-50 text-green-500;
        & span.body-title{
            @apply border-b-green-300;
        }
    }
    & p.else{
        @apply bg-gray-100 text-gray-500;
        & span.body-title{
            @apply border-b-gray-300;
        }
    }
    & p.body, p.else{
        @apply my-0 py-2 px-2;
        & span.body-title{
            @apply block text-size-9px text-left py-1 border-b-1;
        }

        & span.body-action{
            @apply p-1 my-1 block;
            &.action{
                @apply bg-amber-100 text-amber-500 border-1 border-amber-500 rounded-sm;
            }
            &.output{
                @apply bg-blue-100 text-blue-500 border-1 border-blue-500 rounded-sm;
            }
        }
    }
}
.btn-tool-item {
    @apply 'p-1 border-1 text-sm font-bold block w-[calc(100%)]';
}
.btn-input-item {
    @apply 'bg-green-100 text-green-500 border-green-500';
}
.btn-output-item {
    @apply 'bg-blue-100 text-blue-500 border-blue-500';
}
.btn-action-item {
    @apply 'bg-amber-100 text-amber-500 border-amber-500';
}
.toolbar {
    @apply 'w-30 space-y-1 h-[calc(100%)] bg-gray-200 p-2 shadow shadow-dark-200';
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
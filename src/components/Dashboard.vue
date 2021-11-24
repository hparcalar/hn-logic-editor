<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit, watch, reactive } from 'vue';
    import { asyncComputed } from '@vueuse/core';
    import type { AppModel, ProcessModel, ProcessResultModel } from '../models/node.models';
    import VModalForm from './base/VModalForm.vue';
    import VFormText from './base/VFormText.vue';
    import { LogicService } from '../services/logic.service';
    import VFormNumber from './base/VFormNumber.vue';
    import VFormCheck from './base/VFormCheck.vue';
    import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";
    import moment from 'moment';
import ItemSelection from './ItemSelection.vue';

    const logicService: LogicService = new LogicService();

    const selectedAppId = ref(-1);
    const selectedProcId = ref(-1);
    const selectedItemId = ref(-1);
    const selectedItemCode = ref('');

    const appList = ref([]);
    const procList = ref([]);

    const lastViewedResultId = 0;
    const lastResult = ref({ id:0 });
    const lastPrintedId = ref(-1);

    const selectApp = (appId: number) => {
      selectedAppId.value = appId;
      selectedProcId.value = -1;
      loadProcesses();
    }

    const selectProc = (procId: number) => {
      selectedProcId.value = procId;
      loadResultData();
    }

    const appModel = computed(() => { 
      const foundApp = appList.value.find(d => d.hnAppId == selectedAppId.value);
      if (foundApp)
        return foundApp;
      
      return { appName: 'Dashboard' }
    });

    const procModel = computed(() => {
      const foundProc = procList.value.find(d => d.hnProcessId == selectedProcId.value);
      if (foundProc)
        return foundProc;

      return { name: '', procStatus: 0 };
    });

    const procStatus = ref(0);

    const testModel = ref({ status:'Test Bekleniyor', statusNo:0, result: true });

    const sendToPrinter = async(resultId) => {
      try {
        if (lastPrintedId.value == resultId)
          return;

        if (selectedItemId.value <= 0)
          return;

        lastPrintedId.value = resultId;

        await logicService.addToPrintQueue({
          printQueueId: 0,
          itemId: selectedItemId.value,
          itemCode: '',
          isPrinted: false,
          createdDate: moment().format('YYYY-MM-DD'),
        });
      } catch (error) {
        
      }
    }

    const testImage = () => {
      if (procStatus.value == 0){
        if (lastResult.value.id > 0 && lastResult.value.createdDate){
          // console.log(moment(new Date()).diff(moment(lastResult.value.createdDate), 'seconds'));
          if (moment(new Date()).diff(moment(lastResult.value.createdDate), 'seconds') < 5)
            console.log(lastResult.value);
            if (lastResult.value.isOk == true && lastPrintedId.value != lastResult.value.id){
              sendToPrinter(lastResult.value.id);
            }

            return lastResult.value.isOk == true ? 'test_ok.png' : 'test_nok.png';
        }
        
        // testModel.value.status = 'Yeni Test Bekleniyor';
        return 'test_waiting.png';
      }
      else{
        // testModel.value.status = 'Test Yapılıyor'
        return 'test_processing.gif';
      }
    }

    const testStatus = () => {
      if (procStatus.value == 0){
        if (lastResult.value.id > 0 && lastResult.value.createdDate){
          if (moment(lastResult.value.createdDate).diff(moment(new Date()), 'seconds') > -5)
            return 'Test Tamamlandı';
        }
        
        return 'Yeni Test Bekleniyor';
      }
      else{
        return 'Test Yapılıyor';
      }
    }

    const testResults = ref([]);

    const okCount = computed(() => testResults.value.filter(d => d.isOk == true).length);
    const nokCount = computed(() => testResults.value.filter(d => d.isOk == false).length);
    
    const dailyOkCount = computed(() => {
      return testResults.value
        .filter(d => moment(d.CreatedDate).format('DDMMYYYY') == moment().format('DDMMYYYY')
          && d.isOk == true).length;
    });

    const dailyNokCount = computed(() => {
      return testResults.value
        .filter(d => moment(d.CreatedDate).format('DDMMYYYY') == moment().format('DDMMYYYY')
          && d.isOk == false).length;
    });

    const weeklyOkCount = computed(() => {
      return testResults.value
        .filter(d => moment(d.CreatedDate) >= moment().subtract(7, 'days')
          && d.isOk == true).length;
    });

    const weeklyNokCount = computed(() => {
      return testResults.value
        .filter(d => moment(d.CreatedDate) >= moment().subtract(7, 'days')
          && d.isOk == false).length;
    });

    const chartRef = ref(null);
    const barChart = reactive({
      type: "bar",
      height:250,
      options: {
        min: 0,
        max: 50,
        responsive: false,
        plugins: {
          legend: {
            display:false,
          },
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function (value) {
                return `${value}%`;
              },
            },
          },
        },
      },
      data: {
        labels: ["OK", "Not OK"],
        datasets: [
          {
            label: "Test Sonuç Analizi",
            backgroundColor: ["#00ff00", "#ff0000"],
            data: [0, 0],
          },
        ],
      },
    });

    const loadResultData = async() => {
      const data: ProcessResultModel[] = await logicService.getResultsByProcess(selectedProcId.value);
      if (data)
        testResults.value = data.filter(d => d.isTestResult == true);
    }

    const loadItemData = async() => {
      const data = await logicService.getItem(selectedItemId.value);
      if (data){
        selectedItemCode.value = data.itemCode;
      }
    }

    const loadApps = async() => {
      const data = await logicService.getApps();
      if (data)
        appList.value = data;
    }

    const loadProcesses = async() => {
      const data = await logicService.getProcessesByApp(selectedAppId.value);
      if (data)
        procList.value = data;
    }

    let lastLiveDate = moment(new Date());
    let procLiveStatus = true;
    let checkProcLiveStatus = false;
    let conResetMessage = '';
    let conResetDelay = 0;

    const showResetMessage = () => {
      try {
        if(procLiveStatus == false)
          return 'Bağlantı: Başarısız';
        else{
          if (checkProcLiveStatus == true) {
            if (moment(new Date()).diff(lastLiveDate, 'seconds') >= conResetDelay){
              setTimeout(() => { checkProcLiveStatus=false; }, 5000);
              return conResetMessage;
            }
            else
              return 'Bağlantı: Bekleniyor'
          }
          else{
            return 'Bağlantı: OK'
          }
        }
      } catch (error) {
        
      }

      return '';
    }

    const liveMessage = ref('');

    const deviceConnectionStatus = computed(() => {
      return liveMessage.value.indexOf("OK") > -1;
    })

    const onItemSelected = (item) => {
      selectedItemId.value = item.itemId;
      loadItemData();
    }

    const onItemCancelled = () => {

    }

    watch(
    [
        () => okCount.value,
        () => nokCount.value,
    ],
    ([isVisible]) => {
        barChart.data.datasets[0].data[0] = okCount.value * 1.0 / (okCount.value + nokCount.value) * 100;
        barChart.data.datasets[0].data[1] = nokCount.value * 1.0 / (okCount.value + nokCount.value) * 100;
        chartRef.value.update(200);
    },
    );

    // ON LOAD EVENTS
    onMounted(() => {
      loadApps()

      setInterval(async() => {
        const data = await logicService.getLastResult(selectedProcId.value);
        if (data)
          lastResult.value = data;
        const procData = await logicService.getProcess(selectedProcId.value);
        
        if (procData) {
          procStatus.value = procData.procStatus;

          if (procLiveStatus != procData.isDeviceConnected){
            if (procData.isDeviceConnected == true)
              checkProcLiveStatus = true;
            else
              checkProcLiveStatus = false;

            procLiveStatus = procData.isDeviceConnected;
            conResetMessage = procData.connectionResetMessage;
            conResetDelay = procData.connectionResetMessageDelay;

            lastLiveDate = moment(new Date());
          }

          liveMessage.value = showResetMessage();
        }
      }, 500);

      setInterval(async() => {
        await loadResultData();
      }, 1000);
    })
</script>
<template>
  <div class="flex justify-start items-center px-4 bg-white">
    <router-link to="/">
        <img src="/heka.jpeg" class="h-40 !w-120">
    </router-link>
    <button class="w-full text-left px-5 font-bold text-4xl text-shadow-sm"
      @click="selectedAppId = -1"
    >{{ appModel.appName }} / {{ procModel.name }}</button>
    <button class="w-full text-left px-5 font-bold text-4xl text-shadow-sm" @click="selectedItemId = -1">
      <span class="text-blue-700">({{ selectedItemCode }})</span>
    </button>
    <span class="font-extrabold text-3xl w-full text-right" :class="deviceConnectionStatus ? 'text-green-500':'text-red-500'">{{ liveMessage }}</span>
  </div>
  <div class="flex flex-column h-full">
    <div class="flex flex-row h-1/2 border-t-1 border-gray-300">
        <!-- STATUS PANEL -->
        <div class="w-4/12 py-2 px-2 border-r-1 border-gray-300">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-ok-sign"></i>
                {{ testStatus() }}
            </p>
            <div class="items-center my-4">
                <img :src="testImage()" class="h-40 mx-auto" >
            </div>
        </div>
        <!-- CHART PANEL -->
        <div class="w-8/12 py-2 px-2">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-bar-chart"></i>
                TEST GRAFİĞİ
            </p>
            <vue3-chart-js class="mx-auto" ref="chartRef" :type="barChart.type"
        :data="barChart.data"
        :options="barChart.options" />
        </div>
    </div>
    <div class="flex flex-row h-1/2">
        <!-- REPORT PANEL -->
        <div class="w-4/12 py-2 px-2 border-r-1 border-t-1 border-b-1 border-gray-300">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-list"></i>
                RAPORLAR
            </p>
            <div class="flex flex-col justify-center">
                <button
                    class="border-1 font-bold py-5 w-1/2 mx-auto border-green-500 bg-green-50 text-green-500 px-4"
                    type="button">
                    <i class="fa fa-file-excel-o"></i>
                    EXCEL
                </button>
                <button
                    class="border-1 font-bold py-5 w-1/2 mx-auto my-2 border-red-500 bg-red-50 text-red-500 px-4"
                    type="button">
                    <i class="fa fa-file-pdf-o"></i>
                    PDF
                </button>
            </div>
            
        </div>
        <!-- STATS TABLE PANEL -->
        <div class="w-8/12 py-2 px-2 border-t-1 border-b-1 border-gray-300">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-bar-chart"></i>
                İSTATİSTİK TABLOSU
            </p>

            <table class="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>OK</th>
                    <th>NOK</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- <tr>
                    <td class="stats-category">Vardiya</td>
                    <td class="stats-table-ok">100</td>
                    <td class="stats-table-nok">5</td>
                  </tr> -->
                  <tr>
                    <td class="stats-category">Bugün</td>
                    <td class="stats-table-ok">{{dailyOkCount}}</td>
                    <td class="stats-table-nok">{{dailyNokCount}}</td>
                  </tr>
                  <tr>
                    <td class="stats-category">Bu Hafta</td>
                    <td class="stats-table-ok">{{weeklyOkCount}}</td>
                    <td class="stats-table-nok">{{weeklyNokCount}}</td>
                  </tr>
                  <tr>
                    <td class="stats-category">Bu Ay</td>
                    <td class="stats-table-ok">{{okCount}}</td>
                    <td class="stats-table-nok">{{nokCount}}</td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>

  <ItemSelection 
    :visible="selectedProcId > -1 && selectedItemId == -1"
    :title="'Malzeme Seçimi'"
    @submit="onItemSelected"
    @cancel="onItemCancelled"
  />

  <VModalForm
    class="app-list-form"
    :visible="selectedAppId == -1"
    :title="'Choose Application'"
    :description="''"
    :width="500"
    :isSubmitVisible="false"
    :isCancelVisible="false"
  >
    <div class="flex flex-column space-y-2">
      <button type="button" class="btn py-4 w-full" 
        @click="selectApp(item.hnAppId)"
        v-for="item in appList" :key="item.hnAppId">
        {{ item.appName }}
      </button>
    </div>
  </VModalForm>

  <VModalForm
    class="app-list-form"
    :visible="selectedProcId == -1 && selectedAppId > -1"
    :title="'Choose Process'"
    :description="''"
    :width="500"
    :isSubmitVisible="false"
    :isCancelVisible="false"
  >
    <div class="flex flex-column space-y-2">
      <button type="button" class="btn py-4 w-full" 
        @click="selectProc(item.hnProcessId)"
        v-for="item in procList" :key="item.hnProcessId">
        {{ item.name }}
      </button>
    </div>
  </VModalForm>
</template>
<style lang="postcss" scoped>
  .stats-category {
    @apply bg-blue-50 text-blue-500 border-b-1 border-blue-500 font-bold;
  }
  .stats-table-ok {
    @apply bg-green-50 text-green-500 border-b-1 border-green-500 font-bold;
  }

  .stats-table-nok {
    @apply bg-red-50 text-red-500 border-b-1 border-red-500 font-bold
  }

</style>
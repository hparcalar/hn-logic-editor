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
    import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

    const logicService: LogicService = new LogicService();

    const appModel = ref({ appName:'Test Dashboard' });
    const testModel = ref({ status:'Test Tamamlandı', result: true });

    const barChart = ref({
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
            data: [40, 20],
          },
        ],
      },
    });

</script>
<template>
  <div class="flex justify-start items-center px-4 bg-white">
    <router-link to="/">
        <img src="/heka.jpeg" class="h-30">
    </router-link>
    <span class="w-full text-left px-5 font-bold text-4xl text-shadow-sm">{{ appModel.appName }}</span>
  </div>
  <div class="flex flex-column h-full">
    <div class="flex flex-row h-1/2 border-t-1 border-gray-300">
        <!-- STATUS PANEL -->
        <div class="w-4/12 py-2 px-2 border-r-1 border-gray-300">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-ok-sign"></i>
                {{ testModel.status }}
            </p>
            <div class="items-center my-4">
                <img :src="testModel.result == true ? 'test_ok.png' : 'test_nok.png'" class="h-20 mx-auto" >
            </div>
        </div>
        <!-- CHART PANEL -->
        <div class="w-8/12 py-2 px-2">
            <p class="py-1 px-1 border-1 border-blue-500 bg-blue-50 text-blue-500 text-xl uppercase font-bold">
                <i class="fa fa-bar-chart"></i>
                TEST GRAFİĞİ
            </p>
            <vue3-chart-js class="mx-auto" v-bind="{ ...barChart }" />
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
                  <tr>
                    <td class="stats-category">Vardiya</td>
                    <td class="stats-table-ok">100</td>
                    <td class="stats-table-nok">5</td>
                  </tr>
                  <tr>
                    <td class="stats-category">Gün</td>
                    <td class="stats-table-ok">100</td>
                    <td class="stats-table-nok">5</td>
                  </tr>
                  <tr>
                    <td class="stats-category">Hafta</td>
                    <td class="stats-table-ok">100</td>
                    <td class="stats-table-nok">5</td>
                  </tr>
                  <tr>
                    <td class="stats-category">Ay</td>
                    <td class="stats-table-ok">100</td>
                    <td class="stats-table-nok">5</td>
                  </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
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
<script setup lang="ts">
    import { computed, ref, onMounted, defineProps, defineEmit, watch } from 'vue';
    import type { Ref } from 'vue';
    import type { AppModel, ItemModel, ProcessModel } from '../models/node.models';
    import VModalForm from './base/VModalForm.vue';
    import VFormText from './base/VFormText.vue';
    import { LogicService } from '../services/logic.service';
    import VFormCheck from './base/VFormCheck.vue';
    
    const logicService: LogicService = new LogicService();

    const props = defineProps({
        visible: {
            type: Boolean,
            default: false,
        },
        onSubmit: {},
        onCancel: {},
    });

    const emit = defineEmit({
        submit: (itemData: ItemModel) => true,
        cancel: () => true,
        'after-close': () => true,
    });

    const itemList = ref([]);
    const selectedItem: Ref<ItemModel> = ref({});

    const loadItems = async() => {
        const data = await logicService.getItems();
        if (data){
            itemList.value = data;
        }
    }

    const modalSize = ref(window.innerWidth * 0.7);

    const formData: Ref<ItemModel> = ref({ itemId: 0, itemCode: '', itemName: '', isActive: true });

    const selectItem = (item: ItemModel) => {
        emit('submit', item);
    }

    const editItem = (item: ItemModel) => {
        selectedItem.value = item;
        formData.value = item;
    }

    const filteredItemList = computed(() => {
        return itemList.value.filter(d => d.itemCode.includes(formData.value.itemCode))
    })

    const saveItem = async() => {
        if (formData.value.itemId <= 0){
            if (itemList.value.some(d => d.itemCode == formData.value.itemCode)){
                formData.value.itemId = itemList.value.find(d => d.itemCode == formData.value.itemCode).itemId;
            }
        }

        await logicService.saveItem(formData.value);

        alert('Kayıt başarılı.');

        await loadItems();
    }

    const onSubmit = async() => {
        // await logicService.saveItem(formData.value);
    };

    const onCancel = () => {
        emit('cancel');
    }

    watch(
    [
        () => props.visible,
    ],
    ([isVisible]) => {
        if (isVisible) {
            selectedItem.value = { itemId: 0, itemCode:'', itemName: '', isActive: true };
            formData.value = selectedItem.value;
            loadItems();
        }
    },
    );
</script>
<template>
    <VModalForm
    class="item-model-form"
    :visible="props.visible"
    :title="'Malzeme Seçimi'"
    :is-cancel-visible="false"
    :is-submit-visible="false"
    :description="''"
    :width="modalSize"
    :submit-text="'Seç'"
    :cancel-text="''"
    @cancel="onCancel"
    @submit="onSubmit"
    @after-close="emit('after-close')"
  >

    <div class="grid grid-cols-12">
        <VFormText
          v-model="formData.itemCode"
          :label="'Malzeme No'"
          :required="true"
          class="col-span-6 mx-2"
        />

        <VFormCheck 
            v-model="formData.isActive"
            :label="'Aktif'"
            :required="true"
            class="col-span-2 mx-2"
        />

        <button class="btn btn-primary col-span-4 mx-2" @click="saveItem">
            Kaydet
        </button>
    </div>
    
    <div class="grid grid-cols-12">
        <table class="table col-span-12">
            <thead>
                <tr>
                <th class="w-3/5">Malzeme No</th>
                <th class="w-2/5">#</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in filteredItemList" :key="item">
                    <td>{{ item.itemCode }}</td>
                    <td>
                        <button class="btn btn-sm btn-primary mx-2" @click="selectItem(item)">
                            SEÇ
                        </button>
                        <button class="btn btn-sm btn-warning mx-2" @click="editItem(item)">
                            DÜZENLE
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
  </VModalForm>
</template>
<style lang="postcss" scoped>

</style>
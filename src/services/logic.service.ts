import { AppModel, ItemModel, PrintQueueModel, ProcessModel, ProcessResultModel } from '../models/node.models';
import { ApiGeneric } from './base/api.generic';

export class LogicService {
  apiObject: ApiGeneric = new ApiGeneric();

  // #region APPS DATA
  async getApps() {
    const data = await this.apiObject.getAll('Apps');
    return data;
  }

  async getApp(id: number) {
    const data = await this.apiObject.get('Apps', id);
    return data;
  }

  async saveApp(model: AppModel) {
      return await this.apiObject.save('Apps', model);
  }
  // #endregion

  // #region PROCESS DATA
  async getProcesses() {
    const data = await this.apiObject.getAll('Process');
    return data;
  }

  async getProcessesByApp(appId: number) {
    const data = await this.apiObject.getAll('Apps/' + appId + '/process');
    return data;
  }

  async getProcess(id: number) {
    const data = await this.apiObject.get('Process', id);
    return data;
  }

  async saveProcess(model: ProcessModel) {
      return await this.apiObject.save('Process', model);
  }
  // #endregion

  // #region RESULTS DATA
  async getResults(appId: number) {
    const data = await this.apiObject.getAll('Results/App/' + appId);
    return data;
  }

  async getResultsByProcess(procId: number) {
    const data = await this.apiObject.getAll('Results/Process/' + procId);
    return data;
  }

  async getExcelOfProcess(procId: number) {
    const data = await this.apiObject.getAll('Results/DataSheet/Process/' + procId);
    return data;
  }

  async getLastResult(procId: number) {
    const data = await this.apiObject.get('Results/LastResult', procId);
    return data;
  }

  async getResult(id: number) {
    const data = await this.apiObject.get('Results', id);
    return data;
  }

  async saveResult(model: ProcessResultModel) {
      return await this.apiObject.save('Results', model);
  }
  // #endregion

  // #region ITEM DATA
  async getItems() {
    const data = await this.apiObject.getAll('Item');
    return data;
  }

  async getItem(itemId: number) {
    const data = await this.apiObject.getAll('Item/' + itemId);
    return data;
  }

  async saveItem(model: ItemModel) {
      return await this.apiObject.save('Item', model);
  }
  // #endregion

  // #region PRINT QUEUE MANAGEMENT
  async addToPrintQueue(model: PrintQueueModel) {
      return await this.apiObject.save('Print', model);
  }
  // #endregion
}

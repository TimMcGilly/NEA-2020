/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import { ResponseHandler } from '@/utils/response';
import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { ActivityCategory } from '../../../../shared';

import { moduleActionContext } from '../index';

export interface ActivityModuleState {
    activityCategories: ActivityCategory[];
}

const ActivityModule = defineModule({
  namespaced: true as true,
  state: {
    activityCategories: [],
  } as ActivityModuleState,
  mutations: {
    setActivityCatergory(state, activityCategories: ActivityCategory[]) {
      state.activityCategories = activityCategories;
    },
  },
  actions: {
    async fetchActivityCategoriesAsync(context) {
      const { commit, rootGetters } = ActivityModuleActionContext(context);

      const { token } = rootGetters;
      try {
        const res = new ResponseHandler(await axios.get('/api/activites/categories', {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));
        if (!res.isSuccess) { throw res.failArray; }

        commit.setActivityCatergory(res.data.activityCategories);
      } catch (error) {
        console.error(error);
      }
    },
  },

});
export default ActivityModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ActivityModuleActionContext = (context: any) => moduleActionContext(context, ActivityModule);

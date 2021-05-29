/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import { ResponseHandler } from '@/utils/response';
import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { SearchResult } from '../../../../shared';

import { moduleActionContext } from '../index';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchModuleState {}

const SearchModule = defineModule({
  namespaced: true as true,
  state: {
  } as SearchModuleState,
  mutations: {
  },
  actions: {
    async search(context, tripUUID: string): Promise<SearchResult[]> {
      const { rootGetters } = SearchModuleActionContext(context);

      const { token } = rootGetters;
      console.log(tripUUID);
      try {
        const res = new ResponseHandler(await axios.get('/api/search/individuals', {
          params: {
            uuid: tripUUID,
          },
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));
        if (!res.isSuccess) { throw res.failArray; }

        return res.data.searchResults;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

});
export default SearchModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchModuleActionContext = (context: any) => moduleActionContext(context, SearchModule);

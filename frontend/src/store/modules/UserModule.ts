/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-cycle */

import { ResponseHandler } from '@/utils/response';
import axios from 'axios';
import { defineModule } from 'direct-vuex';
import { PrivateUserDetails } from '../../../../shared';

import { moduleActionContext, moduleGetterContext } from '../index';

export interface UserModuleState {
  ownerDetails: PrivateUserDetails|null;
}

const UserModule = defineModule({
  namespaced: true as true,
  state: {
    ownerDetails: null,
  } as UserModuleState,
  mutations: {
    updateUser(state, user: PrivateUserDetails) {
      state.ownerDetails = user;
    },
  },
  actions: {
    async fetchUserAsync(context): Promise<string[]> {
      const { commit, rootGetters } = UserModuleActionContext(context);

      const { token } = rootGetters;

      try {
        const res = new ResponseHandler(await axios.get('/api/user', {
          headers: {
            Authorization: `Bearer ${await token}`, // send the access token through the 'Authorization' header
          },
        }));
        console.log(res);
        if (res.isSuccess) {
          commit.updateUser(new PrivateUserDetails(res.data.user));
          return [];
        }
        return res.failArray;
      } catch (error) {
        console.error(error);
        return ['Internal error'];
      }
    },
  },
});

export default UserModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserModuleActionContext = (context: any) => moduleActionContext(context, UserModule);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserModuleGetterContext = (args: [any, any, any, any]) => moduleGetterContext(args, UserModule);

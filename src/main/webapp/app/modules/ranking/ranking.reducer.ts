import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { getSession, displayAuthError } from 'app/shared/reducers/authentication';
import { isNullOrUndefined } from 'util';
import _ from 'lodash';
import { loadMoreDataWhenScrolled } from 'react-jhipster';
import { format } from 'path';
const apiUrl = 'api/ranking';

export const ACTION_TYPES = {
  SUBMIT: 'ranking/SUBMIT',
  GET_RESULTS: 'ranking/GET_RESULTS',
  GET_MORE_RESULTS: 'rankong/GET_MORE_RESULTS'
};

const initialState = {
  loading: false as boolean,
  progress: 0 as number,
  progressMsg: null as string,
  error: null as string,
  uuid: null as string,
  docs: null as any,
  meta: null as any
};

export type RankingState = Readonly<typeof initialState>;

// Reducer
export default (state: RankingState = initialState, action): RankingState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SUBMIT):
      return {
        ...state,
        loading: true,
        progress: 0,
        progressMsg: null,
        error: null,
        uuid: null,
        docs: null,
        meta: null
      };
    case REQUEST(ACTION_TYPES.GET_RESULTS):
      return state;
    case REQUEST(ACTION_TYPES.GET_MORE_RESULTS):
      return state;
    case FAILURE(ACTION_TYPES.SUBMIT):
    case FAILURE(ACTION_TYPES.GET_RESULTS):
    case FAILURE(ACTION_TYPES.GET_MORE_RESULTS): {
      const errorMsg = 'An unexpected error occurred during ranking';
      return {
        ...state,
        loading: false,
        progress: 0,
        progressMsg: null,
        error: errorMsg,
        uuid: null,
        docs: null,
        meta: null
      };
    }
    case SUCCESS(ACTION_TYPES.SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id
      };
    }
    case SUCCESS(ACTION_TYPES.GET_RESULTS): {
      const data = action.payload.data;

      let loading = true;
      let docs = null;
      let meta = null;
      if (data.docs) {
        loading = false;
        docs = data.docs;
        meta = data._meta;
      }

      return {
        ...state,
        loading,
        progress: data.progress,
        progressMsg: `${data.stage}: ${data.step}`,
        error: null,
        docs,
        meta
      };
    }
    case SUCCESS(ACTION_TYPES.GET_MORE_RESULTS): {
      const data = action.payload.data;

      let docs = null;
      let meta = null;
      if (data.docs) {
        docs = [...state.docs, ...data.docs];
        meta = data._meta;
      }

      return {
        ...state,
        error: null,
        docs,
        meta
      };
    }
    default:
      return state;
  }
};

// Actions

function formatPayload(metapath, constraints, folder) {
  const payload = { metapath, folder };

  payload['constraints'] = {};
  _.forOwn(constraints, (entityConstraint, entity) => {
    const e = entity.substr(0, 1);
    let entityConditions = [];

    _.forOwn(entityConstraint, ({ enabled, type, conditions }, field) => {
      if (enabled) {
        entityConditions = conditions
          .filter(element => element.value)
          .map(element => {
            let value;
            if (type === 'numeric') {
              value = parseInt(element.value, 10);
            } else {
              value = `'${element.value}'`;
            }
            return `${element.logicOp || ''} ${field} ${element.operation} ${value}`;
          });
      }

      if (entityConditions.length > 0) {
        payload['constraints'][e] = entityConditions.join(' ');
      }
    });
  });
  return payload;
}

export const rankingGetResults = id => ({
  type: ACTION_TYPES.GET_RESULTS,
  payload: axios.get(`${apiUrl}/get`, {
    params: {
      id
    }
  })
});

export const rankingGetMoreResults = (id, page) => ({
  type: ACTION_TYPES.GET_MORE_RESULTS,
  payload: axios.get(`${apiUrl}/get`, {
    params: {
      id,
      page
    }
  })
});

export const rankingRun = (metapath, constraints, folder) => {
  const payload = formatPayload(metapath, constraints, folder);

  return {
    type: ACTION_TYPES.SUBMIT,
    payload: axios.post(`${apiUrl}/submit`, payload)
  };
};

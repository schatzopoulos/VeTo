import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { getSession, displayAuthError } from 'app/shared/reducers/authentication';
import { isNullOrUndefined } from 'util';
import { forOwn } from 'lodash';
const apiUrl = 'api/ranking';

export const ACTION_TYPES = {
  SUBMIT: 'ranking/SUBMIT',
  GET_RESULTS: 'ranking/GET_RESULTS'
};

const initialState = {
  loading: false as boolean,
  progress: 0 as number,
  progressMsg: null as string,
  error: null as string,
  uuid: null as string,
  docs: null as any
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
        docs: null
      };
    case REQUEST(ACTION_TYPES.GET_RESULTS):
      return state;
    case FAILURE(ACTION_TYPES.SUBMIT):
    case FAILURE(ACTION_TYPES.GET_RESULTS): {
      const errorMsg = 'An unexpected error occurred during ranking';
      return {
        ...state,
        loading: false,
        progress: 0,
        progressMsg: null,
        error: errorMsg,
        uuid: null,
        docs: null
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
      let uuid = data.id;
      if (data.docs) {
        loading = false;
        docs = data.docs;
        uuid = null;
      }

      return {
        ...state,
        loading,
        progress: data.progress,
        progressMsg: `${data.stage}: ${data.step}`,
        error: null,
        uuid,
        docs
      };
    }
    default:
      return state;
  }
};

// Actions

export const rankingGetResults = id => ({
  type: ACTION_TYPES.GET_RESULTS,
  payload: axios.get(`${apiUrl}/get`, {
    params: {
      id
    }
  })
});

export const rankingRun = (metapath, constraints) => {
  const payload = { metapath };

  payload['constraints'] = {};
  forOwn(constraints, (entityConstraint, entity) => {
    const e = entity.substr(0, 1);
    const c = [];

    forOwn(entityConstraint, ({ enabled, operation, value }, field) => {
      if (enabled && operation && value) {
        c.push(`${field} ${operation} ${value}`);
      }
    });
    payload['constraints'][e] = c.join(' AND ');
  });

  console.log(payload);

  return {
    type: ACTION_TYPES.SUBMIT,
    payload: axios.post(`${apiUrl}/submit`, payload)
  };
};

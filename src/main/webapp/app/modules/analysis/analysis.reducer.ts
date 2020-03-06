import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
const rankingAPIUrl = 'api/ranking';
const simjoinAPIUrl = 'api/simjoin';
const simsearchAPIUrl = 'api/simsearch';

export const ACTION_TYPES = {
  RANKING_SUBMIT: 'ranking/SUBMIT',
  SIMJOIN_SUBMIT: 'simjoin/SUBMIT',
  SIMSEARCH_SUBMIT: 'simsearch/SUBMIT',

  GET_RESULTS: 'analysis/GET_RESULTS',
  GET_MORE_RESULTS: 'analysis/GET_MORE_RESULTS'
};

const initialState = {
  loading: false as boolean,
  progress: 0 as number,
  progressMsg: null as string,
  error: null as string,
  uuid: null as string,
  analysis: null as string,
  docs: null as any,
  meta: null as any
};

export type AnalysisState = Readonly<typeof initialState>;

// Reducer
export default (state: AnalysisState = initialState, action): AnalysisState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.RANKING_SUBMIT):
    case REQUEST(ACTION_TYPES.SIMJOIN_SUBMIT):
    case REQUEST(ACTION_TYPES.SIMSEARCH_SUBMIT):
      return {
        ...state,
        loading: true,
        progress: 0,
        progressMsg: null,
        error: null,
        uuid: null,
        analysis: null,
        docs: null,
        meta: null
      };
    case REQUEST(ACTION_TYPES.GET_RESULTS):
      return state;
    case REQUEST(ACTION_TYPES.GET_MORE_RESULTS):
      return state;
    case FAILURE(ACTION_TYPES.RANKING_SUBMIT):
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
        analysis: null,
        docs: null,
        meta: null
      };
    }
    case SUCCESS(ACTION_TYPES.RANKING_SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id,
        analysis: 'ranking'
      };
    }
    case SUCCESS(ACTION_TYPES.SIMSEARCH_SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id,
        analysis: 'simsearch'
      };
    }
    case SUCCESS(ACTION_TYPES.SIMJOIN_SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id,
        analysis: 'simjoin'
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

function formatPayload(metapath, constraints, folder, selectField) {
  const payload = { metapath, folder, selectField };

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

function getAPIUrl(analysisType) {
  let url;
  if (analysisType === 'ranking') {
    url = rankingAPIUrl;
  } else if (analysisType === 'simjoin') {
    url = simjoinAPIUrl;
  } else if (analysisType === 'simsearch') {
    url = simsearchAPIUrl;
  }
  return url;
}

export const getResults = (analysis, id) => {
  const url = getAPIUrl(analysis);

  return {
    type: ACTION_TYPES.GET_RESULTS,
    payload: axios.get(`${url}/get`, {
      params: {
        id
      }
    })
  };
};

export const getMoreResults = (analysis, id, page) => {
  const url = getAPIUrl(analysis);

  return {
    type: ACTION_TYPES.GET_MORE_RESULTS,
    payload: axios.get(`${url}/get`, {
      params: {
        id,
        page
      }
    })
  };
};

export const rankingRun = (metapath, constraints, folder, selectField) => {
  const payload = formatPayload(metapath, constraints, folder, selectField);

  return {
    type: ACTION_TYPES.RANKING_SUBMIT,
    payload: axios.post(`${rankingAPIUrl}/submit`, payload)
  };
};

export const simjoinRun = (metapath, constraints, folder, selectField) => {
  const payload = formatPayload(metapath, constraints, folder, selectField);

  // similarity-join specific values
  payload['k'] = 100;
  payload['t'] = 1;
  payload['w'] = 0;
  payload['minValues'] = 5;

  return {
    type: ACTION_TYPES.SIMJOIN_SUBMIT,
    payload: axios.post(`${simjoinAPIUrl}/submit`, payload)
  };
};

export const simsearchRun = (metapath, constraints, folder, selectField, targetEntity) => {
  const payload = formatPayload(metapath, constraints, folder, selectField);

  // similarity-searcg specific values
  payload['targetId'] = targetEntity;
  payload['k'] = 100;
  payload['t'] = 1;
  payload['w'] = 10;
  payload['minValues'] = 5;

  return {
    type: ACTION_TYPES.SIMSEARCH_SUBMIT,
    payload: axios.post(`${simsearchAPIUrl}/submit`, payload)
  };
};

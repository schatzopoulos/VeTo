import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import { min } from 'moment';
import { setFileData } from 'react-jhipster';
const analysisAPIUrl = 'api/analysis';

export const ACTION_TYPES = {
  ANALYSIS_SUBMIT: 'analysis/SUBMIT',
  GET_STATUS: 'analysis/GET_STATUS',
  GET_RESULTS: 'analysis/GET_RESULTS',
  GET_MORE_RESULTS: 'analysis/GET_MORE_RESULTS'
};

const initialState = {
  loading: false as boolean,
  progress: 0 as number,
  progressMsg: null as string,
  description: null as string,
  error: null as string,
  uuid: null as string,
  analysis: null as string,
  results: null as any,
  status: null as any
};

export type AnalysisState = Readonly<typeof initialState>;

// Reducer
export default (state: AnalysisState = initialState, action): AnalysisState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.ANALYSIS_SUBMIT):
      return {
        ...state,
        loading: true,
        progress: 0,
        progressMsg: null,
        description: null,
        error: null,
        uuid: null,
        analysis: null,
        results: {},
        status: null
      };
    case REQUEST(ACTION_TYPES.GET_STATUS):
    case REQUEST(ACTION_TYPES.GET_RESULTS):
    case REQUEST(ACTION_TYPES.GET_MORE_RESULTS):
      return state;

    case FAILURE(ACTION_TYPES.GET_STATUS):
    case FAILURE(ACTION_TYPES.ANALYSIS_SUBMIT):
    case FAILURE(ACTION_TYPES.GET_RESULTS):
    case FAILURE(ACTION_TYPES.GET_MORE_RESULTS): {
      const errorMsg = 'An unexpected error occurred during the analysis';
      return {
        ...state,
        loading: false,
        progress: 0,
        progressMsg: null,
        description: null,
        error: errorMsg,
        uuid: null,
        analysis: null,
        results: {}
      };
    }
    case SUCCESS(ACTION_TYPES.ANALYSIS_SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id,
        analysis: action.payload.data.analysis
      };
    }
    case SUCCESS(ACTION_TYPES.GET_STATUS): {
      const data = action.payload.data;
      return {
        ...state,
        loading: Object.values(data.completed).some(v => v === false), // when all analysis tasks have been completed
        status: data.completed,
        progress: data.progress,
        progressMsg: `${data.stage}: ${data.step}`,
        description: data.description,
        error: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_RESULTS): {
      const data = action.payload.data;
      const results = { ...state.results };
      results[data.analysis] = {
        docs: data.docs,
        meta: data._meta
      };

      return {
        ...state,
        error: null,
        results
      };
    }
    case SUCCESS(ACTION_TYPES.GET_MORE_RESULTS): {
      const data = action.payload.data;

      const results = { ...state.results };
      results[data.analysis] = {
        docs: [...results[data.analysis]['docs'], ...data.docs],
        meta: data._meta
      };

      return {
        ...state,
        error: null,
        results
      };
    }
    default:
      return state;
  }
};

// Actions

function formatPayload(analysis, metapath, joinpath, constraints, folder, selectField) {
  const payload = { analysis, metapath, joinpath, folder, selectField };

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

export const getStatus = id => {
  return {
    type: ACTION_TYPES.GET_STATUS,
    payload: axios.get(`${analysisAPIUrl}/status`, {
      params: {
        id
      }
    })
  };
};

export const getResults = (analysis, id) => {
  return {
    type: ACTION_TYPES.GET_RESULTS,
    payload: axios.get(`${analysisAPIUrl}/get`, {
      params: {
        id,
        analysis
      }
    })
  };
};

export const getMoreResults = (analysis, id, page) => {
  return {
    type: ACTION_TYPES.GET_MORE_RESULTS,
    payload: axios.get(`${analysisAPIUrl}/get`, {
      params: {
        id,
        analysis,
        page
      }
    })
  };
};

export const analysisRun = (analysis, metapath, joinpath, constraints, folder, selectField, targetEntity, w, minValues) => {
  const payload = formatPayload(analysis, metapath, joinpath, constraints, folder, selectField);
  payload['k'] = 100;
  payload['t'] = 1;
  payload['joinW'] = 0;
  payload['searchW'] = 10;
  payload['minValues'] = 5;

  return {
    type: ACTION_TYPES.ANALYSIS_SUBMIT,
    payload: axios.post(`${analysisAPIUrl}/submit`, payload)
  };
};

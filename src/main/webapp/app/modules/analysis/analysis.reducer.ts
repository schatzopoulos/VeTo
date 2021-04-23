import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
import { min } from 'moment';
import { setFileData } from 'react-jhipster';
import index from 'react-redux-loading-bar';

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
  analysesParameters: null as any,
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
        results: {}
      };
    }
    case SUCCESS(ACTION_TYPES.ANALYSIS_SUBMIT): {
      return {
        ...state,
        error: null,
        uuid: action.payload.data.id
      };
    }
    case SUCCESS(ACTION_TYPES.GET_STATUS): {
      const data = action.payload.data;
      return {
        ...state,
        loading: data.progress !== 100,
        progress: data.progress,
        progressMsg: data.description,
        error: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_RESULTS): {
      return {
        ...state,
        error: null,
        results: action.payload.data
      };
    }
    case SUCCESS(ACTION_TYPES.GET_MORE_RESULTS): {
      const data = action.payload.data;

      let results = { ...state.results };
      const existingDocs = results['docs'];

      results = {
        docs: [...existingDocs, ...data.docs],
        _meta: data._meta
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

function formatConstraints(payload, constraints) {
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

export const getResults = id => {
  return {
    type: ACTION_TYPES.GET_RESULTS,
    payload: axios.get(`${analysisAPIUrl}/get`, {
      params: {
        id
      }
    })
  };
};

export const getMoreResults = (id, page) => {
  return {
    type: ACTION_TYPES.GET_MORE_RESULTS,
    payload: axios.get(`${analysisAPIUrl}/get`, {
      params: {
        id,
        page
      }
    })
  };
};

export const analysisRun = (expertSet, simThreshold, simMinValues, simsPerExpert, apvWeight, aptWeight, outputSize) => {
  return {
    type: ACTION_TYPES.ANALYSIS_SUBMIT,
    payload: axios.post(`${analysisAPIUrl}/submit`, {
      expertSet,
      simThreshold,
      simMinValues,
      simsPerExpert,
      apvWeight,
      aptWeight,
      outputSize
    })
  };
};

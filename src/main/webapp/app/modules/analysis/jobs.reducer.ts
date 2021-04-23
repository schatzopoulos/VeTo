import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';

const analysisAPIUrl = 'api/analysis';
const simjoinAPIUrl = 'api/simjoin';
const simsearchAPIUrl = 'api/simsearch';

export const ACTION_TYPES = {
  GET_JOB: 'jobs/GET',
  GET_STATUS: 'jobs/GET_STATUS',
  GET_RESULTS: 'jobs/GET_RESULTS',
  GET_MORE_RESULTS: 'jobs/GET_MORE_RESULTS'
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

export type JobState = Readonly<typeof initialState>;

// Reducer
export default (state: JobState = initialState, action): JobState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.GET_JOB):
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
        results: {},
        status: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_JOB): {
      if (!action.payload.data.exists) {
        return {
          ...state,
          error: 'We were unable to locate the analysis with the specified analysis id.',
          loading: false
        };
      } else {
        return {
          ...state,
          error: null,
          uuid: action.payload.data.id,
          analysis: action.payload.data.analysis
        };
      }
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
export const getJob = id => {
  return {
    type: ACTION_TYPES.GET_JOB,
    payload: axios.get(`${analysisAPIUrl}/exists`, {
      params: {
        id
      }
    })
  };
};

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

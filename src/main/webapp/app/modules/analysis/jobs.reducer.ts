import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import _ from 'lodash';
const analysisAPIUrl = 'api/analysis';
const simjoinAPIUrl = 'api/simjoin';
const simsearchAPIUrl = 'api/simsearch';

export const ACTION_TYPES = {
  GET_JOB: 'jobs/GET',
  GET_RESULTS: 'jobs/GET_RESULTS',
  GET_MORE_RESULTS: 'jobs/GET_MORE_RESULTS'
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
    case FAILURE(ACTION_TYPES.GET_RESULTS):
    case FAILURE(ACTION_TYPES.GET_MORE_RESULTS): {
      const errorMsg = 'An unexpected error occurred during the analysis';
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
    case SUCCESS(ACTION_TYPES.GET_JOB): {
      if (!action.payload.data.exists) {
        return {
          ...state,
          error: 'We were unable to locate the analysis with the specified job id.',
          loading: false
        };
      } else {
        return {
          ...state,
          error: null,
          uuid: action.payload.data.id,
          analysis: 'ranking'
        };
      }
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

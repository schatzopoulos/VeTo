import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { getSession, displayAuthError } from 'app/shared/reducers/authentication';
import { isNullOrUndefined } from 'util';
import _ from 'lodash';
import { loadMoreDataWhenScrolled } from 'react-jhipster';
import { format } from 'path';
const apiUrl = 'api/datasets';

export const ACTION_TYPES = {
  UPLOAD: 'datasets/UPLOAD',
  GET_SCHEMAS: 'datasets/GET_SCHEMAS'
};

const initialState = {
  loading: false as boolean,
  error: null as string,
  success: false as boolean,
  schemas: null as any
};

export type DatasetsState = Readonly<typeof initialState>;

// Reducer
export default (state: DatasetsState = initialState, action): DatasetsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.UPLOAD):
      return {
        ...state,
        loading: true,
        success: false,
        error: null
      };
    case REQUEST(ACTION_TYPES.GET_SCHEMAS):
      return state;
    case FAILURE(ACTION_TYPES.UPLOAD):
    case FAILURE(ACTION_TYPES.GET_SCHEMAS): {
      const errorMsg = 'An unexpected error occurred while upload dataset';
      return {
        ...state,
        loading: false,
        success: false,
        error: errorMsg
      };
    }
    case SUCCESS(ACTION_TYPES.UPLOAD): {
      return {
        ...state,
        loading: false,
        success: true,
        error: null
      };
    }
    case SUCCESS(ACTION_TYPES.GET_SCHEMAS): {
      const schemas = action.payload.data;

      return {
        ...state,
        schemas
      };
    }

    default:
      return state;
  }
};

// Actions
export const getDatasetSchemas = () => ({
  type: ACTION_TYPES.GET_SCHEMAS,
  payload: axios.get(`${apiUrl}/schemas`)
});

export const uploadDataset = datafile => async dispatch => {
  const formData = new FormData();
  formData.append('file', datafile, datafile.name);

  const result = await dispatch({
    type: ACTION_TYPES.UPLOAD,
    payload: axios.post(`${apiUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data;'
      }
    })
  });

  // reload dataset schemas
  await dispatch(getDatasetSchemas());

  return result;
};

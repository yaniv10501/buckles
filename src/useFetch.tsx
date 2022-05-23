import { Dispatch, Reducer, ReducerAction, ReducerState, useReducer } from 'react';
import isFunction from 'lodash/isFunction';
import {
  LOADING,
  SILENT_LOADING,
  RESPONSE,
  FINISH_LOADING,
  NOTHING_FOUND,
  ERROR,
} from './reducerActions';

// Initial State

const initialState = {
  result: null,
  loading: true,
  silentLoading: false,
  isNothingFound: false,
  error: null,
};

/**
 * @function useThunkReducer
 * @description **--The dispatch will be used as the first arguemnt for the function (if a function was passed to the thunk dispatch), use compatible functions only!--**, This hook allow you to pass either an action string or a function to dispatch.
 * @example <caption>Example usage with argless function (only dispatch required)</caption>
 * const reducerFunction = (dispatch) => {
 *   dispatch({ type });
 * }
 *
 * const wrapperFunction = () => {
 *   thunkDispatch(reducerFunction);
 * }
 * @example <caption>Example usage with argfull function (more then just dispatch required)</caption>
 * const reducerFunction = (dispatch, ...args) => {
 *   dispatch({ type, payload: { ...args } });
 * }
 *
 * const wrapperFunction = (...args) => {
 *   reducerFunction(thunkDispatch, ...args);
 * }
 * @example <caption>Example usage 2 with argfull function (more then just dispatch required)</caption>
 * const reducerFunction = (dispatch, ...args) => {
 *   dispatch({ type, payload });
 * }
 *
 * const wrapperFunction = (...args) => {
 *   thunkDispatch(reducerFunction, ...args);
 * }
 *
 * @param {function} reducer - The reducer to be used.
 * @param {object} initState - Object with the initial state for the reducer.
 * @returns {[object, function]} An array with a state object and the thunkDispatch function.
 */

const useThunkReducer = (
  reducer: Reducer<ReducerState<any>, ReducerAction<any>>,
  initState: ReducerState<any>
): [unknown, Function] => {
  const [state, dispatch]: [unknown, Dispatch<any>] = useReducer(reducer, initState);

  const thunkDispatch = (action: any, ...args: any[]) => {
    if (isFunction(action)) {
      action(dispatch, ...args);
    } else {
      dispatch(action);
    }
  };

  return [state, thunkDispatch];
};

const fetchReducer = (
  state: {
    result: any;
    loading: boolean;
    silentLoading: boolean;
    isNothingFound: boolean;
    error: any;
  },
  action: { type: string; payload: any }
) => {
  if (action.type === LOADING) {
    return {
      ...state,
      result: null,
      loading: true,
      silentLoading: false,
      isNothingFound: false,
      error: null,
    };
  }
  if (action.type === SILENT_LOADING) {
    return {
      ...state,
      result: null,
      loading: false,
      silentLoading: true,
      isNothingFound: false,
      error: null,
    };
  }
  if (action.type === RESPONSE) {
    return {
      ...state,
      result: action.payload.response,
      silentLoading: false,
    };
  }
  if (action.type === NOTHING_FOUND) {
    return {
      ...state,
      result: action.payload.response,
      silentLoading: false,
      isNothingFound: true,
    };
  }
  if (action.type === FINISH_LOADING) {
    return {
      ...state,
      loading: false,
    };
  }
  if (action.type === ERROR) {
    return {
      ...state,
      result: null,
      loading: false,
      error: action.payload.error,
    };
  }
  return state;
};

/**
 * @function useFetch
 * @description This function will call a fetch request and dispatch actions based on functionOptions, by default loading won't set to false after a response, you will need to either use finishLoading() or use silentLoading. result state will update upon response with response.json(), for image request that need resoponse.blob() set image: true. error state will update upon error, errors will update loading state to false, to avoid update for loading state upon error on any request set mute: true (error state will still update).
 * @example <caption>Example with loading</caption>
 * const [state, thunkDispatch] = useThunkReducer(fetchReducer, url, initialPageState);
 * const { loading, result } = state;
 * useEffect(() => {
 *   Promise.all([listOfRequests]).then(() => finishLoading(thunkDispatch));
 * }, []);
 * return loading ? <Spinner /> : (
 * <>
 * // result state will update upon response with response.json()
 * // example usage with array response
 * {result && result.length > 0 && result.map((item) => (
 * ...
 * ))}
 * </>
 * );
 * @example <caption>Example with silentLoading</caption>
 * const [state, thunkDispatch] = useThunkReducer(fetchReducer, initialPageState);
 * const { silentLoading, result, error } = state;
 * const requestSomething = () => useFetch(thunkDispatch, url, someOptions, { silent: true });
 * return silentLoading ? <Spinner /> : (
 * <>
 * // error state will update upon errors
 * // example usage of dynamic message according to response status
 * {error ? error : 'Your request was successful!'}
 * </>
 * );
 * @example <caption>Example with muted request</caption>
 * const [state, thunkDispatch] = useThunkReducer(fetchReducer, initialPageState);
 * const { loading, result } = state;
 * const checkAuth = () => useFetch(thunkDispatch, url, someOptions, { mute: true });
 * useEffect(() => {
 * checkAuth().then((response) => {
 * if (response instanceof Error) {
 * ifNotAuthPromise().then(() => finishLoading(thunkDispatch))
 * } else {
 * ifAuthPromise().then(() => finishLoading(thunkDispatch))
 * }
 * });
 * }, []);
 * return loading ? <Spinner /> : (
 * <>
 * {result && result.length > 0 && result.map((item) => (
 * ...
 * ))}
 * </>
 * );
 * @example <caption>Example with image request</caption>
 * const [state, thunkDispatch] = useThunkReducer(fetchReducer, initialPageState);
 * const { silentLoading, result, error } = state;
 * const getImage = () => useFetch(thunkDispatch, url, someOptions, { silent: true, image: true });
 * useEffect(() => {
 * getImage();
 * }, []);
 * return silentLoading ? <Spinner /> : (
 * <>
 * {result ? <img src={result} /> : `Something went wrong :( ${error}`}
 * </>
 * );
 * @param {function} dispatch - The dispatch function to be called.
 * @param {string} url - The url of the request.
 * @param {object} options - Option for the feth request.
 * @param {object} functionOptions - Options for the function - **silent** - Set true for to enable silentLoading, will update to true on request start, will update to false on request end, **mute** - Set true to avoid updating loading to false upon errors, **image** - Set true for image request that need response.blob().
 * @param {boolean} functionOptions.silent - Set true for to enable silentLoading, will update to true on request start, will update to false on request end.
 * @param {boolean} functionOptions.mute - Set true to avoid updating loading to false upon errors.
 * @param {boolean} functionOptions.image - Set true for image request that need response.blob().
 * @returns {Promise} A prmoise that returns the parsed response or the error, can be used instead of result state.
 */

const useFetch = (
  dispatch: Dispatch<any>,
  url: string,
  options: object,
  functionOptions: {
    silent: boolean;
    mute: boolean;
    image: boolean;
  }
): Promise<any> => {
  const { silent = false, mute = false, image = false } = functionOptions || {};
  if (!silent) {
    dispatch({ type: LOADING });
  }
  if (silent) {
    dispatch({ type: SILENT_LOADING });
  }
  const fetchUrl = async () => {
    try {
      const response = await fetch(url, options);
      if (image) {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const imageBlob = await response.blob();
        const image = URL.createObjectURL(imageBlob);
        return image;
      }
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (
        !data ||
        (Array.isArray(data) && data.length < 1) ||
        (typeof data === 'object' && Object.keys(data).length < 1)
      ) {
        dispatch({ type: NOTHING_FOUND, payload: { response: data } });
        return data;
      }
      dispatch({ type: RESPONSE, payload: { response: data } });
      return data;
    } catch (error) {
      if (mute) {
        return error;
      }
      dispatch({ type: ERROR, payload: { error } });
      return error;
    }
  };

  return fetchUrl();
};

const finishLoading = (dispatch: Dispatch<any>) => {
  dispatch({ type: FINISH_LOADING });
};

export { useThunkReducer, fetchReducer, initialState, useFetch, finishLoading };

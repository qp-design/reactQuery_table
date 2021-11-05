import { useRef, useEffect } from 'react'
import {useQuery, useMutation, useQueryClient } from 'react-query'
import {useParamsContext} from "../../context";
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';
import set from 'lodash/set';

export const useMountedRef = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true
    return () => isMounted.current = false
  }, [])

  return isMounted
}

// 文档：https://react-query.tanstack.com/reference/useQuery#_top
export const useListQuery = ({ queryKey, api }, dependencies) => {
  const { setParams } = useParamsContext();
  const queryClient = useQueryClient();

  return useQuery(
    [queryKey, dependencies],
    () => {
      const controller = new AbortController()
      const signal = controller.signal
      const promise = api(dependencies, signal)
      // Cancel the request if React Query calls the `promise.cancel` method
      promise.cancel = () => controller.abort()
      return promise
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !isEmpty(dependencies),
      onSettled: (data, error) => {
        if(data.code !== '0') {
          setParams(null);
          queryClient.removeQueries([queryKey, dependencies], { exact: true });
        }
      }
    }
  )
}

export const useDeleteMutation = ({ queryKey, api, itemKey}, dependencies) => {
  return useMutation(
    (apiParams) => api(apiParams),
    useCallBack([queryKey, dependencies],
      (target, old) => {
        const arr = get(old, ['data', 'data'], [])
        set(old, ['data', 'data'], arr.filter(item => item[itemKey] !== target[itemKey]))
        return old
      }
    )
  )
}

export const useUpdateMutation = ({ queryKey, api, itemKey}, dependencies) => {
  return useMutation(
    (apiParams) => api(apiParams),
    useCallBack([queryKey, dependencies],
      (target, old) => {
        old.data = old.data?.data?.map(item => item[itemKey] === target[itemKey] ? { ...item, ...target } : item)
        return old
      }
    )
  )
}

const useCallBack = (queryKey, callback) => {
  const queryClient = useQueryClient()
  return {
    onMutate: async(variables) => {
      await queryClient.cancelQueries(queryKey)
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old) => {
        return callback(variables, old);
      });
      return { previousItems };
    },
    onSettled: (data, error, variables, context) => {
      if(data.code !== '0') {
        queryClient.setQueryData(queryKey, context.previousItems);
      } else {
        queryClient.invalidateQueries(queryKey)
      }
      // Error or success... doesn't matter!
    },
  }
}

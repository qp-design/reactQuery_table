import { useRef, useEffect } from 'react'
import {useQuery, useMutation, useQueryClient } from 'react-query'
import {useParamsContext} from "../../context";
import isEmpty from 'lodash/isEmpty';

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
      onError: (error) => {
        setParams(null);
        queryClient.removeQueries([queryKey, dependencies], { exact: true });
      },
    }
  )
}

export const useDeleteMutation = ({ queryKey, api, itemKey}, dependencies) => {
  return useMutation(
    (apiParams) => api(apiParams),
    useCallBack([queryKey, dependencies],
      (target, old) => {
        old.data = old.data?.filter(item => item[itemKey] !== target[itemKey])
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
        old.data = old.data?.map(item => item[itemKey] === target[itemKey] ? { ...item, ...target } : item)
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
    onError(error, variables, context) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
    onSuccess: (data, variables, context) => queryClient.invalidateQueries(queryKey),
    onSettled: (data, error, variables, context) => {
      // Error or success... doesn't matter!
    },
  }
}

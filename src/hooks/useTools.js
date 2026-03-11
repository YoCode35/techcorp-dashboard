import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getRecentTools,
    getAllTools,
    getAnalytics,
    getDepartments,
    createTool,
    updateTool,
    deleteTool,
} from '../utils/api'

export const useRecentTools = () =>
    useQuery({
        queryKey: ['recentTools'],
        queryFn: getRecentTools,
    })

export const useAllTools = () =>
    useQuery({
        queryKey: ['allTools'],
        queryFn: getAllTools,
    })

export const useAnalytics = () =>
    useQuery({
        queryKey: ['analytics'],
        queryFn: getAnalytics,
    })

export const useDepartments = () =>
    useQuery({
        queryKey: ['departments'],
        queryFn: getDepartments,
    })

export const useCreateTool = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createTool,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTools'] })
            queryClient.invalidateQueries({ queryKey: ['recentTools'] })
        },
    })
}

export const useUpdateTool = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }) => updateTool(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTools'] })
            queryClient.invalidateQueries({ queryKey: ['recentTools'] })
        },
    })
}

export const useDeleteTool = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteTool,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allTools'] })
            queryClient.invalidateQueries({ queryKey: ['recentTools'] })
        },
    })
}
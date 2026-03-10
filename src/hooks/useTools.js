import { useQuery } from '@tanstack/react-query'
import {
    getRecentTools,
    getAllTools,
    getAnalytics,
    getDepartments,
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
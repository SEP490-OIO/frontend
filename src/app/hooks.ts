/**
 * Typed Redux Hooks.
 *
 * These hooks replace the generic useDispatch and useSelector from react-redux.
 * They are pre-typed with our store's types, so:
 * - useAppDispatch() knows about all our action creators
 * - useAppSelector(state => ...) knows the exact shape of state
 *
 * Usage: import { useAppSelector, useAppDispatch } from '@/app/hooks';
 * Instead of: import { useSelector, useDispatch } from 'react-redux';
 */
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

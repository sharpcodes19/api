import React, { ReactElement } from 'react'
import {
	FieldValues,
	Path,
	Controller,
	Control,
	ControllerRenderProps,
	ControllerFieldState,
	UseFormStateReturn,
} from 'react-hook-form'

export type FormControlBaseProps<T extends FieldValues, K extends Path<T>> = {
	control: Control<T>
	name: K
}

type Props<T extends FieldValues, K extends Path<T>> = {
	children: (consume: {
		field: ControllerRenderProps<T, K>
		fieldState: ControllerFieldState
		formState: UseFormStateReturn<T>
	}) => ReactElement
}

export const FormControlBase = <T extends FieldValues, K extends Path<T>>({
	children,
	...rest
}: Props<T, K> & FormControlBaseProps<T, K>) => {
	return <Controller {...rest} render={(consume) => children(consume)} />
}

import { forwardRef } from 'react'
import './_index.scss'

type AvatarVariants = {
  /**
   * アバターのサイズ
   * @default 'm'
   */
  size?: 'xs' | 's' | 'm' | 'l'
}

type AvatarComponent = <TElementType extends 'img' | React.ComponentType<unknown> = 'img'>(
  props: AvatarProps<TElementType>
) => React.ReactElement

type AvatarProps<TElementType extends 'img' | React.ComponentType<unknown>> = Omit<
  React.ComponentPropsWithoutRef<TElementType>,
  'className' | 'as' | 'ref'
> & {
  as?: TElementType
  children?: React.ReactNode
} & AvatarVariants

/**
 * ユーザーのプロフィール画像を表示するアバターコンポーネント。
 * ユーザー一覧やコメント欄などで使用。
 *
 * @summary ユーザープロフィール画像
 */
const Avatar = forwardRef(function Avatar<
  TElementType extends 'img' | React.ComponentType<unknown> = 'img',
>(
  { as, children, size = 'm', ...rest }: AvatarProps<TElementType>,
  ref: React.Ref<React.ElementType>
) {
  const Component: React.ElementType = as ?? ('img' as React.ElementType)

  return (
    <Component
      className={`wip-avatar -size-${size}`}
      {...(as === 'img' && { type: 'img' })}
      {...rest}
      ref={ref}
    >
      {children}
    </Component>
  )
}) as AvatarComponent

export { Avatar }
export type { AvatarProps, AvatarVariants }

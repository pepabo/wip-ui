import { Button } from '../../../Button'
import { Grid, GridItem } from '../../../Grid'
import { Icon } from '../../../Icon'
import { Stack } from '../../../Stack'
import { Sticker } from '../../../Sticker'
import { Typography } from '../../../Typography'
import { Card } from './parts'

/**
 * プラン選択。申し込みウィザードとプラン変更の両方で使う。
 * 選択中のカードは elevation を上げ、それ以外は outlined にして差をつける。
 */

export type PlanId = 'lite' | 'standard' | 'business'

export type Plan = {
  id: PlanId
  name: string
  monthly: number
  storage: string
  sites: string
  support: string
  recommended?: boolean
}

export const plans: Plan[] = [
  {
    id: 'lite',
    name: 'ライト',
    monthly: 550,
    storage: '200 GB',
    sites: '1 サイト',
    support: 'メール',
  },
  {
    id: 'standard',
    name: 'スタンダード',
    monthly: 990,
    storage: '400 GB',
    sites: '無制限',
    support: 'メール・チャット',
    recommended: true,
  },
  {
    id: 'business',
    name: 'ビジネス',
    monthly: 2_970,
    storage: '1.2 TB',
    sites: '無制限',
    support: 'メール・チャット・電話',
  },
]

export const yen = (amount: number) => `¥${amount.toLocaleString('ja-JP')}`

export const PlanSelector = ({
  selected,
  current,
  onSelect,
}: {
  selected: PlanId
  /** 契約中のプラン。プラン変更画面で「現在のプラン」を示す */
  current?: PlanId
  onSelect: (id: PlanId) => void
}) => (
  <Grid spacing="m">
    {plans.map((plan) => {
      const isSelected = plan.id === selected
      const isCurrent = plan.id === current
      return (
        <GridItem key={plan.id} size={{ xxs: 12, m: 4 }}>
          <Card elevation={isSelected ? 3 : 0} outlined={!isSelected}>
            <Stack gap="m">
              <Stack gap="xxs">
                <Stack
                  flexDirection="row"
                  gap="xs"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography size="l" fontWeight="bold" component="h3">
                    {plan.name}
                  </Typography>
                  {isCurrent ? (
                    <Sticker color="neutral" size="s">
                      現在のプラン
                    </Sticker>
                  ) : plan.recommended ? (
                    <Sticker color="informative" size="s">
                      おすすめ
                    </Sticker>
                  ) : null}
                </Stack>
                <Stack flexDirection="row" gap="xxs" alignItems="flex-end">
                  <Typography size="xxl" fontWeight="bold" component="span">
                    {yen(plan.monthly)}
                  </Typography>
                  <Typography size="s" color="medium_emphasis" component="span">
                    / 月（税込）
                  </Typography>
                </Stack>
              </Stack>
              <Stack gap="xxs">
                {[
                  `ディスク容量 ${plan.storage}`,
                  `サイト数 ${plan.sites}`,
                  `サポート ${plan.support}`,
                ].map((line) => (
                  <Stack key={line} flexDirection="row" gap="xs" alignItems="center">
                    <Icon name="check" size="s" />
                    <Typography size="s" component="span">
                      {line}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Button
                appearance={isSelected ? 'flat' : 'outlined'}
                color={isSelected ? 'interactive' : 'neutral'}
                width="full"
                isDisabled={isCurrent}
                onPress={() => onSelect(plan.id)}
                leading={isSelected ? <Icon name="check" size="s" /> : undefined}
              >
                {isCurrent ? '契約中' : isSelected ? '選択中' : 'このプランを選ぶ'}
              </Button>
            </Stack>
          </Card>
        </GridItem>
      )
    })}
  </Grid>
)

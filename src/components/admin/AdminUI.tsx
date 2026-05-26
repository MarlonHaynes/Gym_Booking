import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils'
import { monthlyRevenue } from '../../data/mockAuth'
import type { BookingStatus, MemberStatus, TierName } from '../../types'
import styles from './AdminUI.module.css'

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon?: React.ReactNode
  loading?: boolean
}

export function StatCard({ label, value, trend, trendUp, icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className={styles.skeletonCard}>
        <div className={cn(styles.skeletonLine, styles.skeletonLineSm)} />
        <div className={cn(styles.skeletonLine, styles.skeletonLineLg)} style={{ width: '55%' }} />
        <div className={cn(styles.skeletonLine, styles.skeletonLineSm)} style={{ width: '40%' }} />
      </div>
    )
  }
  return (
    <div className={styles.statCard}>
      {icon && <div className={styles.statCardIcon}>{icon}</div>}
      <p className={styles.statCardLabel}>{label}</p>
      <p className={styles.statCardValue}>{value}</p>
      {trend && (
        <div className={styles.statCardMeta}>
          {trendUp !== undefined && (
            trendUp
              ? <TrendingUp size={12} className={styles.statCardTrendUp} />
              : <TrendingDown size={12} className={styles.statCardTrendDown} />
          )}
          <span className={trendUp ? styles.statCardTrendUp : trendUp === false ? styles.statCardTrendDown : ''}>
            {trend}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Badges ───────────────────────────────────────────────────────────────────
export function BookingBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={cn(
      styles.badge,
      status === 'confirmed' && styles.badgeConfirmed,
      status === 'completed' && styles.badgeCompleted,
      status === 'cancelled' && styles.badgeCancelled,
      status === 'no-show' && styles.badgeNoShow,
    )}>
      {status}
    </span>
  )
}

export function MemberBadge({ status }: { status: MemberStatus | 'cancelled' }) {
  return (
    <span className={cn(
      styles.badge,
      status === 'active' && styles.badgeActive,
      status === 'suspended' && styles.badgeSuspended,
      status === 'cancelled' && styles.badgeCancelled,
    )}>
      {status}
    </span>
  )
}

export function TierBadge({ tier }: { tier: TierName | 'Initiate' | 'Adept' | 'Sovereign' }) {
  return (
    <span className={cn(
      styles.badge,
      tier === 'Initiate' && styles.badgeInitiate,
      tier === 'Adept' && styles.badgeAdept,
      tier === 'Sovereign' && styles.badgeSovereign,
    )}>
      {tier || 'None'}
    </span>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <p className={styles.emptyStateTitle}>{title}</p>
      <p className={styles.emptyStateText}>{text}</p>
    </div>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
export function ConfirmModal({
  title,
  text,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  dangerous = true,
  onConfirm,
  onCancel,
}: {
  title: string
  text?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  dangerous?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className={styles.modalBackdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalText}>{text || message}</p>
        <div className={styles.modalActions}>
          <button className={styles.modalBtnCancel} onClick={onCancel}>{cancelLabel}</button>
          <button
            className={cn(styles.modalBtnConfirm, !dangerous && styles.modalBtnConfirmSafe)}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Revenue Chart ────────────────────────────────────────────────────────────
function formatChartMonth(month: string, year: number) {
  return `${month} '${String(year).slice(-2)}`
}

export function RevenueChart() {
  const data = monthlyRevenue.slice(-12)
  const max = Math.max(...data.map(m => m.revenue))
  const lastIndex = data.length - 1

  return (
    <div className={styles.revenueChartCard}>
      <div className={styles.revenueChartHeader}>
        <p className={styles.revenueChartTitle}>Monthly Revenue</p>
        <p className={styles.revenueChartSubtitle}>Last 12 months · hover bars for totals</p>
      </div>
      <div className={styles.revenueChartBody}>
        <div className={styles.revenueChartAxis} aria-hidden>
          <span>${Math.round(max / 1000)}k</span>
          <span>${Math.round(max / 2000)}k</span>
          <span>$0</span>
        </div>
        <div className={styles.revenueChart}>
          <div className={styles.revenueChartBars}>
            {data.map((m, i) => (
              <div key={`${m.month}-${m.year}`} className={styles.revenueBarWrap}>
                <span className={styles.revenueBarTooltip}>
                  ${m.revenue.toLocaleString()}
                </span>
                <div
                  className={cn(
                    styles.revenueBar,
                    i === lastIndex && styles.revenueBarHighlight,
                  )}
                  style={{ height: `${(m.revenue / max) * 100}%` }}
                />
                <span className={styles.revenueBarLabel}>
                  {formatChartMonth(m.month, m.year)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { styles as adminStyles }

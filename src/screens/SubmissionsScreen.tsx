import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSubmissions } from '../context/SubmissionsContext';
import { CAMPAIGNS, Submission } from '../data/campaigns';
import { COLORS, SPACING, RADIUS } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Submissions'>;

const STATUS_CONFIG = {
  pending: { color: COLORS.pending, bg: '#FFD16618', icon: '⏳', label: 'Under Review' },
  approved: { color: COLORS.approved, bg: '#06D6A018', icon: '✅', label: 'Approved' },
  rejected: { color: COLORS.error, bg: '#FF6B6B18', icon: '❌', label: 'Not Approved' },
};

export default function SubmissionsScreen({ navigation }: Props) {
  const { submissions } = useSubmissions();

  const enriched = submissions.map((s) => ({
    ...s,
    campaign: CAMPAIGNS.find((c) => c.id === s.campaignId),
  }));

  const approved = enriched.filter((s) => s.status === 'approved');
  const pending = enriched.filter((s) => s.status === 'pending');
  const rejected = enriched.filter((s) => s.status === 'rejected');

  const totalEarned = approved.reduce(
    (acc, s) => acc + (s.campaign?.payoutPerVideo ?? 0),
    0
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>My Submissions</Text>
        <Text style={styles.subtitle}>{submissions.length} total</Text>
      </View>

      {/* Earnings summary */}
      <View style={styles.earningsCard}>
        <View style={styles.earningsRow}>
          <View style={styles.earningsStat}>
            <Text style={styles.earningsAmount}>${totalEarned}</Text>
            <Text style={styles.earningsLabel}>Total Earned</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStat}>
            <Text style={[styles.earningsAmount, { color: COLORS.pending }]}>{pending.length}</Text>
            <Text style={styles.earningsLabel}>Pending</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStat}>
            <Text style={[styles.earningsAmount, { color: COLORS.approved }]}>{approved.length}</Text>
            <Text style={styles.earningsLabel}>Approved</Text>
          </View>
          <View style={styles.earningsDivider} />
          <View style={styles.earningsStat}>
            <Text style={[styles.earningsAmount, { color: COLORS.error }]}>{rejected.length}</Text>
            <Text style={styles.earningsLabel}>Rejected</Text>
          </View>
        </View>
      </View>

      {submissions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No submissions yet</Text>
          <Text style={styles.emptySubtitle}>
            Browse campaigns and submit your first video to get started.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('CampaignList')}
          >
            <Text style={styles.emptyButtonText}>Browse Campaigns →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={enriched}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <SubmissionCard item={item} navigation={navigation} />}
        />
      )}
    </SafeAreaView>
  );
}

function SubmissionCard({ item, navigation }: { item: any; navigation: any }) {
  const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
  const date = new Date(item.submittedAt);
  const dateStr = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: config.color, borderLeftWidth: 3 }]}
      onPress={() =>
        item.campaign && navigation.navigate('CampaignDetail', { campaignId: item.campaign.id })
      }
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardBrand}>
          <Text style={styles.cardBrandEmoji}>{item.campaign?.brandLogo ?? '📦'}</Text>
          <View>
            <Text style={styles.cardBrandName}>{item.campaign?.brandName ?? 'Unknown Brand'}</Text>
            <Text style={styles.cardCampaignTitle} numberOfLines={1}>
              {item.campaign?.title ?? 'Campaign'}
            </Text>
          </View>
        </View>
        <View style={[styles.statusPill, { backgroundColor: config.bg }]}>
          <Text style={[styles.statusPillText, { color: config.color }]}>
            {config.icon} {config.label}
          </Text>
        </View>
      </View>

      {/* URL */}
      <View style={styles.urlRow}>
        <Text style={styles.urlIcon}>🔗</Text>
        <Text style={styles.urlText} numberOfLines={1}>
          {item.videoUrl}
        </Text>
      </View>

      {/* Feedback */}
      {item.feedback && (
        <View style={[styles.feedbackBox, { backgroundColor: config.bg }]}>
          <Text style={styles.feedbackLabel}>Brand Feedback</Text>
          <Text style={[styles.feedbackText, { color: config.color }]}>{item.feedback}</Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>📅 {dateStr}</Text>
        {item.campaign && (
          <Text style={[styles.payoutText, { color: config.color }]}>
            {item.status === 'approved' ? `+$${item.campaign.payoutPerVideo}` : `$${item.campaign.payoutPerVideo}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  earningsCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  earningsRow: { flexDirection: 'row' },
  earningsStat: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
  earningsDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  earningsAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 2,
  },
  earningsLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listContent: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 100 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  cardBrand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flex: 1 },
  cardBrandEmoji: { fontSize: 22 },
  cardBrandName: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary },
  cardCampaignTitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1, maxWidth: 180 },
  statusPill: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
  },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  urlIcon: { fontSize: 13 },
  urlText: { flex: 1, fontSize: 12, color: COLORS.textMuted },
  feedbackBox: {
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  feedbackLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  feedbackText: { fontSize: 13, fontWeight: '500', lineHeight: 19 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: 4,
  },
  dateText: { fontSize: 11, color: COLORS.textMuted },
  payoutText: { fontSize: 14, fontWeight: '700' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  emptySubtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 21, marginBottom: SPACING.lg },
  emptyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: 13,
  },
  emptyButtonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});

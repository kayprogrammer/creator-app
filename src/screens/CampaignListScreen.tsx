import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CAMPAIGNS, Campaign } from '../data/campaigns';
import { useSubmissions } from '../context/SubmissionsContext';
import { COLORS, SPACING, RADIUS } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CampaignList'>;

const CATEGORIES = ['All', 'Food & Drink', 'Health & Fitness', 'Beauty', 'Tech'];

export default function CampaignListScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const { submissions } = useSubmissions();

  const filtered =
    activeFilter === 'All'
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === activeFilter);

  const getSubmissionForCampaign = (id: string) =>
    submissions.find((s) => s.campaignId === id);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.title}>Campaigns</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>🎬</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{CAMPAIGNS.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid]}>
            <Text style={[styles.statNumber, { color: COLORS.pending }]}>
              {submissions.filter((s) => s.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: COLORS.approved }]}>
              {submissions.filter((s) => s.status === 'approved').length}
            </Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
              onPress={() => setActiveFilter(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === cat && styles.filterChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Campaign list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const submission = getSubmissionForCampaign(item.id);
            return (
              <CampaignCard
                campaign={item}
                submission={submission}
                onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

type CardProps = {
  campaign: Campaign;
  submission?: { status: string };
  onPress: () => void;
};

function CampaignCard({ campaign, submission, onPress }: CardProps) {
  const urgency = campaign.spotsLeft <= 3;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Brand header */}
      <View style={styles.cardHeader}>
        <View style={styles.brandRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>{campaign.brandLogo}</Text>
          </View>
          <View style={styles.brandInfo}>
            <Text style={styles.brandName}>{campaign.brandName}</Text>
            <Text style={styles.category}>{campaign.category}</Text>
          </View>
        </View>
        <View style={styles.payoutBadge}>
          <Text style={styles.payoutAmount}>${campaign.payoutPerVideo}</Text>
          <Text style={styles.payoutLabel}>per video</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.cardTitle}>{campaign.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {campaign.description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {campaign.tags.slice(0, 3).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerLeft}>
          <View style={[styles.deadlinePill, urgency && styles.deadlinePillUrgent]}>
            <Text style={[styles.deadlineText, urgency && styles.deadlineTextUrgent]}>
              ⏰ {campaign.deadlineLabel}
            </Text>
          </View>
          <Text style={styles.spotsText}>
            {urgency ? '🔥 ' : ''}{campaign.spotsLeft} spots left
          </Text>
        </View>
        {submission ? (
          <StatusBadge status={submission.status} />
        ) : (
          <View style={styles.applyButton}>
            <Text style={styles.applyButtonText}>View Brief →</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; label: string; icon: string }> = {
    pending: { bg: '#FFD16620', color: COLORS.pending, label: 'Pending', icon: '⏳' },
    approved: { bg: '#06D6A020', color: COLORS.approved, label: 'Approved', icon: '✅' },
    rejected: { bg: '#FF6B6B20', color: COLORS.error, label: 'Rejected', icon: '❌' },
  };
  const c = config[status] || config.pending;
  return (
    <View style={[styles.statusBadge, { backgroundColor: c.bg }]}>
      <Text style={[styles.statusBadgeText, { color: c.color }]}>
        {c.icon} {c.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  greeting: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: -0.5 },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: { fontSize: 20 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardMid: { borderColor: COLORS.primary + '60' },
  statNumber: { fontSize: 22, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  filterScroll: { maxHeight: 48 },
  filterContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  listContent: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 100 },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgCardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoEmoji: { fontSize: 18 },
  brandInfo: {},
  brandName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  category: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  payoutBadge: { alignItems: 'flex-end' },
  payoutAmount: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  payoutLabel: { fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase' },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    letterSpacing: -0.2,
  },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: SPACING.sm },
  tagsRow: { flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md, flexWrap: 'wrap' },
  tag: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, color: COLORS.textMuted },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  footerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  deadlinePill: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deadlinePillUrgent: {
    backgroundColor: '#FF6B6B15',
    borderColor: COLORS.error + '60',
  },
  deadlineText: { fontSize: 11, color: COLORS.textSecondary },
  deadlineTextUrgent: { color: COLORS.error },
  spotsText: { fontSize: 11, color: COLORS.textMuted },
  applyButton: {
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  applyButtonText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600' },
  statusBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },
});

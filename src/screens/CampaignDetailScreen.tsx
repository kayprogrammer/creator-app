import React, { useState, useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Animated,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CAMPAIGNS } from '../data/campaigns';
import { useSubmissions } from '../context/SubmissionsContext';
import { COLORS, SPACING, RADIUS } from '../theme/tokens';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CampaignDetail'>;

const TIKTOK_RE = /^https?:\/\/(www\.)?tiktok\.com\/.+/i;
const INSTAGRAM_RE = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/.+/i;

function isValidVideoUrl(url: string): boolean {
  return TIKTOK_RE.test(url.trim()) || INSTAGRAM_RE.test(url.trim());
}

export default function CampaignDetailScreen({ navigation, route }: Props) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { campaignId } = route.params;
  const { addSubmission, getSubmissionByCampaign } = useSubmissions();

  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [fullscreenVideo, setFullscreenVideo] = useState<any | null>(null);

  const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
  const [activeTab, setActiveTab] = useState<'brief' | 'examples'>('brief');

  const submission = campaign ? getSubmissionByCampaign(campaign.id) : undefined;

  if (!campaign) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={{ color: COLORS.textPrimary, padding: 20 }}>Campaign not found.</Text>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setUrlError('Please enter a video URL.');
      return;
    }
    if (!isValidVideoUrl(trimmed)) {
      setUrlError('Please enter a valid TikTok or Instagram Reel URL.');
      return;
    }
    addSubmission({ campaignId: campaign.id, videoUrl: trimmed });
    setSubmitModalVisible(false);
    setVideoUrl('');
    setUrlError('');
    Alert.alert('🎉 Submitted!', 'Your video has been submitted and is under review.', [
      { text: 'View Status', onPress: () => navigation.navigate('Submissions') },
      { text: 'OK' },
    ]);
  };

  const statusConfig: Record<string, { bg: string; color: string; label: string; icon: string; desc: string }> = {
    pending: { bg: '#FFD16620', color: COLORS.pending, label: 'Under Review', icon: '⏳', desc: "We've received your submission and it's being reviewed." },
    approved: { bg: '#06D6A020', color: COLORS.approved, label: 'Approved!', icon: '✅', desc: "Your submission has been approved. Payment will be processed shortly." },
    rejected: { bg: '#FF6B6B20', color: COLORS.error, label: 'Not Approved', icon: '❌', desc: submission?.feedback || 'Your submission did not meet the requirements.' },
  };

  const canSubmit = !submission;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Campaign Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroBrand}>
            <View style={styles.heroLogo}>
              <Text style={styles.heroLogoEmoji}>{campaign.brandLogo}</Text>
            </View>
            <View>
              <Text style={styles.heroBrandName}>{campaign.brandName}</Text>
              <Text style={styles.heroCategory}>{campaign.category}</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{campaign.title}</Text>
          <Text style={styles.heroDesc}>{campaign.description}</Text>

          {/* Key metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>${campaign.payoutPerVideo}</Text>
              <Text style={styles.metricLabel}>Payout</Text>
            </View>
            <View style={[styles.metricCard, styles.metricDivider]}>
              <Text style={styles.metricValue}>{campaign.deadlineLabel}</Text>
              <Text style={styles.metricLabel}>Deadline</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, campaign.spotsLeft <= 3 && { color: COLORS.error }]}>
                {campaign.spotsLeft}/{campaign.totalCreators}
              </Text>
              <Text style={styles.metricLabel}>Spots</Text>
            </View>
          </View>

          {/* Platform badges */}
          <View style={styles.platformRow}>
            {campaign.platform.map((p) => (
              <View key={p} style={styles.platformBadge}>
                <Text style={styles.platformBadgeText}>{p === 'TikTok' ? '🎵' : '📸'} {p}</Text>
              </View>
            ))}
            <View style={styles.platformBadge}>
              <Text style={styles.platformBadgeText}>👥 {campaign.minFollowers.toLocaleString()}+ followers</Text>
            </View>
          </View>
        </View>

        {/* Submission status banner */}
        {submission && (
          <View style={[styles.statusBanner, { backgroundColor: statusConfig[submission.status].bg }]}>
            <Text style={[styles.statusBannerIcon]}>{statusConfig[submission.status].icon}</Text>
            <View style={styles.statusBannerText}>
              <Text style={[styles.statusBannerTitle, { color: statusConfig[submission.status].color }]}>
                {statusConfig[submission.status].label}
              </Text>
              <Text style={styles.statusBannerDesc}>{statusConfig[submission.status].desc}</Text>
              {submission.status === 'rejected' && (
                <Text style={styles.statusBannerUrl}>{submission.videoUrl}</Text>
              )}
            </View>
          </View>
        )}

        {/* Tab switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'brief' && styles.tabActive]}
            onPress={() => setActiveTab('brief')}
          >
            <Text style={[styles.tabText, activeTab === 'brief' && styles.tabTextActive]}>📋 Brief</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'examples' && styles.tabActive]}
            onPress={() => setActiveTab('examples')}
          >
            <Text style={[styles.tabText, activeTab === 'examples' && styles.tabTextActive]}>
              🎬 Examples ({campaign.exampleVideos.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'brief' ? (
          <BriefTab campaign={campaign} />
        ) : (
          <ExamplesTab campaign={campaign} onSelectVideo={(vid) => setFullscreenVideo(vid)} />
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.ctaContainer}>
        {canSubmit ? (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => setSubmitModalVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>🎬  Submit My Video</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.ctaButtonDisabled}
            onPress={() => navigation.navigate('Main', { screen: 'Submissions' })}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonDisabledText}>📊  View My Submission</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit Modal */}
      <Modal
        visible={submitModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setSubmitModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Submit Your Video</Text>
            <Text style={styles.modalSubtitle}>
              Paste your TikTok or Instagram Reel link below.
            </Text>

            <View style={[styles.urlInputWrapper, urlError ? styles.urlInputWrapperError : null]}>
              <Text style={styles.urlInputIcon}>🔗</Text>
              <TextInput
                style={styles.urlInput}
                placeholder="https://www.tiktok.com/@you/video/..."
                placeholderTextColor={COLORS.textMuted}
                value={videoUrl}
                onChangeText={(t) => { setVideoUrl(t); setUrlError(''); }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
            {urlError ? <Text style={styles.urlError}>{urlError}</Text> : null}

            <View style={styles.urlHints}>
              <Text style={styles.urlHint}>✓ TikTok: tiktok.com/@user/video/...</Text>
              <Text style={styles.urlHint}>✓ Instagram: instagram.com/reel/...</Text>
            </View>

            <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.modalSubmitText}>Submit →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setSubmitModalVisible(false); setUrlError(''); }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Full-screen Portrait Video Modal */}
      <Modal
        visible={!!fullscreenVideo}
        animationType="fade"
        transparent
        onRequestClose={() => setFullscreenVideo(null)}
      >
        <View style={styles.fullVideoOverlay}>
          <StatusBar barStyle="light-content" />
          <TouchableOpacity
            style={styles.closeFullVideo}
            onPress={() => setFullscreenVideo(null)}
          >
            <Text style={styles.closeFullVideoText}>✕</Text>
          </TouchableOpacity>

          {fullscreenVideo && (
            <View style={styles.videoContainer}>
              <Video
                source={typeof fullscreenVideo.url === 'number' ? fullscreenVideo.url : { uri: fullscreenVideo.url }}
                style={styles.fullVideoPlayer}
                videoStyle={{ width: '100%', height: '100%', objectFit: 'contain' } as any}
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                isLooping
              />
            </View>
          )}

          <View style={styles.fullVideoInfo}>
            <Text style={styles.fullVideoCaption}>{fullscreenVideo?.caption}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function BriefTab({ campaign }: { campaign: any }) {
  const briefLines = campaign.brief.split('\n');

  return (
    <View style={styles.briefContainer}>
      {/* Requirements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {campaign.requirements.map((req: string, i: number) => (
          <View key={i} style={styles.reqRow}>
            <View style={styles.reqBullet} />
            <Text style={styles.reqText}>{req}</Text>
          </View>
        ))}
      </View>

      {/* Full brief */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Brief</Text>
        <View style={styles.briefCard}>
          {briefLines.map((line: string, i: number) => {
            if (line.startsWith('## ')) {
              return <Text key={i} style={styles.briefH2}>{line.replace('## ', '')}</Text>;
            }
            if (line.startsWith('- ')) {
              return (
                <View key={i} style={styles.briefListItem}>
                  <Text style={styles.briefBullet}>•</Text>
                  <Text style={styles.briefListText}>{line.replace('- ', '')}</Text>
                </View>
              );
            }
            if (line.trim() === '') return <View key={i} style={{ height: 8 }} />;
            return <Text key={i} style={styles.briefBody}>{line}</Text>;
          })}
        </View>
      </View>
    </View>
  );
}

function ExamplesTab({ campaign, onSelectVideo }: { campaign: any; onSelectVideo: (vid: any) => void }) {
  return (
    <View style={styles.examplesContainer}>
      <Text style={styles.sectionTitle}>Example Videos</Text>
      <Text style={styles.examplesSubtitle}>Study these before creating your content.</Text>
      {campaign.exampleVideos.map((vid: any, i: number) => (
        <TouchableOpacity
          key={i}
          style={styles.exampleCard}
          onPress={() => onSelectVideo(vid)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: vid.thumbnail }}
            style={styles.exampleThumbnail}
            resizeMode="cover"
          />
          <View style={styles.examplePlayOverlay}>
            <Text style={styles.examplePlayIcon}>▶</Text>
          </View>
          <View style={styles.exampleInfo}>
            <Text style={styles.exampleCaption}>{vid.caption}</Text>
            {typeof vid.url === 'string' ? (
              <Text style={styles.exampleUrl} numberOfLines={1}>{vid.url} ↗</Text>
            ) : (
              <Text style={styles.exampleUrl}>Local Example Asset</Text>
            )}
            <View style={styles.exampleExternalBtn}>
              <Text style={styles.exampleExternalText}>Tap to Watch</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backIcon: { fontSize: 18, color: COLORS.textPrimary },
  navTitle: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  scrollContent: { paddingBottom: 40 },
  hero: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  heroBrand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  heroLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLogoEmoji: { fontSize: 22 },
  heroBrandName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  heroCategory: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  heroDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 21, marginBottom: SPACING.md },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  metricCard: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  metricDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: COLORS.border },
  metricValue: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  metricLabel: { fontSize: 10, color: COLORS.textSecondary, textTransform: 'uppercase' },
  platformRow: { flexDirection: 'row', gap: SPACING.xs, flexWrap: 'wrap' },
  platformBadge: {
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  platformBadgeText: { fontSize: 12, color: COLORS.textSecondary },
  statusBanner: {
    flexDirection: 'row',
    margin: SPACING.md,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  statusBannerIcon: { fontSize: 22, marginTop: 2 },
  statusBannerText: { flex: 1 },
  statusBannerTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  statusBannerDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19 },
  statusBannerUrl: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  briefContainer: { padding: SPACING.md },
  section: { marginBottom: SPACING.lg },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.sm,
  },
  reqRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: 8 },
  reqBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 7,
    flexShrink: 0,
  },
  reqText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 21 },
  briefCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  briefH2: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginTop: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  briefListItem: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  briefBullet: { color: COLORS.primary, fontSize: 14 },
  briefListText: { flex: 1, fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  briefBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  examplesContainer: { padding: SPACING.md },
  examplesSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: SPACING.md, marginTop: -6 },
  exampleCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exampleThumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.bgCardAlt,
  },
  examplePlayOverlay: {
    position: 'absolute',
    top: 85,
    left: '50%',
    transform: [{ translateX: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  examplePlayIcon: { fontSize: 18, color: '#fff', marginLeft: 3 },
  exampleInfo: { padding: SPACING.md },
  exampleCaption: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  exampleUrl: { fontSize: 11, color: COLORS.textMuted, marginBottom: SPACING.sm },
  exampleExternalBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary + '20',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.primary + '60',
  },
  exampleExternalText: { fontSize: 12, color: COLORS.primaryLight, fontWeight: '600' },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingBottom: 30,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  ctaButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  ctaButtonDisabled: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaButtonDisabledText: { fontSize: 16, fontWeight: '700', color: COLORS.textSecondary },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalSheet: {
    backgroundColor: COLORS.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  modalSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  urlInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  urlInputWrapperError: { borderColor: COLORS.error },
  urlInputIcon: { fontSize: 16, marginRight: SPACING.sm },
  urlInput: {
    flex: 1,
    height: 52,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  urlError: { fontSize: 12, color: COLORS.error, marginBottom: SPACING.sm },
  urlHints: { marginBottom: SPACING.lg },
  urlHint: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
  modalSubmitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  modalSubmitText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  modalCancelBtn: {
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, color: COLORS.textSecondary },
  fullVideoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  closeFullVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullVideoText: { color: '#fff', fontSize: 20, fontWeight: '600' },
  videoContainer: {
    flex: 1,
    width: '100%',
    maxWidth: '95%',
    maxHeight: '85%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullVideoPlayer: {
    width: '100%',
    height: '100%',
  },
  fullVideoInfo: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    padding: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: RADIUS.md,
  },
  fullVideoCaption: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

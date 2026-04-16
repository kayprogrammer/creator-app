import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<BottomTabParamList>;
  CampaignList: undefined;
  CampaignDetail: { campaignId: string };
  Submissions: undefined;
};

export type BottomTabParamList = {
  CampaignList: undefined;
  Submissions: undefined;
};

export type EntityType = 
  | 'STARTUP' 
  | 'FOUNDER' 
  | 'USER' 
  | 'INVESTOR' 
  | 'DISTRICT' 
  | 'BLOG_POST' 
  | 'CLAIM' 
  | 'SUBMISSION';

export type SocialPlatform = 
  | 'LINKEDIN'
  | 'TWITTER'
  | 'GITHUB'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'DISCORD'
  | 'SLACK'
  | 'BLOG'
  | 'WEBSITE'
  | 'INSTAGRAM';

export interface SocialLink {
  id: string;
  entityType: EntityType;
  entityId: string;
  platform: SocialPlatform;
  url: string;
}

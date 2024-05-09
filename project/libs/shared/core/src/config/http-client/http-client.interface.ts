export type ServicesUrls = {
  users: string;
  auth: string;
  posts: string;
  feedback: string;
  filesStorage: string;
  subscriptions: string;
};

export interface IHttpClientConfig {
  maxRedirect: number;
  timeout: number;
  serviceUrls: ServicesUrls;
}

export enum PostPaths {
  Base = 'posts',
  Search = 'search',
  Drafts = 'drafts/:userId',
  Post = ':id',
  Create = ':userId/create',
  Update = ':userId/update/:id',
  Publish = ':userId/publish/:id',
  Repost = ':userId/repost/:id',
  Delete = ':userId/delete/:id',
}

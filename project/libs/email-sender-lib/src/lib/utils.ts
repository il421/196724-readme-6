import { EmailPost, Post } from '@project/core';
import { DEFAULT_DATE_FORMAT } from '@project/email-sender-lib';
import dayjs from 'dayjs';
export const mapPostsForEmail = (posts: Post[]): EmailPost[] => {
  return posts?.map((post) => {
    const publishedAt = dayjs(post.publishedAt).format(DEFAULT_DATE_FORMAT);
    const type = post.type.toUpperCase();
    const details = `${type}: ${publishedAt}`;

    return {
      details,
      text: post.text,
      title: post.title,
      url: post.url,
      quoteAuthor: post.quoteAuthor,
    };
  });
};

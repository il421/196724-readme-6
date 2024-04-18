import { PipelineStage } from 'mongoose';

export const subscriptionsLookup: PipelineStage = {
  $lookup: {
    from: 'subscriptions',
    let: { authorId: '$_id' },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: [
              '$authorId',
              { $convert: { input: '$$authorId', to: 'string' } },
            ],
          },
        },
      },
    ],
    as: 'subscriptions',
  },
};

export const addFollowers: PipelineStage = {
  $addFields: {
    followers: { $size: '$subscriptions' },
  },
};

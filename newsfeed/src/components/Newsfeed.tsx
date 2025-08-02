import * as React from "react";
import { graphql } from 'relay-runtime';
import { useFragment, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import type { NewsfeedContentsRefetchQuery as NewsfeedContentsRefetchQueryType } from "./__generated__/NewsfeedContentsRefetchQuery.graphql";
import { NewsfeedContentsFragment$key } from "./__generated__/NewsfeedContentsFragment.graphql";

import Story from "./Story";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";

const NewsfeedQuery = graphql`
  query NewsfeedQuery {
    ...NewsfeedContentsFragment
  }
`;

const NewsfeedContentsFragment = graphql`
  fragment NewsfeedContentsFragment on Query
   @refetchable(queryName: "NewsfeedContentsRefetchQuery")
   @argumentDefinitions(
    cursor: { type: "String" },
    count: { type: "Int", defaultValue: 3 }
   )
  {
    viewer {
      newsfeedStories (first: $count, after: $cursor)
        @connection(key: "NewsfeedContentsFragment_newsfeedStories")
      {
        edges {
          node {
            id
            ...StoryFragment
          }
        }
      }
    }
  }
`;

export default function Newsfeed() {
  const queryData = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {});
  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<
    NewsfeedContentsRefetchQueryType,
    NewsfeedContentsFragment$key
  >(NewsfeedContentsFragment, queryData);
  const storyEdges = data.viewer.newsfeedStories.edges;

  function onEndReached() {
    loadNext(1);
  }

  return (
    <div className="newsfeed">
      {storyEdges.map((storyEdge) => (
        <Story key={storyEdge.node.id} story={storyEdge.node} />
      ))}
      <InfiniteScrollTrigger
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        onEndReached={onEndReached}
      />
    </div>
  );
}

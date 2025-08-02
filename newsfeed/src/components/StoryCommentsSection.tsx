import * as React from "react";
import { graphql } from "relay-runtime";
import SmallSpinner from './SmallSpinner';
import { useFragment, usePaginationFragment } from "react-relay";
import type { StoryCommentsSectionFragment$key } from "./__generated__/StoryCommentsSectionFragment.graphql";
import Comment from "./Comment";
import LoadMoreCommentsButton from "./LoadMoreCommentsButton";

export type Props = {
  story: StoryCommentsSectionFragment$key;
};

const StoryCommentsSectionFragment = graphql`
  fragment StoryCommentsSectionFragment on Story
    @argumentDefinitions(
      cursor: { type: "String" },
      count: { type: "Int", defaultValue: 3 }
    )
    @refetchable(queryName: "StoryCommentsSectionPaginationQuery")
  {
    comments(first: $count, after: $cursor)
      @connection(key: "StoryCommentsSectionFragment_comments")
    {
      edges {
        node {
          id
          ...CommentFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export default function StoryCommentsSection({ story }: Props) {
  const { data, loadNext, isLoadingNext } = usePaginationFragment(StoryCommentsSectionFragment, story);
  const onLoadMore = () => {
    loadNext(3);
  };
  return (
    <div>
      {data.comments.edges.map((edge) => (
        <Comment key={edge.node.id} comment={edge.node} />
      ))}
      {data.comments.pageInfo.hasNextPage && (
        <LoadMoreCommentsButton onClick={onLoadMore} disabled={isLoadingNext} />
      )}
      {isLoadingNext && <SmallSpinner />}
    </div>
  );
}

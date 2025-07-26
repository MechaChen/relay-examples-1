import * as React from "react";
import { graphql } from 'relay-runtime';
import { useLazyLoadQuery } from 'react-relay';
import { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";

import Story from "./Story";

const NewsfeedQuery = graphql`
  query NewsfeedQuery {
    topStory {
      title
      summary
      poster {
        name
        profilePicture {
          url
        }
      }
      thumbnail {
        url
      }
    }
  }
`;

export default function Newsfeed() {
  const data = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {});

  const story = data.topStory;

  return (
    <div className="newsfeed">
      <Story story={story} />
    </div>
  );
}

import * as React from "react";
import { graphql } from 'relay-runtime';
import { useFragment } from 'react-relay';

import { PosterBylineFragment$key } from "./__generated__/PosterBylineFragment.graphql";
import Image from "./Image";
import Hovercard from "./Hovercard";
import PosterDetailsHovercardContents from "./PosterDetailsHovercardContents";

export type Props = {
  poster: PosterBylineFragment$key
};

const { useRef } = React;

const PosterBylineFragment = graphql`
  fragment PosterBylineFragment on Actor {
    id
    name
    profilePicture {
      ...ImageFragment @arguments(width: 60, height: 60)
    }
  }
`

export default function PosterByline({ poster }: Props): React.ReactElement {
  const data = useFragment(PosterBylineFragment, poster);
  const hoverRef = useRef<HTMLDivElement>(null);

  if (poster == null) {
    return null;
  }

  return (
    <div className="byline" ref={hoverRef}>
      <Image
        image={data.profilePicture}
        width={60}
        height={60}
        className="byline__image"
      />
      <Hovercard targetRef={hoverRef}>
        <PosterDetailsHovercardContents posterID={data.id} />
      </Hovercard>
      <div className="byline__name">{data.name}</div>
    </div>
  );
}

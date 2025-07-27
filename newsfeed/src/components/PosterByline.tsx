import * as React from "react";
import { graphql } from 'relay-runtime';
import { useFragment, useQueryLoader } from 'react-relay';

import { PosterBylineFragment$key } from "./__generated__/PosterBylineFragment.graphql";
import type {PosterDetailsHovercardContentsQuery as HovercardQueryType} from './__generated__/PosterDetailsHovercardContentsQuery.graphql';
import Image from "./Image";
import Hovercard from "./Hovercard";
import PosterDetailsHovercardContents, { PosterDetailsHovercardContentsQuery } from "./PosterDetailsHovercardContents";

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
  const [hovercardQueryRef, loadHovercardQuery] = useQueryLoader<HovercardQueryType>(PosterDetailsHovercardContentsQuery);

  function onBeginHover() {
    loadHovercardQuery({ posterID: data.id });
  }

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
      <Hovercard targetRef={hoverRef} onBeginHover={onBeginHover}>
        <PosterDetailsHovercardContents queryRef={hovercardQueryRef} />
      </Hovercard>
      <div className="byline__name">{data.name}</div>
    </div>
  );
}

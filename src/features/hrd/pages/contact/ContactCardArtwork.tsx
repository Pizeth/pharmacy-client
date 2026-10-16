"use client";

import * as S from "./HrdContactPage.styles";

export function ContactCardArtwork() {
  return (
    <S.CardArt aria-hidden="true">
      {[0, 1, 2, 3].map(shape => <S.CardShape key={shape} data-contact-shape="true" />)}
    </S.CardArt>
  );
}

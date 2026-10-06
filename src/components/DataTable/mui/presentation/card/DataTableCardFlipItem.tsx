"use client";

import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import type { Row, RowData } from "@tanstack/table-core";

import { useDataTableAccessibility } from "../../accessibility";
import type { MuiDataTableFeatures } from "../../features";
import {
  DATA_TABLE_COMPONENT_NAME,
  dataTableClasses,
} from "../../styles";

import {
  CardActionsRoot,
  CardBodyRoot,
  CardDetailRoot,
  CardHeaderContentRoot,
  CardHeaderRoot,
  CardItemRoot,
  CardMetadataRoot,
  CardSelectionRoot,
  hasRenderableContent,
} from "./cardSlots";
import { DataTableCardFlipButton } from "./DataTableCardFlipButton";
import type { DataTableCardFlipConfig } from "./types";

const FLIP_DURATION_MS = 600;

const CardFlipRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardFlip",
  overridesResolver: (_props, styles) => styles.cardFlip,
})({
  /**
   * The hover target. It never transforms, so the pointer cannot "fall off"
   * the card while the inner element is edge-on mid-flip, which would make
   * hover-flip cards flicker at their edges.
   */
  minWidth: 0,
  perspective: "1200px",
});

const CardFlipInner = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardFlipInner",
  overridesResolver: (_props, styles) => styles.cardFlipInner,
})({
  /**
   * Only the visible face participates in sizing. The hidden face stays
   * mounted for the rotation without reserving space for its content.
   */
  display: "grid",
  position: "relative",
  minWidth: 0,
  transformStyle: "preserve-3d",
  transition: `transform ${FLIP_DURATION_MS}ms cubic-bezier(0.4, 0.2, 0.2, 1)`,

  '[data-flipped="true"] > &': {
    transform: "rotateY(180deg)",
  },

  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
});

const CardFaceRoot = styled("div", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardFace",
  overridesResolver: (_props, styles) => styles.cardFace,
})({
  gridArea: "1 / 1",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",

  '&[aria-hidden="true"]': {
    position: "absolute",
    inset: "0 0 auto",
    width: "100%",
  },

  '&[data-face="back"]': {
    transform: "rotateY(180deg)",
  },

  // The card inside a face fills it, without overriding a height the
  // theme may give it.
  [`& > .${dataTableClasses.cardItem}`]: {
    flex: "1 1 auto",
    minHeight: 0,
  },
});

const CardFlipDetailRoot = styled(CardDetailRoot)({
  flex: "0 0 auto",
  overflow: "visible",
});

const CardFlipControlRoot = styled("span", {
  name: DATA_TABLE_COMPONENT_NAME,
  slot: "CardFlipControl",
  overridesResolver: (_props, styles) => styles.cardFlipControl,
})({
  display: "inline-flex",
  flexShrink: 0,
  marginInlineStart: "auto",
  alignSelf: "center",
});

export interface DataTableCardFlipItemProps<TData extends RowData> {
  readonly row: Row<MuiDataTableFeatures, TData>;
  readonly expanded: boolean;
  readonly selected: boolean;
  readonly density: string;
  readonly compactCard?: boolean;

  readonly selection?: ReactNode;
  readonly header?: ReactNode;
  readonly body: ReactNode;
  readonly metadata?: ReactNode;
  readonly actions?: ReactNode;
  /**
   * Called only once the card has been flipped, and from then on, so detail
   * that is never looked at is never rendered.
   */
  readonly renderDetail: () => ReactNode;

  readonly flip?: DataTableCardFlipConfig;
}

/**
 * One flip card: a front face with the usual card content and a back face
 * with the detail.
 *
 * The card is flipped when the row is expanded (the flip control) or while
 * a mouse pointer hovers it. The face that is not showing is inert and
 * hidden from assistive technology, so keyboard and screen-reader users
 * only meet one set of controls at a time. Actions are repeated on both
 * faces, in the same place, so a hover-flip never takes them away.
 */
export function DataTableCardFlipItem<TData extends RowData>(
  props: DataTableCardFlipItemProps<TData>,
) {
  const {
    row,
    expanded,
    selected,
    density,
    compactCard,
    selection,
    header,
    body,
    metadata,
    actions,
    renderDetail,
    flip,
  } = props;

  const { getExpandButtonId, getDetailPanelId } = useDataTableAccessibility();

  const frontButtonId = getExpandButtonId(row.id);
  const backButtonId = `${frontButtonId}-back`;
  const backFaceId = getDetailPanelId(row.id);

  const [hovered, setHovered] = useState(false);

  const flipOnHover = flip?.flipOnHover ?? true;
  const flipped = expanded || (flipOnHover && hovered);

  // Keep the detail mounted after the first flip, so turning back does not
  // empty the face while it is still animating.
  const [revealed, setRevealed] = useState(false);

  if (flipped && !revealed) {
    setRevealed(true);
  }

  const mountDetail = revealed || flipped;

  const showDetailsLabel = flip?.labels?.showDetails ?? "Show details";
  const hideDetailsLabel = flip?.labels?.hideDetails ?? "Back to front";

  /**
   * Turning the card makes the face holding the focused control inert, which
   * would drop focus to the page. Move it to the matching control on the
   * face that is now showing.
   */
  const frontButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<"front" | "back" | null>(null);

  useEffect(() => {
    if (pendingFocus.current === "back" && flipped) {
      backButtonRef.current?.focus();
    } else if (pendingFocus.current === "front" && !flipped) {
      frontButtonRef.current?.focus();
    }

    pendingFocus.current = null;
  }, [flipped]);

  const toggle = (from: "front" | "back") => {
    setHovered(false);
    pendingFocus.current = from === "front" ? "back" : "front";
    row.toggleExpanded(from === "front");
  };

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      setHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const cardProps = {
    variant: "outlined" as const,
    className: dataTableClasses.cardItem,
    "data-selected": selected ? "true" : undefined,
    "data-density": density,
  };

  return (
    <CardFlipRoot
      className={dataTableClasses.cardFlip}
      role="listitem"
      data-row-id={row.id}
      data-flipped={flipped ? "true" : "false"}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <CardFlipInner className={dataTableClasses.cardFlipInner}>
        <CardFaceRoot
          className={dataTableClasses.cardFace}
          data-face="front"
          aria-hidden={flipped ? true : undefined}
          inert={flipped}
        >
          <CardItemRoot {...cardProps} data-compact={compactCard ? "true" : undefined}>
            {(
              <CardHeaderRoot className={dataTableClasses.cardHeader}>
                {hasRenderableContent(selection) && (
                  <CardSelectionRoot
                    className={dataTableClasses.cardSelection}
                  >
                    {selection}
                  </CardSelectionRoot>
                )}

                {(hasRenderableContent(header) || compactCard) && (
                  <CardHeaderContentRoot>{header ?? body}</CardHeaderContentRoot>
                )}
                <CardFlipControlRoot className={dataTableClasses.cardFlipControl}>
                  <DataTableCardFlipButton
                    id={frontButtonId}
                    label={showDetailsLabel}
                    expanded={false}
                    controlsId={backFaceId}
                    icon={flip?.icon}
                    buttonRef={frontButtonRef}
                    onToggle={() => toggle("front")}
                  />
                </CardFlipControlRoot>
              </CardHeaderRoot>
            )}

            {!compactCard && (
              <CardBodyRoot className={dataTableClasses.cardBody}>
                {body}
              </CardBodyRoot>
            )}

            {!compactCard && hasRenderableContent(metadata) && (
              <CardMetadataRoot className={dataTableClasses.cardMetadata}>
                {metadata}
              </CardMetadataRoot>
            )}

            <CardActionsRoot className={dataTableClasses.cardActions}>
              {actions}
            </CardActionsRoot>
          </CardItemRoot>
        </CardFaceRoot>

        <CardFaceRoot
          className={dataTableClasses.cardFace}
          data-face="back"
          id={backFaceId}
          role="region"
          aria-labelledby={frontButtonId}
          aria-hidden={flipped ? undefined : true}
          inert={!flipped}
        >
          <CardItemRoot {...cardProps} data-card-side="back" data-compact={compactCard ? "true" : undefined}>
            {(
              <CardHeaderRoot className={dataTableClasses.cardHeader}>
                {hasRenderableContent(selection) && (
                  <CardSelectionRoot className={dataTableClasses.cardSelection}>
                    {selection}
                  </CardSelectionRoot>
                )}
                <CardHeaderContentRoot>{header}</CardHeaderContentRoot>
                <CardFlipControlRoot className={dataTableClasses.cardFlipControl}>
                  <DataTableCardFlipButton
                    id={backButtonId}
                    label={hideDetailsLabel}
                    expanded
                    controlsId={backFaceId}
                    icon={flip?.icon}
                    buttonRef={backButtonRef}
                    onToggle={() => toggle("back")}
                  />
                </CardFlipControlRoot>
              </CardHeaderRoot>
            )}

            <CardFlipDetailRoot
              className={dataTableClasses.cardDetail}
              data-detail-panel={row.id}
            >
              {mountDetail ? renderDetail() : null}
            </CardFlipDetailRoot>

            <CardActionsRoot className={dataTableClasses.cardActions}>
              {actions}
            </CardActionsRoot>
          </CardItemRoot>
        </CardFaceRoot>
      </CardFlipInner>
    </CardFlipRoot>
  );
}

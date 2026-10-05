"use client";

import { Tooltip } from "@mui/material";
import { Cached } from "@mui/icons-material";
import type { ReactNode, Ref } from "react";

import { dataTableClasses } from "../../styles";

import { ExpandRowButtonRoot } from "./DataTableCardExpandRowButton";

export interface DataTableCardFlipButtonProps {
  readonly id: string;

  /**
   * Tooltip and accessible name.
   */
  readonly label: string;

  /**
   * True on the back face, where the control turns the card back.
   */
  readonly expanded: boolean;

  /**
   * Id of the back face the control reveals.
   */
  readonly controlsId: string;

  readonly onToggle: () => void;
  readonly icon?: ReactNode;
  readonly buttonRef?: Ref<HTMLButtonElement>;
}

/**
 * Icon-only control that turns a flip card over.
 *
 * Shares the expand button's themeable slot, so it looks and behaves like
 * the other card controls.
 */
export function DataTableCardFlipButton(
  props: DataTableCardFlipButtonProps,
) {
  const {
    id,
    label,
    expanded,
    controlsId,
    onToggle,
    icon = <Cached fontSize="small" />,
    buttonRef,
  } = props;

  return (
    <Tooltip title={label}>
      <ExpandRowButtonRoot
        ref={buttonRef}
        className={dataTableClasses.expandRowButton}
        id={id}
        size="small"
        aria-label={label}
        aria-expanded={expanded}
        aria-controls={controlsId}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          onToggle();
        }}
      >
        {icon}
      </ExpandRowButtonRoot>
    </Tooltip>
  );
}

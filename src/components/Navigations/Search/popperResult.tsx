"use client";

import type { PoperResultProps } from "@/interfaces/component-props.interface";
import { Fade, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect, useRef } from "react";
import { Root, Paper, ErrorBox, ScrollableList, Empty } from "./popperResult.styles";
interface Product {
  id: number;
  userId: number;
  title: string;
  body: string;
}
const PREFIX = "RazethSearchPoppers";
const PoperResult = (inProps: PoperResultProps) => {
  const props = useThemeProps({
    props: inProps,
    name: PREFIX
  });
  const {
    open,
    anchorEl,
    width,
    placement,
    results,
    error,
    activeIndex,
    onSelect,
    setValue,
    setOpen,
    ...rest
  } = props;
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (activeIndex !== -1 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth"
        });
      }
    }
  }, [activeIndex]);
  return <Root open={open} anchorEl={anchorEl} placement={placement} transition width={width} {...rest}>
      {({
      TransitionProps
    }) => <Fade {...TransitionProps} timeout={250}>
          <Paper elevation={7}>
            {error ? <ErrorBox>
                <ErrorOutlineIcon fontSize="small" />
                <Typography variant="caption" align="center">
                  {error}
                </Typography>
              </ErrorBox> : results.length > 0 ? <ScrollableList ref={listRef} dense>
                {results.map((product: Product, index: number) => <ListItemButton key={product.id} selected={index === activeIndex} dense disableGutters divider onMouseDown={event => event.preventDefault()} onClick={() => {
            onSelect?.(product);
            setValue(product.title);
            setOpen(false);
          }} component="a" href="/fts">
                    <ListItemText primary={product.title} secondary={product.body} />
                  </ListItemButton>)}
              </ScrollableList> : <Empty align="center" color="textSecondary" variant="subtitle2" noWrap>
                No products found
              </Empty>}
          </Paper>
        </Fade>}
    </Root>;
};
export default PoperResult;

"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { InputAdornment, CircularProgress, ClickAwayListener } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchInput as Input, SearchLabel as Label } from "@/components/Search/SearchInput";
import PoperResult from "./popperResult";
import { Root, FormInput, ActionButton } from "./search.styles";
import { useNavigationSearch, type NavigationSearchResult } from "./useNavigationSearch";
export default function GlobalSearch({
  label = "ស្វែងរក..."
}: {
  label?: string;
}) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const {
    results,
    error,
    loading
  } = useNavigationSearch(value);
  useEffect(() => {
    if (!open || !results.length) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, results.length]);
  const select = (result: NavigationSearchResult) => {
    setValue(result.title);
    setOpen(false);
    setActiveIndex(-1);
  };
  const clear = () => {
    setValue("");
    setOpen(false);
    setActiveIndex(-1);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      clear();
      return;
    }
    if (!open || !results.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex(index => index < results.length - 1 ? index + 1 : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(index => index > 0 ? index - 1 : results.length - 1);
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      select(results[activeIndex]);
    }
  };
  const shouldShrink = open || focused || value.length > 0;
  return <ClickAwayListener onClickAway={() => setOpen(false)}>
    <Root>
      <FormInput variant="outlined" ref={containerRef}>
        <Label shrink={shouldShrink} htmlFor={inputId}>{label}</Label>
        <Input id={inputId} value={value} label={label} onChange={event => {
          setValue(event.target.value);
          setActiveIndex(-1);
          setOpen(Boolean(event.target.value.trim()));
        }} onFocus={() => {
          setFocused(true);
          setOpen(error === null && value.length > 0);
        }} onBlur={() => {
          setFocused(false);
          setOpen(false);
        }} notched={shouldShrink} onKeyDown={onKeyDown} startAdornment={<InputAdornment position="start" className="reverse"><SearchIcon /></InputAdornment>} endAdornment={loading || value.length > 0 ? <InputAdornment position="end">
            {loading ? <CircularProgress size="1rem" thickness={5} /> : <ActionButton onClick={clear} size="small" aria-label="Clear search"><ClearIcon fontSize="small" /></ActionButton>}
          </InputAdornment> : null} />
        <PoperResult open={open} anchorEl={containerRef.current} width={containerRef.current?.clientWidth} results={results} error={error} activeIndex={activeIndex} setValue={setValue} setOpen={setOpen} />
      </FormInput>
    </Root>
  </ClickAwayListener>;
}

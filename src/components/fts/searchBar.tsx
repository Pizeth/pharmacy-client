import { useState } from "react";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import useAutocomplete from "@mui/material/useAutocomplete";
import { autocompleteClasses } from "@mui/material/Autocomplete";

const Search = styled("div")(({ theme }) => ({
  borderRadius: "50%",
  //   backgroundColor: "#fefefe",
  position: "relative",
  width: "300px",
  height: "40px",

  "&:hover": {
    backgroundColor: alpha("#fefefe", 0.85),
  },
}));

const SearchIconWrapper = styled("div")(() => ({
  height: "100%",
  position: "absolute",
  padding: "0 10px",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const CloseIconWrapper = styled("div")(() => ({
  position: "absolute",
  height: "100%",
  right: 0,
  top: 0,
  padding: "0 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: "inherit",
  width: "100%",
  paddingLeft: "40px",
  paddingRight: "40px",
  paddingTop: "3px",
  height: "100%",
}));

const Listbox = styled("ul")(() => ({
  width: "100%",
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#f1f1f1",
  overflow: "auto",
  maxHeight: 200,
  borderRadius: "0 0 10px 10px",
  border: "1px solid rgba(0,0,0,.25)",
  "& li": { textAlign: "left", paddingLeft: "10px" },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
}));

const SearchInputWithIcon = ({
  value,
  width,
  onChange,
  placeholder,
  height,
  onCancelResearch,
  onSearch,
  className,
  style,
  disabled,
  options,
}: {
  value?: string;
  width?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: string | number;
  onCancelResearch?: (value: string) => void;
  onSearch?: (value?: string) => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  options?: string[];
}) => {
  const [internalValue, setInternalValue] = useState(value || "");

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete",
    freeSolo: true,
    options: options || [],
    getOptionLabel: (option) => option,
    filterOptions: (options) => {
      if (options === undefined) return [];
      let newOptions = options.filter((option) => {
        return option.toLowerCase().includes(internalValue.toLowerCase());
      });
      return newOptions.slice(0, 5);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleCancel = () => {
    setInternalValue("");
    if (onCancelResearch) {
      onCancelResearch(internalValue);
    }
  };

  const handleClickOption = (e: React.MouseEvent<HTMLLIElement>) => {
    setInternalValue(e.currentTarget.textContent || "");
    if (onChange) {
      onChange(e.currentTarget.textContent || "");
    }
    if (onSearch) return onSearch(e.currentTarget.textContent || "");
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.code === "Enter") && onSearch) {
      onSearch();
    } else if (e.key === "Escape" || e.code === "Escape") {
      handleCancel();
    }
  };

  return (
    <>
      <Search
        {...getRootProps()}
        key={"SearchBarComponent-root"}
        style={{ ...style, width: width || "300px", height: height || "40px" }}
        className={`SearchBarComponent-root ${className ? className : null}`}
      >
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputProps={{
            ...getInputProps(),
            onChange: handleChange,
            value: internalValue,
          }}
          placeholder={placeholder || "Search"}
          onKeyUp={handleKeyUp}
          disabled={disabled}
        />
        {internalValue ? (
          <CloseIconWrapper onClick={handleCancel}>
            <CloseIcon />
          </CloseIconWrapper>
        ) : null}

        {groupedOptions.length > 0 && internalValue.length ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li
                {...getOptionProps({ option, index })}
                onClick={handleClickOption}
              >
                <strong>{option}</strong>
              </li>
            ))}
          </Listbox>
        ) : null}
      </Search>
    </>
  );
};

SearchInputWithIcon.propTypes = {
  // custom top-level class
  className: PropTypes.string,
  // changes the default width of component
  width: PropTypes.node,
  // changes the default height of component
  height: PropTypes.node,
  // override the placeholder
  placeholder: PropTypes.string,
  // value of input text field
  value: PropTypes.string,
  // fired when input value changes
  onChange: PropTypes.func,
  // fired when the search is canceled
  onCancelResearch: PropTypes.func,
  // fired when press enter
  onSearch: PropTypes.func,
  // override styles of the root element
  style: PropTypes.object,
  // disable text field
  disabled: PropTypes.bool,
  //options of autocomplete suggests
  options: PropTypes.array,
};

export default SearchInputWithIcon;

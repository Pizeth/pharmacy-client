import { useState } from "react";
import { Box, Tabs, Tab, styled, useThemeProps } from "@mui/material";
import { useTranslate } from "ra-core";
import {
  Login as LoginIcon,
  PersonAdd as SignUpIcon,
} from "@mui/icons-material";

interface AuthTabsProps {
  loginForm: React.ReactNode;
  signUpForm: React.ReactNode;
  defaultTab?: "login" | "signup";
  className?: string;
  sx?: any;
  onTabChange?: (tab: "login" | "signup") => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const PREFIX = "RazethAuthTabs";

const StyledAuthTabs = styled(Box, {
  name: PREFIX,
  slot: "Root",
  overridesResolver: (_props, styles) => styles.root,
})<AuthTabsProps>(() => ({}));

const StyledTabs = styled(Tabs, {
  name: PREFIX,
  slot: "Tabs",
  overridesResolver: (_props, styles) => styles.tabs,
})(() => ({}));

const StyledTab = styled(Tab, {
  name: PREFIX,
  slot: "Tab",
  overridesResolver: (_props, styles) => styles.tab,
})(() => ({}));

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
      sx={{
        py: 3,
        animation: value === index ? "fadeIn 0.3s ease-in" : "none",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {value === index && children}
    </Box>
  );
};

const AuthTabs = (inProps: AuthTabsProps) => {
  const props = useThemeProps({ props: inProps, name: PREFIX });
  const {
    loginForm,
    signUpForm,
    defaultTab = "login",
    className,
    sx,
    onTabChange,
    ...rest
  } = props;

  const translate = useTranslate();
  const [value, setValue] = useState(defaultTab === "login" ? 0 : 1);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue === 0 ? "login" : "signup");
    }
  };

  return (
    <StyledAuthTabs
      loginForm={undefined}
      signUpForm={undefined}
      className={className}
      sx={sx}
      {...rest}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          aria-label="authentication tabs"
          centered
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <StyledTab
            icon={<LoginIcon />}
            iconPosition="start"
            label={translate("razeth.auth.sign_in") || "Sign In"}
            id="auth-tab-0"
            aria-controls="auth-tabpanel-0"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              minHeight: 60,
            }}
          />
          <StyledTab
            icon={<SignUpIcon />}
            iconPosition="start"
            label={translate("razeth.auth.sign_up") || "Sign Up"}
            id="auth-tab-1"
            aria-controls="auth-tabpanel-1"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              minHeight: 60,
            }}
          />
        </StyledTabs>
      </Box>

      <TabPanel value={value} index={0}>
        {loginForm}
      </TabPanel>

      <TabPanel value={value} index={1}>
        {signUpForm}
      </TabPanel>
    </StyledAuthTabs>
  );
};

export default AuthTabs;

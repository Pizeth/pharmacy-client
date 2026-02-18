import { ColumnAvatarProps } from "@/interfaces/component-props.interface";
import { Link, styled } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { NoAccounts } from "@mui/icons-material";

const PREFIX = "RazethColunmAvatar";

const Root = styled(Box, {
  name: PREFIX,
  slot: "Root",
})({
  display: "inline-flex",
  alignItems: "center",
  //   justifyItems: "center",
  //   justifyContent: "left",
  gap: "0.25rem",
});

export const ColunmAvatar = (inProps: ColumnAvatarProps) => {
  const { src, icon, variant, sizes, children, ...rest } = inProps;
  return (
    <Root {...rest}>
      <Avatar alt="avatar" src={src} variant={variant} sizes={sizes}>
        {icon}
      </Avatar>
      <Link href={`/profile/${children}`}>{children}</Link>
    </Root>
  );
};

const RenderAvatar = (inProps: ColumnAvatarProps) => {
  const { src, icon, children, ...rest } = inProps;
  return children ? (
    <ColunmAvatar
      alt="avatar"
      src="https://api.dicebear.com/9.x/lorelei/svg?seed=%E1%9E%98%E1%9F%89%E1%9E%B6%E1%9E%9B%E1%9E%B8"
      icon={icon}
      {...rest}
    >
      {children}
    </ColunmAvatar>
  ) : (
    <NoAccounts color="primary" />
  );
};

export default RenderAvatar;

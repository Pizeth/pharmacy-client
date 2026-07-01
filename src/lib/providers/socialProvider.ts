// src/lib/provider-registry.ts
import {
  Apple,
  Discord,
  Github,
  Gitlab,
  Google,
  Instagram,
  Linkedin,
  Meta,
  Microsoft,
  Telegram,
  Web,
  X,
  YouTube,
} from "@/components/icons/socialIcons";
import { SvgIconProps } from "@mui/material/SvgIcon";

// Master registry — add icons/labels here when adding new providers to backend
export const PROVIDER_REGISTRY = {
  google: { name: "Google", icon: Google },
  apple: { name: "Apple", icon: Apple },
  meta: { name: "Meta", icon: Meta },
  facebook: { name: "Facebook", icon: Meta }, // same icon as Meta
  microsoft: { name: "Microsoft", icon: Microsoft },
  github: { name: "GitHub", icon: Github },
  gitlab: { name: "GitLab", icon: Gitlab },
  discord: { name: "Discord", icon: Discord },
  linkedin: { name: "LinkedIn", icon: Linkedin },
  instagram: { name: "Instagram", icon: Instagram },
  telegram: { name: "Telegram", icon: Telegram },
  x: { name: "X", icon: X },
  twitter: { name: "Twitter", icon: X }, // alias
  youtube: { name: "YouTube", icon: YouTube },
  web: { name: "Web", icon: Web },
} satisfies Record<
  string,
  { name: string; icon: React.ComponentType<SvgIconProps> }
>;

export type RegisteredProviderId = keyof typeof PROVIDER_REGISTRY;

"use client";

import { useRef, useState, type FormEvent } from "react";
import { Alert, Avatar, Button, Stack, Typography } from "@mui/material";
import { RecordCard } from "@/components/Tables/ResourceRecordPage";
import { type ClientUser } from "@/lib/auth-client";
import { getGeneratedAvatarUrl } from "@/lib/auth/generatedAvatar";
import { API_URL, TOKEN_KEY } from "@/types/constants";

const maxAvatarBytes = 2 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export function AvatarSettings({ user, afterSignup }: {
  readonly user: ClientUser;
  readonly afterSignup: boolean;
}) {
  const [image, setImage] = useState(user.image);
  const [message, setMessage] = useState<{ error: boolean; text: string }>();
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);

  async function saveAvatar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || image) return;
    const form = new FormData(event.currentTarget);
    const avatar = form.get("avatar");
    if (!(avatar instanceof File) || !allowedImageTypes.includes(avatar.type) || avatar.size < 1 || avatar.size > maxAvatarBytes) {
      setMessage({ error: true, text: "Choose a JPEG, PNG, or WebP image up to 2 MB." });
      return;
    }
    submitting.current = true;
    setPending(true);
    setMessage(undefined);
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const response = await fetch(new URL("/api/account/settings/avatar", API_URL), {
        method: "PATCH",
        redirect: "error",
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });
      if (!response.ok) throw new Error("Could not upload your avatar. Try another image or continue without one.");
      const body: { image?: unknown } = await response.json();
      if (typeof body.image !== "string") throw new Error("The upload response was incomplete. Reload the page to check your avatar.");
      setImage(body.image);
      setMessage({ error: false, text: "Avatar saved." });
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : "Could not upload your avatar." });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <RecordCard title="Avatar">
      <Stack spacing={2}>
        <Avatar src={image || getGeneratedAvatarUrl(user.id)} alt={user.name}>{user.name.slice(0, 1)}</Avatar>
        {message && <Alert severity={message.error ? "error" : "success"}>{message.text}</Alert>}
        {!image && (
          <Stack component="form" spacing={2} onSubmit={event => { void saveAvatar(event); }}>
            <Typography component="label">
              Optional avatar (JPEG, PNG, or WebP, up to 2 MB)
              <input name="avatar" type="file" accept={allowedImageTypes.join(",")} required disabled={pending} />
            </Typography>
            <Button type="submit" variant="contained" disabled={pending}>{pending ? "Uploading…" : "Upload avatar"}</Button>
          </Stack>
        )}
        {afterSignup && <Button href="/verify-id" disabled={pending}>Continue to profile verification</Button>}
      </Stack>
    </RecordCard>
  );
}

"use client";

import { useState } from "react";
import { Alert, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { TextField } from "@/components/inputs";
import { Mail, UserRound, Phone, FileText, MessageSquare } from "lucide-react";
import * as S from "./HrdContactPage.styles";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const requiredText = { validate: (value: string) => value.trim().length > 0 || "សូមបំពេញព័ត៌មាននេះ" };

export function ContactForm({ email }: { email?: string }) {
  const [draftOpened, setDraftOpened] = useState(false);
  const form = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
    mode: "onSubmit",
  });
  function openDraft(fields: ContactFormValues) {
    if (!email) return;
    const subject = fields.subject.trim();
    const body = `${fields.message}\n\nName: ${fields.name}\nEmail: ${fields.email}\nPhone / Telegram: ${fields.phone}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftOpened(true);
  }
  return <S.FormSection aria-labelledby="hrd-contact-form-title">
    <Typography component="h2" variant="h5" id="hrd-contact-form-title">ការស្នើសុំទំនាក់ទំនង</Typography>
    <FormProvider {...form}>
    <S.Form aria-labelledby="hrd-contact-form-title" onSubmit={form.handleSubmit(openDraft)}>
    <div>
      <Typography variant="body2" color="text.secondary">បំពេញព័ត៌មានខាងក្រោម ដើម្បីរៀបចំសារក្នុងកម្មវិធីអ៊ីមែលរបស់អ្នក។</Typography>
    </div>
    <S.Fields>
      <TextField name="name" label="ឈ្មោះពេញ" iconStart={<UserRound size={18} />} autoComplete="name" rules={requiredText} required fullWidth />
      <TextField name="email" label="អ៊ីមែល" iconStart={<Mail size={18} />} type="email" autoComplete="email" rules={{ ...requiredText, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ" } }} required fullWidth />
      <TextField name="phone" label="លេខទូរសព្ទ / Telegram" iconStart={<Phone size={18} />} autoComplete="tel" rules={requiredText} required fullWidth />
      <TextField name="subject" label="ប្រធានបទ" iconStart={<FileText size={18} />} rules={requiredText} required fullWidth />
    </S.Fields>
    <TextField name="message" label="សារ" iconStart={<MessageSquare size={18} />} multiline minRows={5} rules={requiredText} required fullWidth />
    <S.SendButton type="submit" variant="contained" size="large" startIcon={<Mail size={18} />} disabled={!email}>ផ្ញើសារ</S.SendButton>
    {!email && <Alert severity="info">អ៊ីមែលទំនាក់ទំនងកំពុងរៀបចំ</Alert>}
    {draftOpened && <Alert severity="info" role="status">សារមិនទាន់បានផ្ញើទេ។ សូមបញ្ជូនសារពីកម្មវិធីអ៊ីមែលរបស់អ្នក។</Alert>}
    </S.Form>
    </FormProvider>
  </S.FormSection>;
}

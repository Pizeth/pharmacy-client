import { RoleFormPage } from "@/features/admin/roles/RoleFormPage";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <RoleFormPage mode="delete" recordId={id} />;}

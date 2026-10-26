import { renderHook } from "@testing-library/react";
import { useGetIdentity } from "@refinedev/core";
import { useAdminAccess } from "./useAdminAccess";
jest.mock("@refinedev/core", () => ({ useGetIdentity: jest.fn() }));
it.each(["admin", "sys-admin", "SUPER_ADMIN", "user,admin"])("allows the %s role", role => {
  jest.mocked(useGetIdentity).mockReturnValue({ data: { id: 1, role }, isLoading: false } as ReturnType<typeof useGetIdentity>);
  expect(renderHook(useAdminAccess).result.current.allowed).toBe(true);
});
it("does not allow a regular user", () => {
  jest.mocked(useGetIdentity).mockReturnValue({ data: { id: 1, role: "user" }, isLoading: false } as ReturnType<typeof useGetIdentity>);
  expect(renderHook(useAdminAccess).result.current.allowed).toBe(false);
});

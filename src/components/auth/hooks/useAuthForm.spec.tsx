import { act, renderHook } from "@testing-library/react";
import { useAuthForm } from "./useAuthForm";
import type { AuthAction } from "@/types/auth";

const mockLogin = jest.fn();
const mockRegister = jest.fn();
const mockReplace = jest.fn();
const mockReset = jest.fn();
const mockBegin = jest.fn();
const mockFailure = jest.fn();
const mockEmail = jest.fn();
const mockUsername = jest.fn();
const mockStrength = jest.fn();
const mockResolver = jest.fn((..._args:unknown[]) => async (values:unknown) => ({values,errors:{}}));
let mockPending = false;
jest.mock("@refinedev/core", () => ({
  useLogin: () => ({mutate:mockLogin,isPending:mockPending}),
  useRegister: () => ({mutate:mockRegister,isPending:false}),
}));
jest.mock("next/navigation", () => ({useRouter: () => ({replace:mockReplace})}));
jest.mock("jotai", () => ({useSetAtom: () => mockReset}));
jest.mock("@/Stores/validationStore", () => ({resetAllValidationsAtom:{}}));
jest.mock("@/lib/auth/loginFeedback", () => ({beginLoginAttempt: () => mockBegin(),reportLoginFailure: () => mockFailure()}));
jest.mock("@/lib/hooks/useFieldValidation", () => ({
  useAsyncFieldRule: (field:string) => ({validate:field === "email" ? mockEmail : mockUsername}),
  usePasswordValidation: () => ({validate:mockStrength}),
}));
jest.mock("@/lib/validations/hybridResolver", () => ({__esModule:true,default:(...args:unknown[])=>mockResolver(...args)}));

beforeEach(() => {jest.clearAllMocks(); mockPending=false;});

it("sends the CAPTCHA with login and clears expired tokens", async () => {
  const {result} = renderHook(() => useAuthForm("signin","/forgot-password"));
  act(() => result.current.setCaptchaToken("test-token"));
  await act(async () => result.current.onSubmit({identifier:"test@example.com",password:"test-only"}));
  expect(mockBegin).toHaveBeenCalledTimes(1);
  expect(mockLogin.mock.calls[0][0]).toEqual({identifier:"test@example.com",password:"test-only",captchaToken:"test-token"});
  act(() => result.current.handleCaptchaExpire());
  await act(async () => result.current.onSubmit({identifier:"test@example.com",password:"test-only"}));
  expect(mockLogin.mock.calls[1][0].captchaToken).toBeNull();
});

it("preserves email activation and mutation failure feedback", async () => {
  const {result} = renderHook(() => useAuthForm("signin","/forgot-password"));
  await act(async () => result.current.onSubmit({identifier:"test+auth@example.com",password:"test-only"}));
  const callbacks=mockLogin.mock.calls[0][1];
  act(() => callbacks.onSuccess({success:false,error:{name:"EMAIL_NOT_VERIFIED"}}));
  expect(mockReplace).toHaveBeenCalledWith("/activate?email=test%2Bauth%40example.com");
  act(() => callbacks.onError());
  expect(mockFailure).toHaveBeenCalledTimes(1);
});

it("registers without accidentally logging in and preserves async validation", async () => {
  const {result} = renderHook(() => useAuthForm("signup","/forgot-password"));
  const values={name:"Test User",username:"test-user",email:"test@example.com",password:"test-only",confirmPassword:"test-only"};
  await act(async () => result.current.onSubmit(values));
  expect(mockRegister.mock.calls[0][0]).toEqual({...values,captchaToken:null});
  expect(mockLogin).not.toHaveBeenCalled();
  expect(mockResolver).toHaveBeenLastCalledWith(expect.anything(),{email:mockEmail,username:mockUsername,password:mockStrength});
});

it("clears form values and validation when switching modes", () => {
  const {result,rerender} = renderHook(({mode}:{mode:AuthAction})=>useAuthForm(mode,"/forgot-password"),{initialProps:{mode:"signin" as AuthAction}});
  act(() => result.current.form.setValue("identifier","test@example.com"));
  rerender({mode:"signup"});
  expect(result.current.form.getValues()).toEqual({name:"",email:"",username:"",password:"",confirmPassword:""});
  rerender({mode:"signin"});
  expect(result.current.form.getValues()).toEqual({identifier:"",password:""});
  expect(mockReset).toHaveBeenCalledTimes(3);
});

it("disables submission while the authentication mutation is pending", () => {
  mockPending=true;
  const {result}=renderHook(()=>useAuthForm("signin","/forgot-password"));
  expect(result.current.isSubmitting).toBe(true);
  expect(result.current.isReady).toBe(false);
});

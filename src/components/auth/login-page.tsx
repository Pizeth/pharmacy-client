import { useState } from "react";
import { Form, required, useLogin, useNotify } from "ra-core";
import type { SubmitHandler, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/admin/text-input";
import { Notification } from "@/components/admin/notification";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import placeholder from "../../../public/placeholder.svg";

export const LoginPage = (props: { redirectTo?: string }) => {
  const { redirectTo } = props;
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit: SubmitHandler<FieldValues> = (values) => {
    setLoading(true);
    login(values, redirectTo)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        notify(
          typeof error === "string"
            ? error
            : typeof error === "undefined" || !error.message
            ? "ra.auth.sign_in_error"
            : error.message,
          {
            type: "error",
            messageArgs: {
              _:
                typeof error === "string"
                  ? error
                  : error && error.message
                  ? error.message
                  : undefined,
            },
          }
        );
      });
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      {" "}
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="bg-muted relative hidden md:block">
                {/* <placeholder style={{ width: "24px", height: "24px" }} /> */}
                <Image
                  src={placeholder}
                  // width={32}
                  // height={32}
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
              <Form className="p-6 md:p-8" onSubmit={handleSubmit}>
                {/* <form className="p-6 md:p-8"> */}
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Acme Inc account
                    </p>
                  </div>

                  <div className="grid gap-3">
                    {/* <Label htmlFor="email">Username/Email</Label> */}
                    {/* <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                /> */}
                    <TextInput
                      label="Username/Email"
                      source="credential"
                      type="text"
                      placeholder="username or m@example.com"
                      validate={required()}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      {/* <Label htmlFor="password">Password</Label> */}
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    {/* <Input id="password" type="password" required /> */}
                    <TextInput
                      label="Password"
                      source="password"
                      type="password"
                      validate={required()}
                    />
                  </div>
                  {/* <Button type="submit" className="w-full">
                Login
              </Button> */}
                  <Button
                    type="submit"
                    className="cursor-pointer w-full"
                    disabled={loading}
                  >
                    Sign in
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        viewBox="0 0 16 16"
                        width="16"
                        style={{ color: "currentcolor" }}
                      >
                        <g clip-path="url(#clip0_872_3147)">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M8 0C3.58 0 0 3.57879 0 7.99729C0 11.5361 2.29 14.5251 5.47 15.5847C5.87 15.6547 6.02 15.4148 6.02 15.2049C6.02 15.0149 6.01 14.3851 6.01 13.7154C4 14.0852 3.48 13.2255 3.32 12.7757C3.23 12.5458 2.84 11.836 2.5 11.6461C2.22 11.4961 1.82 11.1262 2.49 11.1162C3.12 11.1062 3.57 11.696 3.72 11.936C4.44 13.1455 5.59 12.8057 6.05 12.5957C6.12 12.0759 6.33 11.726 6.56 11.5261C4.78 11.3262 2.92 10.6364 2.92 7.57743C2.92 6.70773 3.23 5.98797 3.74 5.42816C3.66 5.22823 3.38 4.40851 3.82 3.30888C3.82 3.30888 4.49 3.09895 6.02 4.1286C6.66 3.94866 7.34 3.85869 8.02 3.85869C8.7 3.85869 9.38 3.94866 10.02 4.1286C11.55 3.08895 12.22 3.30888 12.22 3.30888C12.66 4.40851 12.38 5.22823 12.3 5.42816C12.81 5.98797 13.12 6.69773 13.12 7.57743C13.12 10.6464 11.25 11.3262 9.47 11.5261C9.76 11.776 10.01 12.2558 10.01 13.0056C10.01 14.0752 10 14.9349 10 15.2049C10 15.4148 10.15 15.6647 10.55 15.5847C12.1381 15.0488 13.5182 14.0284 14.4958 12.6673C15.4735 11.3062 15.9996 9.67293 16 7.99729C16 3.57879 12.42 0 8 0Z"
                            fill="currentColor"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_872_3147">
                            <rect width="16" height="16" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="sr-only">Login with Github</span>
                    </Button>

                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        viewBox="0 0 16 16"
                        width="16"
                        style={{ color: "currentcolor" }}
                      >
                        <path
                          d="M8.15991 6.54543V9.64362H12.4654C12.2763 10.64 11.709 11.4837 10.8581 12.0509L13.4544 14.0655C14.9671 12.6692 15.8399 10.6182 15.8399 8.18188C15.8399 7.61461 15.789 7.06911 15.6944 6.54552L8.15991 6.54543Z"
                          fill="#4285F4"
                        ></path>
                        <path
                          d="M3.6764 9.52268L3.09083 9.97093L1.01807 11.5855C2.33443 14.1963 5.03241 16 8.15966 16C10.3196 16 12.1305 15.2873 13.4542 14.0655L10.8578 12.0509C10.1451 12.5309 9.23598 12.8219 8.15966 12.8219C6.07967 12.8219 4.31245 11.4182 3.67967 9.5273L3.6764 9.52268Z"
                          fill="#34A853"
                        ></path>
                        <path
                          d="M1.01803 4.41455C0.472607 5.49087 0.159912 6.70543 0.159912 7.99995C0.159912 9.29447 0.472607 10.509 1.01803 11.5854C1.01803 11.5926 3.6799 9.51991 3.6799 9.51991C3.5199 9.03991 3.42532 8.53085 3.42532 7.99987C3.42532 7.46889 3.5199 6.95983 3.6799 6.47983L1.01803 4.41455Z"
                          fill="#FBBC05"
                        ></path>
                        <path
                          d="M8.15982 3.18545C9.33802 3.18545 10.3853 3.59271 11.2216 4.37818L13.5125 2.0873C12.1234 0.792777 10.3199 0 8.15982 0C5.03257 0 2.33443 1.79636 1.01807 4.41455L3.67985 6.48001C4.31254 4.58908 6.07983 3.18545 8.15982 3.18545Z"
                          fill="#EA4335"
                        ></path>
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        viewBox="0 0 16 16"
                        width="16"
                        style={{ color: "currentcolor" }}
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.5 0.5H5.75L9.48421 5.71053L14 0.5H16L10.3895 6.97368L16.5 15.5H11.25L7.51579 10.2895L3 15.5H1L6.61053 9.02632L0.5 0.5ZM12.0204 14L3.42043 2H4.97957L13.5796 14H12.0204Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <span className="sr-only">Login with X</span>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        viewBox="0 0 16 16"
                        width="16"
                        style={{ color: "currentcolor" }}
                      >
                        <path
                          d="M13.5535 3.01557C12.5023 2.5343 11.3925 2.19287 10.2526 2C10.0966 2.27886 9.95547 2.56577 9.82976 2.85952C8.6155 2.67655 7.38067 2.67655 6.16641 2.85952C6.04063 2.5658 5.89949 2.27889 5.74357 2C4.60289 2.1945 3.4924 2.53674 2.44013 3.01809C0.351096 6.10885 -0.215207 9.12285 0.0679444 12.0941C1.29133 12.998 2.66066 13.6854 4.11639 14.1265C4.44417 13.6856 4.73422 13.2179 4.98346 12.7283C4.51007 12.5515 4.05317 12.3334 3.61804 12.0764C3.73256 11.9934 3.84456 11.9078 3.95279 11.8248C5.21891 12.4202 6.60083 12.7289 7.99997 12.7289C9.39912 12.7289 10.781 12.4202 12.0472 11.8248C12.1566 11.9141 12.2686 11.9997 12.3819 12.0764C11.9459 12.3338 11.4882 12.5524 11.014 12.7296C11.2629 13.2189 11.553 13.6862 11.881 14.1265C13.338 13.6872 14.7084 13.0001 15.932 12.0953C16.2642 8.64968 15.3644 5.66336 13.5535 3.01557ZM5.34212 10.2668C4.55307 10.2668 3.90119 9.55073 3.90119 8.66981C3.90119 7.78889 4.53042 7.06654 5.3396 7.06654C6.14879 7.06654 6.79563 7.78889 6.78179 8.66981C6.76795 9.55073 6.14627 10.2668 5.34212 10.2668ZM10.6578 10.2668C9.86752 10.2668 9.21815 9.55073 9.21815 8.66981C9.21815 7.78889 9.84738 7.06654 10.6578 7.06654C11.4683 7.06654 12.1101 7.78889 12.0962 8.66981C12.0824 9.55073 11.462 10.2668 10.6578 10.2668Z"
                          fill="#5865F2"
                        ></path>
                      </svg>
                      <span className="sr-only">Login with Discord</span>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                          fill="currentColor"
                        ></path>
                      </svg>
                      <span className="sr-only">Login with Apple</span>
                    </Button>
                    <Button variant="outline" type="button" className="w-full">
                      <svg
                        data-testid="geist-icon"
                        height="16"
                        stroke-linejoin="round"
                        viewBox="0 0 16 16"
                        width="16"
                        style={{ color: "currentcolor" }}
                      >
                        <path
                          d="M1.72819 9.68842C1.72819 10.2994 1.86229 10.7684 2.03756 11.0522C2.26735 11.4239 2.6101 11.5813 2.95952 11.5813C3.41021 11.5813 3.82251 11.4695 4.61705 10.3706C5.25358 9.48978 6.00361 8.25345 6.50827 7.47837L7.36291 6.16526C7.95659 5.25331 8.64376 4.23954 9.43163 3.55238C10.0748 2.99152 10.7687 2.67993 11.467 2.67993C12.6393 2.67993 13.756 3.3593 14.6107 4.63347C15.546 6.02894 16 7.78663 16 9.60051C16 10.6788 15.7875 11.4711 15.4258 12.0971C15.0764 12.7025 14.3953 13.3073 13.2497 13.3073V11.5813C14.2306 11.5813 14.4754 10.6799 14.4754 9.64836C14.4754 8.17833 14.1327 6.54695 13.3777 5.38128C12.8418 4.55446 12.1474 4.04924 11.3835 4.04924C10.5572 4.04924 9.89233 4.67242 9.14508 5.78356C8.74781 6.37391 8.33996 7.09334 7.88204 7.90514L7.37794 8.79817C6.36528 10.5937 6.10878 11.0026 5.60245 11.6776C4.71498 12.8594 3.95716 13.3073 2.95952 13.3073C1.77604 13.3073 1.02768 12.7948 0.564192 12.0225C0.185838 11.3933 0 10.5675 0 9.62666L1.72819 9.68842Z"
                          fill="#0081FB"
                        ></path>
                        <path
                          d="M1.31885 4.7685C2.11117 3.54719 3.25458 2.69312 4.56603 2.69312C5.32552 2.69312 6.08057 2.9179 6.86899 3.56167C7.73142 4.26552 8.65061 5.42452 9.79736 7.33466L10.2085 8.02015C11.2012 9.67379 11.7659 10.5245 12.0964 10.9257C12.5215 11.4409 12.8192 11.5945 13.2059 11.5945C14.1868 11.5945 14.4317 10.6931 14.4317 9.66154L15.9562 9.6137C15.9562 10.692 15.7437 11.4843 15.382 12.1103C15.0326 12.7157 14.3515 13.3205 13.2059 13.3205C12.4937 13.3205 11.8627 13.1658 11.165 12.5076C10.6286 12.0023 10.0016 11.1049 9.51915 10.2981L8.08418 7.90107C7.3642 6.69812 6.70374 5.80119 6.32149 5.39502C5.91031 4.95824 5.38172 4.43077 4.53821 4.43077C3.8555 4.43077 3.27573 4.90984 2.79054 5.64262L1.31885 4.7685Z"
                          fill="url(#paint0_linear_237_30297)"
                        ></path>
                        <path
                          d="M4.582 4.41758C3.89929 4.41758 3.31952 4.89665 2.83433 5.62944C2.14828 6.66491 1.72819 8.20727 1.72819 9.68842C1.72819 10.2994 1.86229 10.7684 2.03756 11.0522L0.564192 12.0225C0.185838 11.3933 0 10.5675 0 9.62666C0 7.91571 0.469604 6.13242 1.36264 4.75532C2.15496 3.53401 3.29837 2.67993 4.60982 2.67993L4.582 4.41758Z"
                          fill="url(#paint1_linear_237_30297)"
                        ></path>
                        <defs>
                          <linearGradient
                            id="paint0_linear_237_30297"
                            x1="3.35028"
                            y1="9.20306"
                            x2="14.3671"
                            y2="9.75947"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#0064E1"></stop>
                            <stop offset="0.4" stop-color="#0064E1"></stop>
                            <stop offset="0.83" stop-color="#0073EE"></stop>
                            <stop offset="1" stop-color="#0082FB"></stop>
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_237_30297"
                            x1="2.50382"
                            y1="10.414"
                            x2="2.50382"
                            y2="6.35221"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#0082FB"></stop>
                            <stop offset="1" stop-color="#0064E0"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="sr-only">Login with Meta</span>
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
                {/* </form> */}
              </Form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
          <Notification />
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div className="min-h-screen flex">
  //       <div className="container relative grid flex-col items-center justify-center sm:max-w-none lg:grid-cols-2 lg:px-0">
  //         <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
  //           <div className="absolute inset-0 bg-zinc-900" />
  //           <div className="relative z-20 flex items-center text-lg font-medium">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeWidth="2"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               className="mr-2 h-6 w-6"
  //             >
  //               <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
  //             </svg>
  //             Acme Inc
  //           </div>
  //           <div className="relative z-20 mt-auto">
  //             <blockquote className="space-y-2">
  //               <p className="text-lg">
  //                 &ldquo;Shadcn Admin Kit has allowed us to quickly create and
  //                 evolve a powerful tool that otherwise would have taken months of
  //                 time and effort to develop.&rdquo;
  //               </p>
  //               <footer className="text-sm">John Doe</footer>
  //             </blockquote>
  //           </div>
  //         </div>
  //         <div className="lg:p-8">
  //           <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
  //             <div className="flex flex-col space-y-2 text-center">
  //               <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
  //               <p className="text-sm leading-none text-muted-foreground">
  //                 Try janedoe@acme.com / password
  //               </p>
  //             </div>
  //             <Form className="space-y-8" onSubmit={handleSubmit}>
  //               <TextInput
  //                 label="Email"
  //                 source="email"
  //                 type="email"
  //                 validate={required()}
  //               />
  //               <TextInput
  //                 label="Password"
  //                 source="password"
  //                 type="password"
  //                 validate={required()}
  //               />
  //               <Button
  //                 type="submit"
  //                 className="cursor-pointer"
  //                 disabled={loading}
  //               >
  //                 Sign in
  //               </Button>
  //             </Form>
  //           </div>
  //         </div>
  //       </div>
  //       <Notification />
  //     </div>
  //   );
};

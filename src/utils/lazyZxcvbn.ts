// Lazy load zxcvbn and options

export const loadDebounce = async () => {
  const { debounce } = await import("@zxcvbn-ts/core");
  return debounce;
};

export const loadZxcvbn = async (signal?: AbortSignal) => {
  const [
    // { zxcvbnOptions, zxcvbnAsync },
    // // types,
    // { matcherPwnedFactory: PwnedMatcher },
    { ZxcvbnFactory, Options },
    { matcherPwnedFactory }, // Fixed: Swapped out default import for named import
    zxcvbnEnPackage,
    zxcvbnCommonPackage,
  ] = await Promise.all([
    import("@zxcvbn-ts/core"),
    // import("@zxcvbn-ts/core/dist/types"),
    import("@zxcvbn-ts/matcher-pwned"),
    import("@zxcvbn-ts/language-en"),
    import("@zxcvbn-ts/language-common"),
  ]);

  // Create a wrapper that passes the signal to every fetch call
  const fetchWithSignal = (url: string, opts?: RequestInit) =>
    fetch(url, { ...opts, signal });

  // Initialize the new modular Options instance
  const options = new Options({
    translations: zxcvbnEnPackage.translations,
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
      ...zxcvbnEnPackage.dictionary,
    },
  });

  // Construct the pwned matcher using the new options instance context
  const matcherPwned = matcherPwnedFactory(fetchWithSignal);

  // Initialize the execution factory with our options and async matchers
  const zxcvbnInstance = new ZxcvbnFactory(options, { pwned: matcherPwned });

  // Return a bound function executing the instance's asynchronous checker
  return (password: string, userInputs?: (string | number)[]) =>
    zxcvbnInstance.checkAsync(password, userInputs);

  // //   const { Match, Matcher, MatchEstimated, MatchExtended } = types as any;
  // const matcherPwned = PwnedMatcher(fetchWithSignal, zxcvbnOptions);

  // Initialize options and matcher once at the top level
  // const regexMatcher = {
  //   Matching: class MatchRegex {
  //     regex =
  //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

  //     match({ password }: { password: string }) {
  //       const matches: any[] = [];
  //       const result = this.regex.exec(password);
  //       if (!result) {
  //         matches.push({
  //           pattern: "passRegex",
  //           token: password,
  //           i: 0,
  //           j: password.length - 1,
  //           length: password.length,
  //         });
  //       }
  //       return matches;
  //     }
  //   },
  //   feedback(match: any, isSoleMatch?: boolean) {
  //     return {
  //       warning: "Your password does not meet the required criteria.",
  //       suggestions: [
  //         "Password must be at least 10 characters,",
  //         "include uppercase,",
  //         "lowercase,",
  //         "number,",
  //         "and special character!",
  //       ],
  //     };
  //   },
  //   scoring(match: any) {
  //     // Customize the scoring as per the match strength
  //     return match.token.length * 5; // Example scoring
  //   },
  // };

  // const options = {
  //   translations: zxcvbnEnPackage.translations,
  //   graphs: zxcvbnCommonPackage.adjacencyGraphs,
  //   dictionary: {
  //     ...zxcvbnCommonPackage.dictionary,
  //     ...zxcvbnEnPackage.dictionary,
  //   },
  // };

  // zxcvbnOptions.setOptions(options);
  // // zxcvbnOptions.addMatcher("passRegex", regexMatcher);
  // zxcvbnOptions.addMatcher("pwned", matcherPwned);

  // return zxcvbnAsync;
};

const lazyZxcvbn = { loadDebounce, loadZxcvbn };
export default lazyZxcvbn;

import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  createDataTableQueryUrlCodec,
  createDataTableServerQueryState,
} from "@/components/DataTable/mui";

import {
  useDataTableServerQueryUrlState,
} from "./useDataTableServerQueryUrlState";

jest.mock(
  "next/navigation",
  () => ({
    usePathname:
      jest.fn(),
    useRouter:
      jest.fn(),
    useSearchParams:
      jest.fn(),
  }),
);

const mockUsePathname =
  jest.mocked(
    usePathname,
  );

const mockUseRouter =
  jest.mocked(
    useRouter,
  );

const mockUseSearchParams =
  jest.mocked(
    useSearchParams,
  );

const replace =
  jest.fn();

const push =
  jest.fn();

const defaultState =
  createDataTableServerQueryState(
    {
      pagination: {
        pageIndex:
          0,
        pageSize:
          25,
      },
    },
    25,
  );

const codec =
  createDataTableQueryUrlCodec({
    defaultState,
    fields: {
      sorting: {
        name:
          "name",
      },
      filtering: {
        name:
          "name",
      },
    },
  });

let currentSearch =
  "";

function setSearch(
  value: string,
): void {
  currentSearch =
    value.startsWith(
      "?",
    )
      ? value.slice(
          1,
        )
      : value;
}

function searchFromHref(
  href: string,
): string {
  return (
    href.split(
      "?",
    )[1]?.split(
      "#",
    )[0] ??
    ""
  );
}

beforeEach(() => {
  jest.resetAllMocks();

  currentSearch =
    "";

  mockUsePathname.mockReturnValue(
    "/admin/test",
  );

  mockUseRouter.mockReturnValue(
    {
      replace,
      push,
    } as never,
  );

  mockUseSearchParams.mockImplementation(
    () =>
      new URLSearchParams(
        currentSearch,
      ) as never,
  );
});

describe(
  "useDataTableServerQueryUrlState",
  () => {
    it(
      "hydrates from the URL, replaces local changes, and reapplies browser navigation without echoing it",
      async () => {
        const initial =
          codec.serialize({
            ...defaultState,
            pagination: {
              pageIndex:
                2,
              pageSize:
                50,
            },
            sorting: [
              {
                id:
                  "name",
                desc:
                  true,
              },
            ],
            globalFilter:
              "first",
          });

        setSearch(
          initial.toString(),
        );

        const {
          result,
          rerender,
        } =
          renderHook(
            () =>
              useDataTableServerQueryUrlState(
                {
                  codec,
                },
              ),
          );

        expect(
          result.current
            .state,
        ).toEqual({
          pagination: {
            pageIndex:
              2,
            pageSize:
              50,
          },
          sorting: [
            {
              id:
                "name",
              desc:
                true,
            },
          ],
          columnFilters:
            [],
          globalFilter:
            "first",
        });

        act(() => {
          result.current.onGlobalFilterChange(
            "second",
          );
        });

        expect(
          result.current
            .state
            .globalFilter,
        ).toBe(
          "second",
        );

        expect(
          result.current
            .state
            .pagination
            .pageIndex,
        ).toBe(
          0,
        );

        expect(
          replace,
        ).toHaveBeenCalledTimes(
          1,
        );

        const replacementHref =
          replace.mock
            .calls[0][0] as string;

        expect(
          replacementHref,
        ).toContain(
          "/admin/test?",
        );

        /**
         * Simulate the App Router committing our replace().
         */
        setSearch(
          searchFromHref(
            replacementHref,
          ),
        );

        rerender();

        /**
         * Simulate browser back/forward restoring the prior URL.
         */
        setSearch(
          initial.toString(),
        );

        rerender();

        await waitFor(() => {
          expect(
            result.current
              .state,
          ).toEqual({
            pagination: {
              pageIndex:
                2,
              pageSize:
                50,
            },
            sorting: [
              {
                id:
                  "name",
                desc:
                  true,
              },
            ],
            columnFilters:
              [],
            globalFilter:
              "first",
          });
        });

        /**
         * Applying browser history must not manufacture another navigation.
         */
        expect(
          replace,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          push,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "supports push history when explicitly requested",
      () => {
        const {
          result,
        } =
          renderHook(
            () =>
              useDataTableServerQueryUrlState(
                {
                  codec,
                  historyMode:
                    "push",
                },
              ),
          );

        act(() => {
          result.current.onSortingChange(
            [
              {
                id:
                  "name",
                desc:
                  false,
              },
            ],
          );
        });

        expect(
          push,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          replace,
        ).not.toHaveBeenCalled();
      },
    );
  },
);

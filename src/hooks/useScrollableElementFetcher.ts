import { MutableRefObject, useCallback, useRef } from "react";
import { isElementScrollable } from "../utils/scroll";
import { delay } from "../utils/delay";
import { useSafeEffect } from "./useSafeEffect";

/**
 * Custom hook that listens to scroll events on a given element and runs the fetch function when the end is reached.
 * It also checks if the element is scrollable and fetches data until it is.
 *
 * @param fetchFunction - The function that fetches data.
 * @param refetchDelay - The delay between each fetch attempt (default: 500ms).
 * @returns The ref to the scrollable element.
 */
export const useScrollableElementFetcher = (
  fetchFunction: () => Promise<boolean>,
  refetchDelay = 500
): MutableRefObject<HTMLDivElement | null> => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const fetchUntilScrollable = useCallback(async () => {
    const el = elementRef.current;
    const isScrollable = isElementScrollable(el);
    if (!isScrollable) {
      const hasMore = await fetchFunction();
      if (!hasMore) {
        return;
      }
      await delay(refetchDelay);
      fetchUntilScrollable();
      return;
    }
  }, [fetchFunction, refetchDelay]);

  useSafeEffect(() => {
    fetchUntilScrollable();

    const scrollListener = () => {
      const el = elementRef.current;

      if (!el) {
        return;
      }

      if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        fetchFunction();
      }
    };

    const el = elementRef.current;
    el?.addEventListener("scroll", scrollListener);

    return () => {
      const el = elementRef.current;
      el?.removeEventListener("scroll", scrollListener);
    };
  }, [fetchFunction, fetchUntilScrollable]);

  return elementRef;
};

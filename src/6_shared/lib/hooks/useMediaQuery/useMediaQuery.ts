import {useEffect, useState} from "react";

export const useMediaQuery = (query: string) => {
    const getMatches = () => {
        if (typeof window === "undefined" || !("matchMedia" in window)) return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState(getMatches);

    useEffect(() => {
        if (!("matchMedia" in window)) return;

        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);

        // sync in case query changed
        onChange();

        if ("addEventListener" in mql) {
            mql.addEventListener("change", onChange);
            return () => mql.removeEventListener("change", onChange);
        }

        // Safari < 14
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mql as any).addListener(onChange);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return () => (mql as any).removeListener(onChange);
    }, [query]);

    return matches;
};


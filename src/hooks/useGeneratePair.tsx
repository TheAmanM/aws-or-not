import contents from "../assets/json/contents.json";
import type { Service } from "../types/Service";

export function useGeneratePair() {
  const getPair = (): Service[] => {
    const typedRealContents = contents.real as Omit<Service, "isReal">[];
    const storedRealIndex = localStorage.getItem("contentIndex");

    let currentRealIndex = storedRealIndex
      ? parseInt(storedRealIndex, 10)
      : Math.floor(Date.now() / 1000) % typedRealContents.length;

    if (
      isNaN(currentRealIndex) ||
      currentRealIndex < 0 ||
      currentRealIndex >= typedRealContents.length
    ) {
      currentRealIndex = 0;
    }

    const realContent = {
      ...typedRealContents[currentRealIndex],
      isReal: true,
    };

    const nextRealIndex = (currentRealIndex + 1) % typedRealContents.length;
    localStorage.setItem("contentIndex", nextRealIndex.toString());

    const typedFakeContents = contents.fake as Omit<Service, "isReal">[];
    const lastFakeIndexStr = localStorage.getItem("lastFakeIndex");
    const lastFakeIndex = lastFakeIndexStr
      ? parseInt(lastFakeIndexStr, 10)
      : -1;

    let newFakeIndex;

    if (typedFakeContents.length > 1) {
      do {
        newFakeIndex = Math.floor(Math.random() * typedFakeContents.length);
      } while (newFakeIndex === lastFakeIndex);
    } else {
      newFakeIndex = 0;
    }

    localStorage.setItem("lastFakeIndex", newFakeIndex.toString());

    const fakeContent = { ...typedFakeContents[newFakeIndex], isReal: false };

    const pair = [realContent, fakeContent];

    return pair.sort(() => Math.random() - 0.5);
  };

  return { getPair };
}

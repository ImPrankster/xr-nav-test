import { atom } from "jotai";

export type Gesture = {
	neutral: boolean;
	thumbDistance: number;
};

export const gestureAtom = atom<Gesture>({
	neutral: false,
	thumbDistance: 0,
});

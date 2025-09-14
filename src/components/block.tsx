import { RoundedBox, type RoundedBoxProps } from "@react-three/drei";
import { type ForwardedRef, forwardRef } from "react";
import type { Mesh } from "three";

export const Block = forwardRef(
	(
		{
			children,
			transparent = false,
			opacity = 1,
			color = "white",
			args = [1, 1, 1],
			...props
		}: {
			transparent?: boolean;
			opacity?: number;
			color?: string;
			args?: [number, number, number];
		} & RoundedBoxProps,
		ref: ForwardedRef<Mesh>,
	) => {
		return (
			<RoundedBox args={args} receiveShadow castShadow ref={ref} {...props}>
				<meshStandardMaterial
					color={color}
					transparent={transparent}
					opacity={opacity}
				/>
				{children}
			</RoundedBox>
		);
	},
);

import { Vector3 } from "three";

const jointNames = [
	"Wrist", // 0
	"Thumb_Metacarpal",
	"Thumb_Phalanx_Proximal",
	"Thumb_Phalanx_Distal",
	"Thumb_Tip", // 1-4
	"Index_Metacarpal",
	"Index_Phalanx_Proximal",
	"Index_Phalanx_Intermediate",
	"Index_Phalanx_Distal",
	"Index_Tip", // 5-9
	"Middle_Metacarpal",
	"Middle_Phalanx_Proximal",
	"Middle_Phalanx_Intermediate",
	"Middle_Phalanx_Distal",
	"Middle_Tip", // 10-14
	"Ring_Metacarpal",
	"Ring_Phalanx_Proximal",
	"Ring_Phalanx_Intermediate",
	"Ring_Phalanx_Distal",
	"Ring_Tip", // 15-19
	"Pinky_Metacarpal",
	"Pinky_Phalanx_Proximal",
	"Pinky_Phalanx_Intermediate",
	"Pinky_Phalanx_Distal",
	"Pinky_Tip", // 20-24
] as const;

export type JOINT_TYPES = (typeof jointNames)[number];

/**
 * 25 joints, 16 floats per matrix (4x4 matrix).
 * A 4x4 matrix, known as a transformation matrix in 3D graphics, encodes a joint's complete spatial information:
 * 1. Position (Translation): The point (x, y, z) in space.
 * 2. Orientation (Rotation): The direction the joint is facing.
 * 3. Scale: How large the joint is (though for skeletons, this is usually uniform).
 */
export type Joints = Float32Array;

/**
 * Single joint, 16 floats.
 */
export type Joint = Float32Array;

/**
 * Map of joint names to their indices in the Joints array.
 */
export const JointMap: Record<JOINT_TYPES, number[]> = {
	Wrist: [0, 1, 2, 3, 4],
	Thumb_Metacarpal: [5, 6, 7, 8, 9],
	Thumb_Phalanx_Proximal: [10, 11, 12, 13, 14],
	Thumb_Phalanx_Distal: [15, 16, 17, 18, 19],
	Thumb_Tip: [20, 21, 22, 23, 24],
	Index_Metacarpal: [25, 26, 27, 28, 29],
	Index_Phalanx_Proximal: [30, 31, 32, 33, 34],
	Index_Phalanx_Intermediate: [35, 36, 37, 38, 39],
	Index_Phalanx_Distal: [40, 41, 42, 43, 44],
	Index_Tip: [45, 46, 47, 48, 49],
	Middle_Metacarpal: [50, 51, 52, 53, 54],
	Middle_Phalanx_Proximal: [55, 56, 57, 58, 59],
	Middle_Phalanx_Intermediate: [60, 61, 62, 63, 64],
	Middle_Phalanx_Distal: [65, 66, 67, 68, 69],
	Middle_Tip: [70, 71, 72, 73, 74],
	Ring_Metacarpal: [75, 76, 77, 78, 79],
	Ring_Phalanx_Proximal: [80, 81, 82, 83, 84],
	Ring_Phalanx_Intermediate: [85, 86, 87, 88, 89],
	Ring_Phalanx_Distal: [90, 91, 92, 93, 94],
	Ring_Tip: [95, 96, 97, 98, 99],
	Pinky_Metacarpal: [100, 101, 102, 103, 104],
	Pinky_Phalanx_Proximal: [105, 106, 107, 108, 109],
	Pinky_Phalanx_Intermediate: [110, 111, 112, 113, 114],
	Pinky_Phalanx_Distal: [115, 116, 117, 118, 119],
	Pinky_Tip: [120, 121, 122, 123, 124],
};

/**
 * Extracts joint transformation matrices from an XRFrame for all available hand input sources.
 *
 * This function iterates through the XRSession's input sources, and for each hand input source,
 * it fills a Float32Array with the 4x4 transformation matrices (16 floats per joint) for up to 25 joints.
 * The transformation matrix for each joint encodes its position, orientation, and scale in world space.
 *
 * @param {number} time - The timestamp of the XRFrame.
 * @param {XRFrame} frame - The XRFrame containing the latest pose data.
 * @param {XRSession} session - The XRSession from which to get input sources.
 * @param {XRReferenceSpace} originReferenceSpace - The reference space to use for pose calculations.
 * @returns {Float32Array | null} A Float32Array containing the joint transformation matrices if available, or null if not.
 */
export function getJointsFromXRFrame(
	time: number,
	frame: XRFrame,
	session: XRSession,
	originReferenceSpace: XRReferenceSpace,
): Joints | null {
	const inputSources = session.inputSources;
	const jointTransforms: Joints = new Float32Array(25 * 16);
	let gotJoints: boolean | undefined;

	if (!inputSources) return null;
	for (const inputSource of inputSources) {
		if (inputSource.hand && originReferenceSpace) {
			gotJoints = frame.fillPoses(
				inputSource.hand.values(),
				originReferenceSpace,
				jointTransforms,
			);
		}
	}

	if (gotJoints) {
		return jointTransforms;
	}

	return null;
}

export function getJointArrXYZ(joints: Joints): Vector3[] {
	const positions: Vector3[] = [];
	for (let i = 0; i < joints.length; i += 16) {
		positions.push(new Vector3(joints[i + 12], joints[i + 13], joints[i + 14]));
	}
	return positions;
}

export function getJointXYZ(joint: Joint): Vector3 {
	return new Vector3(joint[12], joint[13], joint[14]);
}

/**
 * Prints a 2D representation of the hand's joints to the console.
 * The joints are projected onto the XZ plane (top-down view) and displayed as ASCII art.
 *
 * @param {Joints} joints - The joint transformation matrices from getJointsFromXRFrame
 * @param {number} scale - Scale factor for the visualization (default: 10)
 * @param {number} width - Width of the display grid (default: 40)
 * @param {number} height - Height of the display grid (default: 20)
 */
export function printHandJoints2D(
	joints: Joints,
	scale: number = 1,
	width: number = 40,
	height: number = 20,
): void {
	const positions = getJointArrXYZ(joints);

	// Create a 2D grid
	const grid: string[][] = Array(height)
		.fill(null)
		.map(() => Array(width).fill(" "));

	// Find the bounds of the hand
	let minX = Infinity,
		maxX = -Infinity;
	let minZ = Infinity,
		maxZ = -Infinity;

	positions.forEach((pos) => {
		minX = Math.min(minX, pos.x);
		maxX = Math.max(maxX, pos.x);
		minZ = Math.min(minZ, pos.z);
		maxZ = Math.max(maxZ, pos.z);
	});

	// Calculate center and range
	const centerX = (minX + maxX) / 2;
	const centerZ = (minZ + maxZ) / 2;
	const rangeX = maxX - minX;
	const rangeZ = maxZ - minZ;
	const maxRange = Math.max(rangeX, rangeZ);

	// Scale factor to fit the grid
	const gridScale = Math.min(width, height) / (maxRange * scale);

	// Map joint positions to grid coordinates
	const gridPositions: { x: number; y: number; joint: number }[] = [];
	positions.forEach((pos, index) => {
		const gridX = Math.round((pos.x - centerX) * gridScale + width / 2);
		const gridY = Math.round((pos.z - centerZ) * gridScale + height / 2);

		if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
			gridPositions.push({ x: gridX, y: gridY, joint: index });
		}
	});

	// Place joints on the grid
	gridPositions.forEach(({ x, y, joint }) => {
		grid[y][x] = "•";
	});

	// Build the complete output as one text block
	let output = "\n=== Hand Joints 2D View (Top-down) ===\n";
	output += "─".repeat(width + 2) + "\n";

	for (let y = 0; y < height; y++) {
		output += "│" + grid[y].join("") + "│\n";
	}

	output += "─".repeat(width + 2) + "\n";

	console.log(output);
}

/**
 * Returns the name of a joint based on its index.
 * Based on the WebXR Hand Tracking API joint mapping.
 */
export function getJointName(jointIndex: number): string {
	return jointNames[jointIndex] || `Joint_${jointIndex}`;
}

export function getJointTransform(
	jointNames: JOINT_TYPES,
	joints: Joints,
): Joints {
	const jointIndex = JointMap[jointNames];
	return joints.slice(jointIndex[0] * 16, jointIndex[1] * 16);
}

import { Vector3 } from "three";

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

/**
 * 25 joints, 16 floats per matrix (4x4 matrix).
 * A 4x4 matrix, known as a transformation matrix in 3D graphics, encodes a joint's complete spatial information:
 * 1. Position (Translation): The point (x, y, z) in space.
 * 2. Orientation (Rotation): The direction the joint is facing.
 * 3. Scale: How large the joint is (though for skeletons, this is usually uniform).
 */
export type Joints = Float32Array;

export function getJointsPositions(joints: Joints): Vector3[] {
	const positions: Vector3[] = [];
	for (let i = 0; i < joints.length; i += 16) {
		positions.push(new Vector3(joints[i + 12], joints[i + 13], joints[i + 14]));
	}
	return positions;
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
	const positions = getJointsPositions(joints);

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
	];

	return jointNames[jointIndex] || `Joint_${jointIndex}`;
}

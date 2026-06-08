// ============================================
// IDL-800a Digital Lab Station — Core Types
// ============================================

// --- Breadboard Coordinate System ---

/** Breadboard column: a-e (left of gap), f-j (right of gap) */
export type BreadboardColumn = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j';

/** Breadboard section: the AD-200 has two terminal strip sections */
export type BreadboardSection = 1 | 2;

/** A specific hole on the breadboard */
export interface BreadboardHole {
  section: BreadboardSection;
  row: number; // 1-63
  column: BreadboardColumn;
}

/** Bus strip rail type */
export type BusRailType = 'power' | 'ground';

/** Bus strip position on the AD-200 */
export type BusStripPosition = 'top' | 'middle' | 'bottom';

/** A point on a bus strip */
export interface BusStripPoint {
  position: BusStripPosition;
  rail: BusRailType;
  hole?: number; // optional specific hole number on the bus strip
}

// --- IDL-800a Panel Points ---

/** Data switch identifier (S0-S7) */
export type DataSwitch = 'S0' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'S7';

/** LED indicator identifier (LED0-LED7) */
export type LEDIndicator = 'LED0' | 'LED1' | 'LED2' | 'LED3' | 'LED4' | 'LED5' | 'LED6' | 'LED7';

/** Power terminal on the Power Source Panel */
export type PowerTerminal = '+5V' | 'GND' | '+V' | '-5V' | '-V';

/** Any connection endpoint on the IDL-800a */
export type ConnectionPoint =
  | { type: 'breadboard'; location: BreadboardHole }
  | { type: 'bus'; location: BusStripPoint }
  | { type: 'switch'; id: DataSwitch }
  | { type: 'led'; id: LEDIndicator }
  | { type: 'power'; terminal: PowerTerminal }
  | { type: 'ic-pin'; chipId: string; pin: number; description: string };

// --- IC Chip Definitions ---

/** Direction of a pin */
export type PinDirection = 'input' | 'output' | 'power' | 'ground' | 'bidirectional';

/** Single pin on an IC */
export interface ICPin {
  number: number;
  name: string;
  direction: PinDirection;
  description: string;
  /** Which logical group this pin belongs to (e.g., "Gate 1", "Adder Bit 1") */
  group?: string;
}

/** Supported IC package types */
export type PackageType = 'DIP-14' | 'DIP-16' | 'DIP-20';

/** Full IC chip definition */
export interface ICChip {
  id: string; // e.g., "74LS283"
  name: string; // e.g., "4-Bit Binary Full Adder"
  package: PackageType;
  pinCount: number;
  pins: ICPin[];
  vccPin: number;
  gndPin: number;
  description: string;
  /** Logic family */
  family: '74LS';
  /** Functional category */
  category: 'adder' | 'and-gate' | 'or-gate' | 'nor-gate' | 'nand-gate' | 'not-gate' | 'xor-gate' | 'decoder' | 'multiplexer';
  /** Warning notes (e.g., non-sequential pin layout) */
  warnings?: string[];
}

// --- Circuit / Wiring ---

/** Placement of an IC on the breadboard */
export interface ICPlacement {
  /** User-friendly label, e.g., "U1", "U2" */
  label: string;
  /** Which IC chip this is */
  chipId: string;
  /** Section of the breadboard */
  section: BreadboardSection;
  /** Row where pin 1 is placed (pin 1 goes in column e) */
  pin1Row: number;
  /** Orientation: 'normal' means notch faces up (toward lower row numbers) */
  orientation: 'normal';
}

/** Wire color for visual clarity */
export type WireColor = 'red' | 'black' | 'yellow' | 'green' | 'blue' | 'orange' | 'white' | 'purple' | 'brown' | 'gray';

/** A single wire connection */
export interface WireConnection {
  from: ConnectionPoint;
  to: ConnectionPoint;
  color?: WireColor;
  /** Human-readable purpose of this wire */
  purpose: string;
}

/** A single step in the wiring instructions */
export interface WiringStep {
  stepNumber: number;
  /** Category of this step */
  category: 'power-setup' | 'ic-placement' | 'power-wiring' | 'input-wiring' | 'output-wiring' | 'inter-chip-wiring' | 'verification';
  /** Short title */
  title: string;
  /** Detailed instruction text */
  instruction: string;
  /** The wire connection (if applicable) */
  connection?: WireConnection;
  /** IC placement (if this is a placement step) */
  placement?: ICPlacement;
  /** Warning or tip */
  tip?: string;
}

// --- Experiment / Lab Definition ---

/** A complete lab experiment definition */
export interface Experiment {
  id: string;
  title: string;
  course: string;
  description: string;
  /** Parts within the experiment */
  parts: ExperimentPart[];
}

/** A part within an experiment (e.g., "Part 1: 4-bit Adder") */
export interface ExperimentPart {
  id: string;
  title: string;
  description: string;
  /** ICs required */
  icsRequired: string[];
  /** IC placements on the breadboard */
  placements: ICPlacement[];
  /** Ordered wiring steps */
  steps: WiringStep[];
  /** Test cases to verify the circuit */
  testCases: TestCase[];
}

/** A test case for verifying the circuit */
export interface TestCase {
  /** Input switch settings */
  inputs: Record<DataSwitch, 0 | 1>;
  /** Expected LED outputs */
  expectedOutputs: Record<LEDIndicator, 0 | 1>;
  /** Human-readable description */
  description: string;
}

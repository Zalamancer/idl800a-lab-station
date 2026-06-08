// ============================================================
// Experiment #3: 4-Bit Binary Addition & BCD Adder
// ============================================================

import type {
  Experiment,
  ExperimentPart,
  WiringStep,
  ICPlacement,
  TestCase,
  ConnectionPoint,
  WireColor,
} from '@/types';

// ---------------------------------------------------------------
// Helper: build ConnectionPoint literals concisely
// ---------------------------------------------------------------

const bb = (
  section: 1 | 2,
  row: number,
  column: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j',
): ConnectionPoint => ({
  type: 'breadboard',
  location: { section, row, column },
});

const bus = (
  position: 'top' | 'middle' | 'bottom',
  rail: 'power' | 'ground',
): ConnectionPoint => ({
  type: 'bus',
  location: { position, rail },
});

const sw = (id: `S${number}`): ConnectionPoint => ({
  type: 'switch',
  id: id as any,
});

const led = (id: `LED${number}`): ConnectionPoint => ({
  type: 'led',
  id: id as any,
});

const icPin = (
  chipId: string,
  pin: number,
  description: string,
): ConnectionPoint => ({
  type: 'ic-pin',
  chipId,
  pin,
  description,
});

// ---------------------------------------------------------------
// Part 1 — IC Placements
// ---------------------------------------------------------------
// U1: 74LS283, section 1, pin 1 at row 5
//
// Physical mapping (DIP-16, pin 1 in row 5-e, pin 16 in row 5-f):
//   Pin 1  (S2)  → row 5,  col e   |  Pin 16 (VCC) → row 5,  col f
//   Pin 2  (B2)  → row 6,  col e   |  Pin 15 (B3)  → row 6,  col f
//   Pin 3  (A2)  → row 7,  col e   |  Pin 14 (A3)  → row 7,  col f
//   Pin 4  (S1)  → row 8,  col e   |  Pin 13 (S3)  → row 8,  col f
//   Pin 5  (A1)  → row 9,  col e   |  Pin 12 (A4)  → row 9,  col f
//   Pin 6  (B1)  → row 10, col e   |  Pin 11 (B4)  → row 10, col f
//   Pin 7  (C0)  → row 11, col e   |  Pin 10 (S4)  → row 11, col f
//   Pin 8  (GND) → row 12, col e   |  Pin 9  (C4)  → row 12, col f

const part1Placements: ICPlacement[] = [
  {
    label: 'U1',
    chipId: '74LS283',
    section: 1,
    pin1Row: 5,
    orientation: 'normal',
  },
];

// ---------------------------------------------------------------
// Part 1 — Wiring Steps
// ---------------------------------------------------------------

const part1Steps: WiringStep[] = [
  // --- Power Setup ---
  {
    stepNumber: 1,
    category: 'power-setup',
    title: 'Connect power rails',
    instruction:
      'Run a red wire from the +5V terminal on the Power Source Panel to the red (power) bus strip at the top of section 1. Run a black wire from the GND terminal to the blue (ground) bus strip at the top of section 1.',
    connection: {
      from: { type: 'power', terminal: '+5V' },
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Supply +5V to the top power bus strip',
    },
    tip: 'Also bridge bus strip halves if not already done (jumper hole 31 to hole 34 on each rail).',
  },
  {
    stepNumber: 2,
    category: 'power-setup',
    title: 'Connect ground rail',
    instruction:
      'Run a black wire from the GND terminal on the Power Source Panel to the blue (ground) bus strip at the top of section 1.',
    connection: {
      from: { type: 'power', terminal: 'GND' },
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Supply GND to the top ground bus strip',
    },
  },

  // --- IC Placement ---
  {
    stepNumber: 3,
    category: 'ic-placement',
    title: 'Place U1 (74LS283)',
    instruction:
      'Place the 74LS283 (U1) straddling the center gap on section 1 with pin 1 in row 5 column e and pin 16 in row 5 column f. The notch should face toward lower row numbers (upward). Pin 8 (GND) lands in row 12 column e; pin 9 (C4) in row 12 column f.',
    placement: part1Placements[0],
    tip: 'Double-check orientation: the notch end (pin 1 / pin 16) faces the top bus strip. Reversing the chip will destroy it when power is applied.',
  },

  // --- Power Wiring ---
  {
    stepNumber: 4,
    category: 'power-wiring',
    title: 'U1 VCC (pin 16)',
    instruction:
      'Connect a red wire from row 5 column j (same row as U1 pin 16) to the red (+5V) bus strip at the top of section 1.',
    connection: {
      from: bb(1, 5, 'j'),
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Power U1 — pin 16 (VCC) to +5V',
    },
  },
  {
    stepNumber: 5,
    category: 'power-wiring',
    title: 'U1 GND (pin 8)',
    instruction:
      'Connect a black wire from row 12 column a (same row as U1 pin 8) to the blue (GND) bus strip at the top of section 1.',
    connection: {
      from: bb(1, 12, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Ground U1 — pin 8 (GND) to 0V',
    },
  },

  // --- Input Wiring: A operand (S0-S3 → A1-A4) ---
  {
    stepNumber: 6,
    category: 'input-wiring',
    title: 'S0 → U1 A1 (pin 5)',
    instruction:
      'Connect a yellow wire from data switch S0 to row 9 column a (same row as U1 pin 5 / A1). S0 supplies bit 0 of operand A.',
    connection: {
      from: sw('S0'),
      to: bb(1, 9, 'a'),
      color: 'yellow',
      purpose: 'Input A bit 0 — switch S0 to U1 A1 (pin 5)',
    },
  },
  {
    stepNumber: 7,
    category: 'input-wiring',
    title: 'S1 → U1 A2 (pin 3)',
    instruction:
      'Connect a yellow wire from data switch S1 to row 7 column a (same row as U1 pin 3 / A2). S1 supplies bit 1 of operand A.',
    connection: {
      from: sw('S1'),
      to: bb(1, 7, 'a'),
      color: 'yellow',
      purpose: 'Input A bit 1 — switch S1 to U1 A2 (pin 3)',
    },
  },
  {
    stepNumber: 8,
    category: 'input-wiring',
    title: 'S2 → U1 A3 (pin 14)',
    instruction:
      'Connect a yellow wire from data switch S2 to row 7 column j (same row as U1 pin 14 / A3). S2 supplies bit 2 of operand A.',
    connection: {
      from: sw('S2'),
      to: bb(1, 7, 'j'),
      color: 'yellow',
      purpose: 'Input A bit 2 — switch S2 to U1 A3 (pin 14)',
    },
  },
  {
    stepNumber: 9,
    category: 'input-wiring',
    title: 'S3 → U1 A4 (pin 12)',
    instruction:
      'Connect a yellow wire from data switch S3 to row 9 column j (same row as U1 pin 12 / A4). S3 supplies bit 3 (MSB) of operand A.',
    connection: {
      from: sw('S3'),
      to: bb(1, 9, 'j'),
      color: 'yellow',
      purpose: 'Input A bit 3 — switch S3 to U1 A4 (pin 12)',
    },
  },

  // --- Input Wiring: B operand (S4-S7 → B1-B4) ---
  {
    stepNumber: 10,
    category: 'input-wiring',
    title: 'S4 → U1 B1 (pin 6)',
    instruction:
      'Connect a green wire from data switch S4 to row 10 column a (same row as U1 pin 6 / B1). S4 supplies bit 0 of operand B.',
    connection: {
      from: sw('S4'),
      to: bb(1, 10, 'a'),
      color: 'green',
      purpose: 'Input B bit 0 — switch S4 to U1 B1 (pin 6)',
    },
  },
  {
    stepNumber: 11,
    category: 'input-wiring',
    title: 'S5 → U1 B2 (pin 2)',
    instruction:
      'Connect a green wire from data switch S5 to row 6 column a (same row as U1 pin 2 / B2). S5 supplies bit 1 of operand B.',
    connection: {
      from: sw('S5'),
      to: bb(1, 6, 'a'),
      color: 'green',
      purpose: 'Input B bit 1 — switch S5 to U1 B2 (pin 2)',
    },
  },
  {
    stepNumber: 12,
    category: 'input-wiring',
    title: 'S6 → U1 B3 (pin 15)',
    instruction:
      'Connect a green wire from data switch S6 to row 6 column j (same row as U1 pin 15 / B3). S6 supplies bit 2 of operand B.',
    connection: {
      from: sw('S6'),
      to: bb(1, 6, 'j'),
      color: 'green',
      purpose: 'Input B bit 2 — switch S6 to U1 B3 (pin 15)',
    },
  },
  {
    stepNumber: 13,
    category: 'input-wiring',
    title: 'S7 → U1 B4 (pin 11)',
    instruction:
      'Connect a green wire from data switch S7 to row 10 column j (same row as U1 pin 11 / B4). S7 supplies bit 3 (MSB) of operand B.',
    connection: {
      from: sw('S7'),
      to: bb(1, 10, 'j'),
      color: 'green',
      purpose: 'Input B bit 3 — switch S7 to U1 B4 (pin 11)',
    },
  },

  // --- Carry In → GND ---
  {
    stepNumber: 14,
    category: 'input-wiring',
    title: 'U1 C0 (pin 7) → GND',
    instruction:
      'Connect a black wire from row 11 column a (same row as U1 pin 7 / C0) to the blue (GND) bus strip. This ties carry-in to 0 (no incoming carry).',
    connection: {
      from: bb(1, 11, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie carry-in to GND — no carry into this stage',
    },
  },

  // --- Output Wiring: Sum and Carry to LEDs ---
  {
    stepNumber: 15,
    category: 'output-wiring',
    title: 'U1 S1 (pin 4) → LED0',
    instruction:
      'Connect a blue wire from row 8 column a (same row as U1 pin 4 / S1) to LED0 input hole. LED0 shows sum bit 0 (weight 1).',
    connection: {
      from: bb(1, 8, 'a'),
      to: led('LED0'),
      color: 'blue',
      purpose: 'Sum bit 0 — U1 S1 (pin 4) to LED0',
    },
  },
  {
    stepNumber: 16,
    category: 'output-wiring',
    title: 'U1 S2 (pin 1) → LED1',
    instruction:
      'Connect a blue wire from row 5 column a (same row as U1 pin 1 / S2) to LED1 input hole. LED1 shows sum bit 1 (weight 2).',
    connection: {
      from: bb(1, 5, 'a'),
      to: led('LED1'),
      color: 'blue',
      purpose: 'Sum bit 1 — U1 S2 (pin 1) to LED1',
    },
  },
  {
    stepNumber: 17,
    category: 'output-wiring',
    title: 'U1 S3 (pin 13) → LED2',
    instruction:
      'Connect a blue wire from row 8 column j (same row as U1 pin 13 / S3) to LED2 input hole. LED2 shows sum bit 2 (weight 4).',
    connection: {
      from: bb(1, 8, 'j'),
      to: led('LED2'),
      color: 'blue',
      purpose: 'Sum bit 2 — U1 S3 (pin 13) to LED2',
    },
  },
  {
    stepNumber: 18,
    category: 'output-wiring',
    title: 'U1 S4 (pin 10) → LED3',
    instruction:
      'Connect a blue wire from row 11 column j (same row as U1 pin 10 / S4) to LED3 input hole. LED3 shows sum bit 3 (weight 8).',
    connection: {
      from: bb(1, 11, 'j'),
      to: led('LED3'),
      color: 'blue',
      purpose: 'Sum bit 3 — U1 S4 (pin 10) to LED3',
    },
  },
  {
    stepNumber: 19,
    category: 'output-wiring',
    title: 'U1 C4 (pin 9) → LED4',
    instruction:
      'Connect a white wire from row 12 column j (same row as U1 pin 9 / C4) to LED4 input hole. LED4 shows the carry out (weight 16).',
    connection: {
      from: bb(1, 12, 'j'),
      to: led('LED4'),
      color: 'white',
      purpose: 'Carry out — U1 C4 (pin 9) to LED4',
    },
  },
];

// ---------------------------------------------------------------
// Part 1 — Test Cases (10 cases)
// ---------------------------------------------------------------
// Switches: S0-S3 = A (A1 LSB … A4 MSB), S4-S7 = B (B1 LSB … B4 MSB)
// LEDs: LED0-LED3 = sum bits (S1 LSB … S4 MSB), LED4 = carry out

function makePart1Test(
  a: number,
  b: number,
  description: string,
): TestCase {
  const sum = a + b;
  const s = sum & 0xf;     // lower 4 bits
  const c = sum > 15 ? 1 : 0; // carry out

  const bit = (v: number, n: number): 0 | 1 => ((v >> n) & 1) as 0 | 1;

  return {
    inputs: {
      S0: bit(a, 0), S1: bit(a, 1), S2: bit(a, 2), S3: bit(a, 3),
      S4: bit(b, 0), S5: bit(b, 1), S6: bit(b, 2), S7: bit(b, 3),
    },
    expectedOutputs: {
      LED0: bit(s, 0),
      LED1: bit(s, 1),
      LED2: bit(s, 2),
      LED3: bit(s, 3),
      LED4: c as 0 | 1,
      LED5: 0, LED6: 0, LED7: 0,
    },
    description,
  };
}

const part1Tests: TestCase[] = [
  makePart1Test(0, 0,   '0 + 0 = 0 (all LEDs off)'),
  makePart1Test(3, 5,   '3 + 5 = 8 (LED3 on)'),
  makePart1Test(7, 2,   '7 + 2 = 9 (LED0, LED3 on)'),
  makePart1Test(6, 6,   '6 + 6 = 12 (LED2, LED3 on)'),
  makePart1Test(9, 7,   '9 + 7 = 16 (LED4 carry on, sum = 0)'),
  makePart1Test(8, 8,   '8 + 8 = 16 (LED4 carry on, sum = 0)'),
  makePart1Test(15, 1,  '15 + 1 = 16 (LED4 carry on, sum = 0)'),
  makePart1Test(15, 15, '15 + 15 = 30 (LED4 carry, sum = 14)'),
  makePart1Test(10, 5,  '10 + 5 = 15 (LED0-LED3 all on)'),
  makePart1Test(1, 1,   '1 + 1 = 2 (LED1 on)'),
];

// ===============================================================
// Part 2 — BCD Adder
// ===============================================================
//
// U1: 74LS283 (binary addition)   — section 1, pin 1 at row 5
//   Same pin mapping as Part 1.
//
// U2: 74LS08 (AND gates)          — section 1, pin 1 at row 20
//   Pin 1  (1A)  → row 20, col e  |  Pin 14 (VCC) → row 20, col f
//   Pin 2  (1B)  → row 21, col e  |  Pin 13 (4B)  → row 21, col f
//   Pin 3  (1Y)  → row 22, col e  |  Pin 12 (4A)  → row 22, col f
//   Pin 4  (2A)  → row 23, col e  |  Pin 11 (4Y)  → row 23, col f
//   Pin 5  (2B)  → row 24, col e  |  Pin 10 (3B)  → row 24, col f
//   Pin 6  (2Y)  → row 25, col e  |  Pin 9  (3A)  → row 25, col f
//   Pin 7  (GND) → row 26, col e  |  Pin 8  (3Y)  → row 26, col f
//
// U3: 74LS32 (OR gates)           — section 1, pin 1 at row 28
//   Pin 1  (1A)  → row 28, col e  |  Pin 14 (VCC) → row 28, col f
//   Pin 2  (1B)  → row 29, col e  |  Pin 13 (4B)  → row 29, col f
//   Pin 3  (1Y)  → row 30, col e  |  Pin 12 (4A)  → row 30, col f
//   Pin 4  (2A)  → row 31, col e  |  Pin 11 (4Y)  → row 31, col f
//   Pin 5  (2B)  → row 32, col e  |  Pin 10 (3B)  → row 32, col f
//   Pin 6  (2Y)  → row 33, col e  |  Pin 9  (3A)  → row 33, col f
//   Pin 7  (GND) → row 34, col e  |  Pin 8  (3Y)  → row 34, col f
//
// U4: 74LS283 (correction adder)  — section 1, pin 1 at row 36
//   Pin 1  (S2)  → row 36, col e  |  Pin 16 (VCC) → row 36, col f
//   Pin 2  (B2)  → row 37, col e  |  Pin 15 (B3)  → row 37, col f
//   Pin 3  (A2)  → row 38, col e  |  Pin 14 (A3)  → row 38, col f
//   Pin 4  (S1)  → row 39, col e  |  Pin 13 (S3)  → row 39, col f
//   Pin 5  (A1)  → row 40, col e  |  Pin 12 (A4)  → row 40, col f
//   Pin 6  (B1)  → row 41, col e  |  Pin 11 (B4)  → row 41, col f
//   Pin 7  (C0)  → row 42, col e  |  Pin 10 (S4)  → row 42, col f
//   Pin 8  (GND) → row 43, col e  |  Pin 9  (C4)  → row 43, col f

const part2Placements: ICPlacement[] = [
  {
    label: 'U1',
    chipId: '74LS283',
    section: 1,
    pin1Row: 5,
    orientation: 'normal',
  },
  {
    label: 'U2',
    chipId: '74LS08',
    section: 1,
    pin1Row: 20,
    orientation: 'normal',
  },
  {
    label: 'U3',
    chipId: '74LS32',
    section: 1,
    pin1Row: 28,
    orientation: 'normal',
  },
  {
    label: 'U4',
    chipId: '74LS283',
    section: 1,
    pin1Row: 36,
    orientation: 'normal',
  },
];

const part2Steps: WiringStep[] = [
  // ===== POWER SETUP =====
  {
    stepNumber: 1,
    category: 'power-setup',
    title: 'Connect +5V power rail',
    instruction:
      'Run a red wire from the +5V terminal on the Power Source Panel to the red (power) bus strip at the top of section 1.',
    connection: {
      from: { type: 'power', terminal: '+5V' },
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Supply +5V to the top power bus strip',
    },
    tip: 'Bridge bus strip halves with jumper wires (hole 31 to 34) on both the red and blue strips before starting.',
  },
  {
    stepNumber: 2,
    category: 'power-setup',
    title: 'Connect GND rail',
    instruction:
      'Run a black wire from the GND terminal on the Power Source Panel to the blue (ground) bus strip at the top of section 1.',
    connection: {
      from: { type: 'power', terminal: 'GND' },
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Supply GND to the top ground bus strip',
    },
  },

  // ===== IC PLACEMENTS =====
  {
    stepNumber: 3,
    category: 'ic-placement',
    title: 'Place U1 (74LS283 — binary adder)',
    instruction:
      'Place the first 74LS283 (U1) straddling the center gap on section 1 with pin 1 in row 5 column e and pin 16 in row 5 column f. The notch faces upward (toward lower row numbers). Pin 8 (GND) is in row 12-e, pin 9 (C4) in row 12-f.',
    placement: part2Placements[0],
    tip: 'Verify orientation before power-on. VCC (pin 16) should be at row 5-f, GND (pin 8) at row 12-e.',
  },
  {
    stepNumber: 4,
    category: 'ic-placement',
    title: 'Place U2 (74LS08 — AND gates)',
    instruction:
      'Place the 74LS08 (U2) straddling the center gap on section 1 with pin 1 in row 20 column e and pin 14 in row 20 column f. The notch faces upward. Pin 7 (GND) is in row 26-e, pin 8 in row 26-f.',
    placement: part2Placements[1],
    tip: 'Leave at least 7 empty rows between U1 and U2 for neat inter-chip wiring.',
  },
  {
    stepNumber: 5,
    category: 'ic-placement',
    title: 'Place U3 (74LS32 — OR gates)',
    instruction:
      'Place the 74LS32 (U3) straddling the center gap on section 1 with pin 1 in row 28 column e and pin 14 in row 28 column f. The notch faces upward. Pin 7 (GND) is in row 34-e, pin 8 in row 34-f.',
    placement: part2Placements[2],
  },
  {
    stepNumber: 6,
    category: 'ic-placement',
    title: 'Place U4 (74LS283 — correction adder)',
    instruction:
      'Place the second 74LS283 (U4) straddling the center gap on section 1 with pin 1 in row 36 column e and pin 16 in row 36 column f. The notch faces upward. Pin 8 (GND) is in row 43-e, pin 9 (C4) in row 43-f.',
    placement: part2Placements[3],
    tip: 'This chip adds the correction factor (0110) when the BCD sum exceeds 9.',
  },

  // ===== POWER WIRING (all 4 ICs) =====
  {
    stepNumber: 7,
    category: 'power-wiring',
    title: 'U1 VCC (pin 16)',
    instruction:
      'Connect a red wire from row 5 column j (U1 pin 16 / VCC) to the red (+5V) bus strip.',
    connection: {
      from: bb(1, 5, 'j'),
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Power U1 — pin 16 (VCC) to +5V',
    },
  },
  {
    stepNumber: 8,
    category: 'power-wiring',
    title: 'U1 GND (pin 8)',
    instruction:
      'Connect a black wire from row 12 column a (U1 pin 8 / GND) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 12, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Ground U1 — pin 8 (GND) to 0V',
    },
  },
  {
    stepNumber: 9,
    category: 'power-wiring',
    title: 'U2 VCC (pin 14)',
    instruction:
      'Connect a red wire from row 20 column j (U2 pin 14 / VCC) to the red (+5V) bus strip.',
    connection: {
      from: bb(1, 20, 'j'),
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Power U2 — pin 14 (VCC) to +5V',
    },
  },
  {
    stepNumber: 10,
    category: 'power-wiring',
    title: 'U2 GND (pin 7)',
    instruction:
      'Connect a black wire from row 26 column a (U2 pin 7 / GND) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 26, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Ground U2 — pin 7 (GND) to 0V',
    },
  },
  {
    stepNumber: 11,
    category: 'power-wiring',
    title: 'U3 VCC (pin 14)',
    instruction:
      'Connect a red wire from row 28 column j (U3 pin 14 / VCC) to the red (+5V) bus strip.',
    connection: {
      from: bb(1, 28, 'j'),
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Power U3 — pin 14 (VCC) to +5V',
    },
  },
  {
    stepNumber: 12,
    category: 'power-wiring',
    title: 'U3 GND (pin 7)',
    instruction:
      'Connect a black wire from row 34 column a (U3 pin 7 / GND) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 34, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Ground U3 — pin 7 (GND) to 0V',
    },
  },
  {
    stepNumber: 13,
    category: 'power-wiring',
    title: 'U4 VCC (pin 16)',
    instruction:
      'Connect a red wire from row 36 column j (U4 pin 16 / VCC) to the red (+5V) bus strip.',
    connection: {
      from: bb(1, 36, 'j'),
      to: bus('top', 'power'),
      color: 'red',
      purpose: 'Power U4 — pin 16 (VCC) to +5V',
    },
  },
  {
    stepNumber: 14,
    category: 'power-wiring',
    title: 'U4 GND (pin 8)',
    instruction:
      'Connect a black wire from row 43 column a (U4 pin 8 / GND) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 43, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Ground U4 — pin 8 (GND) to 0V',
    },
  },

  // ===== INPUT WIRING: Switches → U1 =====
  // A inputs (S0-S3 → U1 A1-A4)
  {
    stepNumber: 15,
    category: 'input-wiring',
    title: 'S0 → U1 A1 (pin 5)',
    instruction:
      'Connect a yellow wire from data switch S0 to row 9 column a (U1 pin 5 / A1). S0 is BCD digit A bit 0 (LSB).',
    connection: {
      from: sw('S0'),
      to: bb(1, 9, 'a'),
      color: 'yellow',
      purpose: 'BCD digit A bit 0 — switch S0 to U1 A1 (pin 5)',
    },
  },
  {
    stepNumber: 16,
    category: 'input-wiring',
    title: 'S1 → U1 A2 (pin 3)',
    instruction:
      'Connect a yellow wire from data switch S1 to row 7 column a (U1 pin 3 / A2). S1 is BCD digit A bit 1.',
    connection: {
      from: sw('S1'),
      to: bb(1, 7, 'a'),
      color: 'yellow',
      purpose: 'BCD digit A bit 1 — switch S1 to U1 A2 (pin 3)',
    },
  },
  {
    stepNumber: 17,
    category: 'input-wiring',
    title: 'S2 → U1 A3 (pin 14)',
    instruction:
      'Connect a yellow wire from data switch S2 to row 7 column j (U1 pin 14 / A3). S2 is BCD digit A bit 2.',
    connection: {
      from: sw('S2'),
      to: bb(1, 7, 'j'),
      color: 'yellow',
      purpose: 'BCD digit A bit 2 — switch S2 to U1 A3 (pin 14)',
    },
  },
  {
    stepNumber: 18,
    category: 'input-wiring',
    title: 'S3 → U1 A4 (pin 12)',
    instruction:
      'Connect a yellow wire from data switch S3 to row 9 column j (U1 pin 12 / A4). S3 is BCD digit A bit 3 (MSB).',
    connection: {
      from: sw('S3'),
      to: bb(1, 9, 'j'),
      color: 'yellow',
      purpose: 'BCD digit A bit 3 — switch S3 to U1 A4 (pin 12)',
    },
  },

  // B inputs (S4-S7 → U1 B1-B4)
  {
    stepNumber: 19,
    category: 'input-wiring',
    title: 'S4 → U1 B1 (pin 6)',
    instruction:
      'Connect a green wire from data switch S4 to row 10 column a (U1 pin 6 / B1). S4 is BCD digit B bit 0 (LSB).',
    connection: {
      from: sw('S4'),
      to: bb(1, 10, 'a'),
      color: 'green',
      purpose: 'BCD digit B bit 0 — switch S4 to U1 B1 (pin 6)',
    },
  },
  {
    stepNumber: 20,
    category: 'input-wiring',
    title: 'S5 → U1 B2 (pin 2)',
    instruction:
      'Connect a green wire from data switch S5 to row 6 column a (U1 pin 2 / B2). S5 is BCD digit B bit 1.',
    connection: {
      from: sw('S5'),
      to: bb(1, 6, 'a'),
      color: 'green',
      purpose: 'BCD digit B bit 1 — switch S5 to U1 B2 (pin 2)',
    },
  },
  {
    stepNumber: 21,
    category: 'input-wiring',
    title: 'S6 → U1 B3 (pin 15)',
    instruction:
      'Connect a green wire from data switch S6 to row 6 column j (U1 pin 15 / B3). S6 is BCD digit B bit 2.',
    connection: {
      from: sw('S6'),
      to: bb(1, 6, 'j'),
      color: 'green',
      purpose: 'BCD digit B bit 2 — switch S6 to U1 B3 (pin 15)',
    },
  },
  {
    stepNumber: 22,
    category: 'input-wiring',
    title: 'S7 → U1 B4 (pin 11)',
    instruction:
      'Connect a green wire from data switch S7 to row 10 column j (U1 pin 11 / B4). S7 is BCD digit B bit 3 (MSB).',
    connection: {
      from: sw('S7'),
      to: bb(1, 10, 'j'),
      color: 'green',
      purpose: 'BCD digit B bit 3 — switch S7 to U1 B4 (pin 11)',
    },
  },

  // Carry in
  {
    stepNumber: 23,
    category: 'input-wiring',
    title: 'U1 C0 (pin 7) → GND',
    instruction:
      'Connect a black wire from row 11 column a (U1 pin 7 / C0) to the blue (GND) bus strip. No incoming carry for this single-digit BCD addition.',
    connection: {
      from: bb(1, 11, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie U1 carry-in to GND (no carry into first adder)',
    },
  },

  // ===== INTER-CHIP WIRING: Detection Circuit =====
  //
  // Detection equation: Y = C4 + (S4 * S3) + (S4 * S2)
  //
  // U2 AND gate 1 (pins 1,2→3): S4 AND S3
  // U2 AND gate 2 (pins 4,5→6): S4 AND S2
  // U3 OR gate 1  (pins 1,2→3): AND1 output OR AND2 output
  // U3 OR gate 2  (pins 4,5→6): OR1 output OR C4  →  Y (correction signal)

  // --- U1 S4 (pin 10, row 11-f) → U2 AND gate 1, input A (pin 1, row 20-e) ---
  {
    stepNumber: 24,
    category: 'inter-chip-wiring',
    title: 'U1 S4 → U2 gate 1 input A (pin 1)',
    instruction:
      'Connect an orange wire from row 11 column g (U1 pin 10 / S4, right side) to row 20 column a (U2 pin 1 / 1A, left side). This feeds the binary sum MSB (S4) to the first AND gate input.',
    connection: {
      from: bb(1, 11, 'g'),
      to: bb(1, 20, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S4 (sum bit 3) to U2 AND gate 1 input A',
    },
    tip: 'S4 fans out to both AND gates. Use a free hole in the same row on U1 pin 10 side.',
  },

  // --- U1 S3 (pin 13, row 8-f) → U2 AND gate 1, input B (pin 2, row 21-e) ---
  {
    stepNumber: 25,
    category: 'inter-chip-wiring',
    title: 'U1 S3 → U2 gate 1 input B (pin 2)',
    instruction:
      'Connect an orange wire from row 8 column g (U1 pin 13 / S3, right side) to row 21 column a (U2 pin 2 / 1B, left side). This feeds sum bit 2 (S3) to the first AND gate input B.',
    connection: {
      from: bb(1, 8, 'g'),
      to: bb(1, 21, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S3 (sum bit 2) to U2 AND gate 1 input B',
    },
  },

  // --- U1 S4 (pin 10, row 11-f) → U2 AND gate 2, input A (pin 4, row 23-e) ---
  {
    stepNumber: 26,
    category: 'inter-chip-wiring',
    title: 'U1 S4 → U2 gate 2 input A (pin 4)',
    instruction:
      'Connect an orange wire from row 11 column h (U1 pin 10 / S4, right side) to row 23 column a (U2 pin 4 / 2A, left side). This feeds S4 to the second AND gate.',
    connection: {
      from: bb(1, 11, 'h'),
      to: bb(1, 23, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S4 (sum bit 3) to U2 AND gate 2 input A',
    },
    tip: 'Row 11 on the f-j side is shared by U1 pin 10 (S4). Columns g, h, i are free for fan-out.',
  },

  // --- U1 S2 (pin 1, row 5-e) → U2 AND gate 2, input B (pin 5, row 24-e) ---
  {
    stepNumber: 27,
    category: 'inter-chip-wiring',
    title: 'U1 S2 → U2 gate 2 input B (pin 5)',
    instruction:
      'Connect an orange wire from row 5 column b (U1 pin 1 / S2, left side) to row 24 column a (U2 pin 5 / 2B, left side). This feeds sum bit 1 (S2) to the second AND gate input B.',
    connection: {
      from: bb(1, 5, 'b'),
      to: bb(1, 24, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S2 (sum bit 1) to U2 AND gate 2 input B',
    },
  },

  // --- U2 gate 1 output (pin 3, row 22-e) → U3 OR gate 1 input A (pin 1, row 28-e) ---
  {
    stepNumber: 28,
    category: 'inter-chip-wiring',
    title: 'U2 gate 1 output → U3 OR gate 1 input A (pin 1)',
    instruction:
      'Connect an orange wire from row 22 column a (U2 pin 3 / 1Y output) to row 28 column a (U3 pin 1 / 1A input). This carries the S4*S3 detection term to the OR gate.',
    connection: {
      from: bb(1, 22, 'a'),
      to: bb(1, 28, 'a'),
      color: 'orange',
      purpose: 'S4 AND S3 result to U3 OR gate 1 input A',
    },
  },

  // --- U2 gate 2 output (pin 6, row 25-e) → U3 OR gate 1 input B (pin 2, row 29-e) ---
  {
    stepNumber: 29,
    category: 'inter-chip-wiring',
    title: 'U2 gate 2 output → U3 OR gate 1 input B (pin 2)',
    instruction:
      'Connect an orange wire from row 25 column a (U2 pin 6 / 2Y output) to row 29 column a (U3 pin 2 / 1B input). This carries the S4*S2 detection term to the OR gate.',
    connection: {
      from: bb(1, 25, 'a'),
      to: bb(1, 29, 'a'),
      color: 'orange',
      purpose: 'S4 AND S2 result to U3 OR gate 1 input B',
    },
  },

  // --- U3 OR gate 1 output (pin 3, row 30-e) → U3 OR gate 2 input A (pin 4, row 31-e) ---
  {
    stepNumber: 30,
    category: 'inter-chip-wiring',
    title: 'U3 gate 1 output → U3 gate 2 input A (pin 4)',
    instruction:
      'Connect an orange wire from row 30 column a (U3 pin 3 / 1Y output) to row 31 column a (U3 pin 4 / 2A input). This chains the first OR gate output into the second OR gate to combine all three detection terms.',
    connection: {
      from: bb(1, 30, 'a'),
      to: bb(1, 31, 'a'),
      color: 'orange',
      purpose: 'Chain OR gate 1 output to OR gate 2 input A',
    },
    tip: 'This OR gate chaining combines (S4*S3) OR (S4*S2) from the first gate with C4 in the second gate.',
  },

  // --- U1 C4 (pin 9, row 12-f) → U3 OR gate 2 input B (pin 5, row 32-e) ---
  {
    stepNumber: 31,
    category: 'inter-chip-wiring',
    title: 'U1 C4 → U3 gate 2 input B (pin 5)',
    instruction:
      'Connect an orange wire from row 12 column g (U1 pin 9 / C4, right side) to row 32 column a (U3 pin 5 / 2B input, left side). This feeds the carry-out from the binary adder to the OR detection circuit.',
    connection: {
      from: bb(1, 12, 'g'),
      to: bb(1, 32, 'a'),
      color: 'orange',
      purpose: 'Feed U1 carry-out (C4) to U3 OR gate 2 input B',
    },
  },

  // U3 OR gate 2 output (pin 6, row 33-e) = Y (correction signal)
  // Y goes to: U4 B2, U4 B3, and LED4

  // ===== INTER-CHIP WIRING: U1 Sum → U4 A inputs =====

  // --- U1 S1 (pin 4, row 8-e) → U4 A1 (pin 5, row 40-e) ---
  {
    stepNumber: 32,
    category: 'inter-chip-wiring',
    title: 'U1 S1 → U4 A1 (pin 5)',
    instruction:
      'Connect an orange wire from row 8 column b (U1 pin 4 / S1, left side) to row 40 column a (U4 pin 5 / A1, left side). This passes sum bit 0 from the binary adder to the correction adder.',
    connection: {
      from: bb(1, 8, 'b'),
      to: bb(1, 40, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S1 (sum bit 0) to U4 A1 (correction adder input)',
    },
  },

  // --- U1 S2 (pin 1, row 5-e) → U4 A2 (pin 3, row 38-e) ---
  {
    stepNumber: 33,
    category: 'inter-chip-wiring',
    title: 'U1 S2 → U4 A2 (pin 3)',
    instruction:
      'Connect an orange wire from row 5 column c (U1 pin 1 / S2, left side) to row 38 column a (U4 pin 3 / A2, left side). This passes sum bit 1 to the correction adder.',
    connection: {
      from: bb(1, 5, 'c'),
      to: bb(1, 38, 'a'),
      color: 'orange',
      purpose: 'Feed U1 S2 (sum bit 1) to U4 A2 (correction adder input)',
    },
  },

  // --- U1 S3 (pin 13, row 8-f) → U4 A3 (pin 14, row 38-f) ---
  {
    stepNumber: 34,
    category: 'inter-chip-wiring',
    title: 'U1 S3 → U4 A3 (pin 14)',
    instruction:
      'Connect an orange wire from row 8 column h (U1 pin 13 / S3, right side) to row 38 column j (U4 pin 14 / A3, right side). This passes sum bit 2 to the correction adder.',
    connection: {
      from: bb(1, 8, 'h'),
      to: bb(1, 38, 'j'),
      color: 'orange',
      purpose: 'Feed U1 S3 (sum bit 2) to U4 A3 (correction adder input)',
    },
  },

  // --- U1 S4 (pin 10, row 11-f) → U4 A4 (pin 12, row 40-f) ---
  {
    stepNumber: 35,
    category: 'inter-chip-wiring',
    title: 'U1 S4 → U4 A4 (pin 12)',
    instruction:
      'Connect an orange wire from row 11 column i (U1 pin 10 / S4, right side) to row 40 column j (U4 pin 12 / A4, right side). This passes sum bit 3 (MSB) to the correction adder.',
    connection: {
      from: bb(1, 11, 'i'),
      to: bb(1, 40, 'j'),
      color: 'orange',
      purpose: 'Feed U1 S4 (sum bit 3) to U4 A4 (correction adder input)',
    },
  },

  // ===== INTER-CHIP WIRING: Correction factor to U4 B inputs =====
  // Correction adds 0110 when Y=1, or 0000 when Y=0.
  // B4=0, B3=Y, B2=Y, B1=0

  // --- U4 B1 (pin 6, row 41-e) → GND ---
  {
    stepNumber: 36,
    category: 'inter-chip-wiring',
    title: 'U4 B1 (pin 6) → GND',
    instruction:
      'Connect a black wire from row 41 column a (U4 pin 6 / B1) to the blue (GND) bus strip. Correction bit 0 is always 0.',
    connection: {
      from: bb(1, 41, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Correction factor bit 0 = 0 (B1 tied to GND)',
    },
  },

  // --- Y signal → U4 B2 (pin 2, row 37-e) ---
  {
    stepNumber: 37,
    category: 'inter-chip-wiring',
    title: 'Y signal → U4 B2 (pin 2)',
    instruction:
      'Connect an orange wire from row 33 column b (U3 pin 6 / 2Y = Y signal, left side) to row 37 column a (U4 pin 2 / B2, left side). When Y=1, this adds the "2" component of the correction factor 0110.',
    connection: {
      from: bb(1, 33, 'b'),
      to: bb(1, 37, 'a'),
      color: 'orange',
      purpose: 'Correction factor bit 1 — Y signal to U4 B2 (pin 2)',
    },
    tip: 'Y signal fans out to U4 B2, U4 B3, and LED4. Use different holes in row 33 (U3 pin 6 row) for each.',
  },

  // --- Y signal → U4 B3 (pin 15, row 37-f) ---
  {
    stepNumber: 38,
    category: 'inter-chip-wiring',
    title: 'Y signal → U4 B3 (pin 15)',
    instruction:
      'Connect an orange wire from row 33 column c (U3 pin 6 / 2Y = Y signal, left side) to row 37 column j (U4 pin 15 / B3, right side). When Y=1, this adds the "4" component of the correction factor 0110.',
    connection: {
      from: bb(1, 33, 'c'),
      to: bb(1, 37, 'j'),
      color: 'orange',
      purpose: 'Correction factor bit 2 — Y signal to U4 B3 (pin 15)',
    },
  },

  // --- U4 B4 (pin 11, row 41-f) → GND ---
  {
    stepNumber: 39,
    category: 'inter-chip-wiring',
    title: 'U4 B4 (pin 11) → GND',
    instruction:
      'Connect a black wire from row 41 column j (U4 pin 11 / B4, right side) to the blue (GND) bus strip. Correction bit 3 is always 0.',
    connection: {
      from: bb(1, 41, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Correction factor bit 3 = 0 (B4 tied to GND)',
    },
  },

  // --- U4 C0 (pin 7, row 42-e) → GND ---
  {
    stepNumber: 40,
    category: 'inter-chip-wiring',
    title: 'U4 C0 (pin 7) → GND',
    instruction:
      'Connect a black wire from row 42 column a (U4 pin 7 / C0) to the blue (GND) bus strip. No carry-in to the correction adder.',
    connection: {
      from: bb(1, 42, 'a'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie U4 carry-in to GND (no carry into correction adder)',
    },
  },

  // ===== INTER-CHIP WIRING: Tie unused U2 gate inputs to GND =====
  {
    stepNumber: 41,
    category: 'inter-chip-wiring',
    title: 'Tie U2 unused gate 3 inputs to GND',
    instruction:
      'Connect black wires from row 25 column j (U2 pin 9 / 3A) and row 24 column j (U2 pin 10 / 3B) to the blue (GND) bus strip. This prevents floating inputs on the unused AND gate 3.',
    connection: {
      from: bb(1, 25, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U2 AND gate 3 inputs to GND',
    },
    tip: 'Never leave TTL inputs floating. Unused AND gate inputs should be tied to GND to force the output LOW and prevent noise.',
  },
  {
    stepNumber: 42,
    category: 'inter-chip-wiring',
    title: 'Tie U2 unused gate 3 input B to GND',
    instruction:
      'Connect a black wire from row 24 column j (U2 pin 10 / 3B) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 24, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U2 AND gate 3 input B to GND',
    },
  },
  {
    stepNumber: 43,
    category: 'inter-chip-wiring',
    title: 'Tie U2 unused gate 4 inputs to GND',
    instruction:
      'Connect black wires from row 22 column j (U2 pin 12 / 4A) and row 21 column j (U2 pin 13 / 4B) to the blue (GND) bus strip. This prevents floating inputs on unused AND gate 4.',
    connection: {
      from: bb(1, 22, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U2 AND gate 4 input A to GND',
    },
  },
  {
    stepNumber: 44,
    category: 'inter-chip-wiring',
    title: 'Tie U2 unused gate 4 input B to GND',
    instruction:
      'Connect a black wire from row 21 column j (U2 pin 13 / 4B) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 21, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U2 AND gate 4 input B to GND',
    },
  },

  // Tie unused U3 gate inputs to GND
  {
    stepNumber: 45,
    category: 'inter-chip-wiring',
    title: 'Tie U3 unused gate 3 inputs to GND',
    instruction:
      'Connect black wires from row 33 column j (U3 pin 9 / 3A) and row 32 column j (U3 pin 10 / 3B) to the blue (GND) bus strip. This prevents floating inputs on the unused OR gate 3.',
    connection: {
      from: bb(1, 33, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U3 OR gate 3 input A to GND',
    },
  },
  {
    stepNumber: 46,
    category: 'inter-chip-wiring',
    title: 'Tie U3 unused gate 3 input B to GND',
    instruction:
      'Connect a black wire from row 32 column j (U3 pin 10 / 3B) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 32, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U3 OR gate 3 input B to GND',
    },
  },
  {
    stepNumber: 47,
    category: 'inter-chip-wiring',
    title: 'Tie U3 unused gate 4 inputs to GND',
    instruction:
      'Connect black wires from row 30 column j (U3 pin 12 / 4A) and row 29 column j (U3 pin 13 / 4B) to the blue (GND) bus strip. This prevents floating inputs on the unused OR gate 4.',
    connection: {
      from: bb(1, 30, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U3 OR gate 4 input A to GND',
    },
  },
  {
    stepNumber: 48,
    category: 'inter-chip-wiring',
    title: 'Tie U3 unused gate 4 input B to GND',
    instruction:
      'Connect a black wire from row 29 column j (U3 pin 13 / 4B) to the blue (GND) bus strip.',
    connection: {
      from: bb(1, 29, 'j'),
      to: bus('top', 'ground'),
      color: 'black',
      purpose: 'Tie unused U3 OR gate 4 input B to GND',
    },
  },

  // ===== OUTPUT WIRING: U4 corrected sum → LEDs =====
  {
    stepNumber: 49,
    category: 'output-wiring',
    title: 'U4 S1 (pin 4) → LED0',
    instruction:
      'Connect a blue wire from row 39 column a (U4 pin 4 / S1) to LED0 input hole. LED0 shows corrected BCD sum bit 0 (weight 1).',
    connection: {
      from: bb(1, 39, 'a'),
      to: led('LED0'),
      color: 'blue',
      purpose: 'Corrected BCD sum bit 0 — U4 S1 (pin 4) to LED0',
    },
  },
  {
    stepNumber: 50,
    category: 'output-wiring',
    title: 'U4 S2 (pin 1) → LED1',
    instruction:
      'Connect a blue wire from row 36 column a (U4 pin 1 / S2) to LED1 input hole. LED1 shows corrected BCD sum bit 1 (weight 2).',
    connection: {
      from: bb(1, 36, 'a'),
      to: led('LED1'),
      color: 'blue',
      purpose: 'Corrected BCD sum bit 1 — U4 S2 (pin 1) to LED1',
    },
  },
  {
    stepNumber: 51,
    category: 'output-wiring',
    title: 'U4 S3 (pin 13) → LED2',
    instruction:
      'Connect a blue wire from row 39 column j (U4 pin 13 / S3) to LED2 input hole. LED2 shows corrected BCD sum bit 2 (weight 4).',
    connection: {
      from: bb(1, 39, 'j'),
      to: led('LED2'),
      color: 'blue',
      purpose: 'Corrected BCD sum bit 2 — U4 S3 (pin 13) to LED2',
    },
  },
  {
    stepNumber: 52,
    category: 'output-wiring',
    title: 'U4 S4 (pin 10) → LED3',
    instruction:
      'Connect a blue wire from row 42 column j (U4 pin 10 / S4) to LED3 input hole. LED3 shows corrected BCD sum bit 3 (weight 8).',
    connection: {
      from: bb(1, 42, 'j'),
      to: led('LED3'),
      color: 'blue',
      purpose: 'Corrected BCD sum bit 3 — U4 S4 (pin 10) to LED3',
    },
  },
  {
    stepNumber: 53,
    category: 'output-wiring',
    title: 'Y signal → LED4 (BCD carry)',
    instruction:
      'Connect a white wire from row 33 column d (U3 pin 6 / 2Y = Y correction signal, left side) to LED4 input hole. LED4 shows the BCD carry-out (1 when the sum exceeds 9).',
    connection: {
      from: bb(1, 33, 'd'),
      to: led('LED4'),
      color: 'white',
      purpose: 'BCD carry out — Y correction signal to LED4',
    },
    tip: 'LED4 ON means the sum exceeded 9 and correction was applied. The corrected ones digit appears on LED0-LED3, and LED4 represents the tens digit carry.',
  },
];

// ---------------------------------------------------------------
// Part 2 — Test Cases (10 valid BCD test cases, digits 0-9 only)
// ---------------------------------------------------------------

function makePart2Test(
  a: number,
  b: number,
  description: string,
): TestCase {
  const decimalSum = a + b;
  const onesDigit = decimalSum % 10;
  const carry = decimalSum >= 10 ? 1 : 0;

  const bit = (v: number, n: number): 0 | 1 => ((v >> n) & 1) as 0 | 1;

  return {
    inputs: {
      S0: bit(a, 0), S1: bit(a, 1), S2: bit(a, 2), S3: bit(a, 3),
      S4: bit(b, 0), S5: bit(b, 1), S6: bit(b, 2), S7: bit(b, 3),
    },
    expectedOutputs: {
      LED0: bit(onesDigit, 0),
      LED1: bit(onesDigit, 1),
      LED2: bit(onesDigit, 2),
      LED3: bit(onesDigit, 3),
      LED4: carry as 0 | 1,
      LED5: 0, LED6: 0, LED7: 0,
    },
    description,
  };
}

const part2Tests: TestCase[] = [
  makePart2Test(0, 0, 'BCD: 0 + 0 = 00 (no correction needed)'),
  makePart2Test(3, 4, 'BCD: 3 + 4 = 07 (sum 7, no correction)'),
  makePart2Test(5, 4, 'BCD: 5 + 4 = 09 (sum 9, max no-correction case)'),
  makePart2Test(5, 5, 'BCD: 5 + 5 = 10 (sum 10, correction +6 applied, carry=1)'),
  makePart2Test(7, 5, 'BCD: 7 + 5 = 12 (sum 12, correction applied, carry=1)'),
  makePart2Test(8, 6, 'BCD: 8 + 6 = 14 (sum 14, correction applied, carry=1)'),
  makePart2Test(9, 1, 'BCD: 9 + 1 = 10 (sum 10, correction applied, carry=1)'),
  makePart2Test(9, 9, 'BCD: 9 + 9 = 18 (sum 18, correction applied, carry=1)'),
  makePart2Test(6, 7, 'BCD: 6 + 7 = 13 (sum 13, correction applied, carry=1)'),
  makePart2Test(2, 3, 'BCD: 2 + 3 = 05 (sum 5, no correction)'),
];

// ===============================================================
// Assemble the Experiment
// ===============================================================

const part1: ExperimentPart = {
  id: 'exp3-part1',
  title: 'Part 1: 4-Bit Binary Addition',
  description:
    'Build a 4-bit binary adder using a single 74LS283 IC. Switches S0-S3 set operand A (0-15) and switches S4-S7 set operand B (0-15). The binary sum (0-30) appears on LED0-LED3 (4-bit result) and LED4 (carry out). This demonstrates pure binary addition without BCD correction.',
  icsRequired: ['74LS283'],
  placements: part1Placements,
  steps: part1Steps,
  testCases: part1Tests,
};

const part2: ExperimentPart = {
  id: 'exp3-part2',
  title: 'Part 2: BCD Adder with Correction',
  description:
    'Build a complete single-digit BCD adder using two 74LS283 adders, a 74LS08 (AND gates), and a 74LS32 (OR gates). The first adder performs binary addition. A detection circuit (AND + OR gates) determines whether the sum exceeds 9. If so, a correction factor of 6 (0110) is added by the second adder, producing a valid BCD ones digit on LED0-LED3 and a BCD carry on LED4. Only valid BCD inputs (0-9 per digit) should be used.',
  icsRequired: ['74LS283', '74LS08', '74LS32', '74LS283'],
  placements: part2Placements,
  steps: part2Steps,
  testCases: part2Tests,
};

export const EXPERIMENT_3: Experiment = {
  id: 'experiment-3',
  title: 'Experiment #3: 4-Bit Binary Addition & BCD Adder',
  course: 'IDL-800A Digital Logic Lab',
  description:
    'This experiment explores binary arithmetic at the hardware level. Part 1 builds a simple 4-bit binary adder using one 74LS283 IC. Part 2 extends the circuit into a full BCD (Binary-Coded Decimal) adder by adding detection logic (74LS08 AND gates, 74LS32 OR gates) and a correction adder (second 74LS283) that adds 6 whenever the binary sum exceeds the valid BCD range of 0-9.',
  parts: [part1, part2],
};

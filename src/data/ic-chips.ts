// ============================================
// IDL-800a Digital Lab Station — IC Knowledge Base
// ============================================
//
// Pin data cross-referenced against TI datasheets and research files:
//   - research/ic-74ls283-full-adder.md
//   - research/ic-74ls08-and-gate.md
//   - research/ic-74ls32-or-gate.md
//   - research/ic-common-74ls-series.md
//
// WARNING: Pin numbers are used to generate physical wiring instructions.
// Any error here produces wrong wires on a real breadboard. Verify against
// datasheets before modifying.

import type { ICChip } from '@/types';

// ---------------------------------------------------------------------------
// 74LS283 — 4-Bit Binary Full Adder (16-pin DIP)
// ---------------------------------------------------------------------------
//
// Pin layout gotcha: Sum output pins are NOT sequential.
//   S1=pin 4, S2=pin 1, S3=pin 13, S4=pin 10
// Bits 1-2 live on the left side (pins 1-7), bits 3-4 on the right (pins 9-16).

const ic74LS283: ICChip = {
  id: '74LS283',
  name: '4-Bit Binary Full Adder',
  package: 'DIP-16',
  pinCount: 16,
  vccPin: 16,
  gndPin: 8,
  family: '74LS',
  category: 'adder',
  description:
    'Adds two 4-bit binary numbers (A + B) plus a carry input (C0), producing a 4-bit sum (S1-S4) and carry output (C4). Uses internal carry lookahead for fast operation (~10 ns carry propagation).',
  warnings: [
    'Sum output pins are NOT sequential: S1=pin 4, S2=pin 1, S3=pin 13, S4=pin 10. Double-check every sum wire.',
    'A and B input pins are also non-sequential. Bits 1-2 are on the left side, bits 3-4 on the right side.',
    'Do NOT confuse with 74LS83A — same function but VCC/GND pins are swapped (74LS83A: VCC=pin 5, GND=pin 12).',
    'Carry input C0 (pin 7) must be connected — tie to GND if no incoming carry.',
  ],
  pins: [
    // Left side (pins 1-8, top to bottom)
    { number: 1,  name: 'S2',  direction: 'output', description: 'Sum output, bit 2 (weight 2)',         group: 'Bit 2' },
    { number: 2,  name: 'B2',  direction: 'input',  description: 'Operand B, bit 2 (weight 2)',          group: 'Bit 2' },
    { number: 3,  name: 'A2',  direction: 'input',  description: 'Operand A, bit 2 (weight 2)',          group: 'Bit 2' },
    { number: 4,  name: 'S1',  direction: 'output', description: 'Sum output, bit 1 (weight 1) — LSB',  group: 'Bit 1' },
    { number: 5,  name: 'A1',  direction: 'input',  description: 'Operand A, bit 1 (weight 1) — LSB',   group: 'Bit 1' },
    { number: 6,  name: 'B1',  direction: 'input',  description: 'Operand B, bit 1 (weight 1) — LSB',   group: 'Bit 1' },
    { number: 7,  name: 'C0',  direction: 'input',  description: 'Carry input (from previous stage or tie to GND)', group: 'Carry' },
    { number: 8,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                          group: 'Power' },
    // Right side (pins 9-16, bottom to top)
    { number: 9,  name: 'C4',  direction: 'output', description: 'Carry output (to next stage or overflow indicator)', group: 'Carry' },
    { number: 10, name: 'S4',  direction: 'output', description: 'Sum output, bit 4 (weight 8) — MSB',  group: 'Bit 4' },
    { number: 11, name: 'B4',  direction: 'input',  description: 'Operand B, bit 4 (weight 8) — MSB',   group: 'Bit 4' },
    { number: 12, name: 'A4',  direction: 'input',  description: 'Operand A, bit 4 (weight 8) — MSB',   group: 'Bit 4' },
    { number: 13, name: 'S3',  direction: 'output', description: 'Sum output, bit 3 (weight 4)',         group: 'Bit 3' },
    { number: 14, name: 'A3',  direction: 'input',  description: 'Operand A, bit 3 (weight 4)',          group: 'Bit 3' },
    { number: 15, name: 'B3',  direction: 'input',  description: 'Operand B, bit 3 (weight 4)',          group: 'Bit 3' },
    { number: 16, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)',        group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS08 — Quad 2-Input AND Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// Standard 14-pin quad-gate pinout. Output HIGH only when BOTH inputs HIGH.
// Gate pattern: left side pins flow A,B,Y sequentially; right side is mirrored.
//   Gate 1: pins 1,2 -> 3    Gate 2: pins 4,5 -> 6
//   Gate 3: pins 9,10 -> 8   Gate 4: pins 12,13 -> 11

const ic74LS08: ICChip = {
  id: '74LS08',
  name: 'Quad 2-Input AND Gate',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'and-gate',
  description:
    'Contains four independent 2-input AND gates. Output is HIGH only when both inputs are HIGH. Y = A AND B.',
  pins: [
    // Left side (pins 1-7)
    { number: 1,  name: '1A',  direction: 'input',  description: 'Gate 1, Input A',             group: 'Gate 1' },
    { number: 2,  name: '1B',  direction: 'input',  description: 'Gate 1, Input B',             group: 'Gate 1' },
    { number: 3,  name: '1Y',  direction: 'output', description: 'Gate 1, Output (1A AND 1B)',  group: 'Gate 1' },
    { number: 4,  name: '2A',  direction: 'input',  description: 'Gate 2, Input A',             group: 'Gate 2' },
    { number: 5,  name: '2B',  direction: 'input',  description: 'Gate 2, Input B',             group: 'Gate 2' },
    { number: 6,  name: '2Y',  direction: 'output', description: 'Gate 2, Output (2A AND 2B)',  group: 'Gate 2' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                 group: 'Power' },
    // Right side (pins 8-14)
    { number: 8,  name: '3Y',  direction: 'output', description: 'Gate 3, Output (3A AND 3B)',  group: 'Gate 3' },
    { number: 9,  name: '3A',  direction: 'input',  description: 'Gate 3, Input A',             group: 'Gate 3' },
    { number: 10, name: '3B',  direction: 'input',  description: 'Gate 3, Input B',             group: 'Gate 3' },
    { number: 11, name: '4Y',  direction: 'output', description: 'Gate 4, Output (4A AND 4B)',  group: 'Gate 4' },
    { number: 12, name: '4A',  direction: 'input',  description: 'Gate 4, Input A',             group: 'Gate 4' },
    { number: 13, name: '4B',  direction: 'input',  description: 'Gate 4, Input B',             group: 'Gate 4' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS32 — Quad 2-Input OR Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// Same standard 14-pin quad-gate pinout as 74LS08/00/86.
// Output HIGH when either or both inputs are HIGH. Y = A OR B.
//   Gate 1: pins 1,2 -> 3    Gate 2: pins 4,5 -> 6
//   Gate 3: pins 9,10 -> 8   Gate 4: pins 12,13 -> 11

const ic74LS32: ICChip = {
  id: '74LS32',
  name: 'Quad 2-Input OR Gate',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'or-gate',
  description:
    'Contains four independent 2-input OR gates. Output is HIGH when either or both inputs are HIGH. Y = A OR B.',
  pins: [
    // Left side (pins 1-7)
    { number: 1,  name: '1A',  direction: 'input',  description: 'Gate 1, Input A',           group: 'Gate 1' },
    { number: 2,  name: '1B',  direction: 'input',  description: 'Gate 1, Input B',           group: 'Gate 1' },
    { number: 3,  name: '1Y',  direction: 'output', description: 'Gate 1, Output (1A OR 1B)', group: 'Gate 1' },
    { number: 4,  name: '2A',  direction: 'input',  description: 'Gate 2, Input A',           group: 'Gate 2' },
    { number: 5,  name: '2B',  direction: 'input',  description: 'Gate 2, Input B',           group: 'Gate 2' },
    { number: 6,  name: '2Y',  direction: 'output', description: 'Gate 2, Output (2A OR 2B)', group: 'Gate 2' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',               group: 'Power' },
    // Right side (pins 8-14)
    { number: 8,  name: '3Y',  direction: 'output', description: 'Gate 3, Output (3A OR 3B)', group: 'Gate 3' },
    { number: 9,  name: '3A',  direction: 'input',  description: 'Gate 3, Input A',           group: 'Gate 3' },
    { number: 10, name: '3B',  direction: 'input',  description: 'Gate 3, Input B',           group: 'Gate 3' },
    { number: 11, name: '4Y',  direction: 'output', description: 'Gate 4, Output (4A OR 4B)', group: 'Gate 4' },
    { number: 12, name: '4A',  direction: 'input',  description: 'Gate 4, Input A',           group: 'Gate 4' },
    { number: 13, name: '4B',  direction: 'input',  description: 'Gate 4, Input B',           group: 'Gate 4' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS04 — Hex Inverter / NOT Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// Six independent single-input inverters. Y = NOT A.
// Left side: input-output pairs are adjacent (1-2, 3-4, 5-6).
// Right side: output-input pairs are reversed (8-9, 10-11, 12-13) due to
// counter-clockwise pin numbering wrapping around the bottom.
//   Inv 1: pin 1 -> 2    Inv 2: pin 3 -> 4    Inv 3: pin 5 -> 6
//   Inv 4: pin 9 -> 8    Inv 5: pin 11 -> 10  Inv 6: pin 13 -> 12

const ic74LS04: ICChip = {
  id: '74LS04',
  name: 'Hex Inverter',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'not-gate',
  description:
    'Contains six independent single-input inverters (NOT gates). Output is the logical complement of the input. Y = NOT A.',
  pins: [
    // Left side (pins 1-7)
    { number: 1,  name: '1A',  direction: 'input',  description: 'Inverter 1, Input',           group: 'Inverter 1' },
    { number: 2,  name: '1Y',  direction: 'output', description: 'Inverter 1, Output (NOT 1A)', group: 'Inverter 1' },
    { number: 3,  name: '2A',  direction: 'input',  description: 'Inverter 2, Input',           group: 'Inverter 2' },
    { number: 4,  name: '2Y',  direction: 'output', description: 'Inverter 2, Output (NOT 2A)', group: 'Inverter 2' },
    { number: 5,  name: '3A',  direction: 'input',  description: 'Inverter 3, Input',           group: 'Inverter 3' },
    { number: 6,  name: '3Y',  direction: 'output', description: 'Inverter 3, Output (NOT 3A)', group: 'Inverter 3' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                 group: 'Power' },
    // Right side (pins 8-14)
    { number: 8,  name: '4Y',  direction: 'output', description: 'Inverter 4, Output (NOT 4A)', group: 'Inverter 4' },
    { number: 9,  name: '4A',  direction: 'input',  description: 'Inverter 4, Input',           group: 'Inverter 4' },
    { number: 10, name: '5Y',  direction: 'output', description: 'Inverter 5, Output (NOT 5A)', group: 'Inverter 5' },
    { number: 11, name: '5A',  direction: 'input',  description: 'Inverter 5, Input',           group: 'Inverter 5' },
    { number: 12, name: '6Y',  direction: 'output', description: 'Inverter 6, Output (NOT 6A)', group: 'Inverter 6' },
    { number: 13, name: '6A',  direction: 'input',  description: 'Inverter 6, Input',           group: 'Inverter 6' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS86 — Quad 2-Input XOR Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// Same standard 14-pin quad-gate pinout as 74LS08/32/00.
// Output HIGH when inputs differ. Y = A XOR B.
//   Gate 1: pins 1,2 -> 3    Gate 2: pins 4,5 -> 6
//   Gate 3: pins 9,10 -> 8   Gate 4: pins 12,13 -> 11

const ic74LS86: ICChip = {
  id: '74LS86',
  name: 'Quad 2-Input XOR Gate',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'xor-gate',
  description:
    'Contains four independent 2-input Exclusive-OR gates. Output is HIGH when inputs differ. Y = A XOR B. Useful for parity, controlled inversion, and half-adder sum bits.',
  pins: [
    // Left side (pins 1-7)
    { number: 1,  name: '1A',  direction: 'input',  description: 'Gate 1, Input A',             group: 'Gate 1' },
    { number: 2,  name: '1B',  direction: 'input',  description: 'Gate 1, Input B',             group: 'Gate 1' },
    { number: 3,  name: '1Y',  direction: 'output', description: 'Gate 1, Output (1A XOR 1B)',  group: 'Gate 1' },
    { number: 4,  name: '2A',  direction: 'input',  description: 'Gate 2, Input A',             group: 'Gate 2' },
    { number: 5,  name: '2B',  direction: 'input',  description: 'Gate 2, Input B',             group: 'Gate 2' },
    { number: 6,  name: '2Y',  direction: 'output', description: 'Gate 2, Output (2A XOR 2B)',  group: 'Gate 2' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                 group: 'Power' },
    // Right side (pins 8-14)
    { number: 8,  name: '3Y',  direction: 'output', description: 'Gate 3, Output (3A XOR 3B)',  group: 'Gate 3' },
    { number: 9,  name: '3A',  direction: 'input',  description: 'Gate 3, Input A',             group: 'Gate 3' },
    { number: 10, name: '3B',  direction: 'input',  description: 'Gate 3, Input B',             group: 'Gate 3' },
    { number: 11, name: '4Y',  direction: 'output', description: 'Gate 4, Output (4A XOR 4B)',  group: 'Gate 4' },
    { number: 12, name: '4A',  direction: 'input',  description: 'Gate 4, Input A',             group: 'Gate 4' },
    { number: 13, name: '4B',  direction: 'input',  description: 'Gate 4, Input B',             group: 'Gate 4' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS00 — Quad 2-Input NAND Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// Same standard 14-pin quad-gate pinout as 74LS08/32/86.
// Output LOW only when BOTH inputs are HIGH. Y = NOT(A AND B).
//   Gate 1: pins 1,2 -> 3    Gate 2: pins 4,5 -> 6
//   Gate 3: pins 9,10 -> 8   Gate 4: pins 12,13 -> 11

const ic74LS00: ICChip = {
  id: '74LS00',
  name: 'Quad 2-Input NAND Gate',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'nand-gate',
  description:
    'Contains four independent 2-input NAND gates. Output is LOW only when both inputs are HIGH. Y = NOT(A AND B). Universal gate — can implement any logic function.',
  pins: [
    // Left side (pins 1-7)
    { number: 1,  name: '1A',  direction: 'input',  description: 'Gate 1, Input A',              group: 'Gate 1' },
    { number: 2,  name: '1B',  direction: 'input',  description: 'Gate 1, Input B',              group: 'Gate 1' },
    { number: 3,  name: '1Y',  direction: 'output', description: 'Gate 1, Output (NOT(1A AND 1B))', group: 'Gate 1' },
    { number: 4,  name: '2A',  direction: 'input',  description: 'Gate 2, Input A',              group: 'Gate 2' },
    { number: 5,  name: '2B',  direction: 'input',  description: 'Gate 2, Input B',              group: 'Gate 2' },
    { number: 6,  name: '2Y',  direction: 'output', description: 'Gate 2, Output (NOT(2A AND 2B))', group: 'Gate 2' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                  group: 'Power' },
    // Right side (pins 8-14)
    { number: 8,  name: '3Y',  direction: 'output', description: 'Gate 3, Output (NOT(3A AND 3B))', group: 'Gate 3' },
    { number: 9,  name: '3A',  direction: 'input',  description: 'Gate 3, Input A',              group: 'Gate 3' },
    { number: 10, name: '3B',  direction: 'input',  description: 'Gate 3, Input B',              group: 'Gate 3' },
    { number: 11, name: '4Y',  direction: 'output', description: 'Gate 4, Output (NOT(4A AND 4B))', group: 'Gate 4' },
    { number: 12, name: '4A',  direction: 'input',  description: 'Gate 4, Input A',              group: 'Gate 4' },
    { number: 13, name: '4B',  direction: 'input',  description: 'Gate 4, Input B',              group: 'Gate 4' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// 74LS02 — Quad 2-Input NOR Gate (14-pin DIP)
// ---------------------------------------------------------------------------
//
// WARNING: DIFFERENT pinout from 74LS00/08/32/86!
// Output pins are 1, 4, 10, 13 (NOT the standard 3, 6, 8, 11).
// The output comes FIRST in each gate's pin group — this is the single
// most common wiring mistake in digital logic labs.
//   Gate 1: pins 2,3 -> 1    Gate 2: pins 5,6 -> 4
//   Gate 3: pins 8,9 -> 10   Gate 4: pins 11,12 -> 13

const ic74LS02: ICChip = {
  id: '74LS02',
  name: 'Quad 2-Input NOR Gate',
  package: 'DIP-14',
  pinCount: 14,
  vccPin: 14,
  gndPin: 7,
  family: '74LS',
  category: 'nor-gate',
  description:
    'Contains four independent 2-input NOR gates. Output is HIGH only when both inputs are LOW. Y = NOT(A OR B). Universal gate — can implement any logic function.',
  warnings: [
    'REVERSED PINOUT compared to 74LS00/08/32/86! Output pins are 1, 4, 10, 13 (not 3, 6, 8, 11). The output comes FIRST in each gate group.',
    'This is the most common wiring mistake in digital logic labs — students assume the same pin pattern as AND/OR/NAND/XOR gates.',
  ],
  pins: [
    // Left side (pins 1-7) — NOTE: output is FIRST (pin 1), then inputs (pins 2,3)
    { number: 1,  name: '1Y',  direction: 'output', description: 'Gate 1, Output (NOT(1A OR 1B))', group: 'Gate 1' },
    { number: 2,  name: '1A',  direction: 'input',  description: 'Gate 1, Input A',               group: 'Gate 1' },
    { number: 3,  name: '1B',  direction: 'input',  description: 'Gate 1, Input B',               group: 'Gate 1' },
    { number: 4,  name: '2Y',  direction: 'output', description: 'Gate 2, Output (NOT(2A OR 2B))', group: 'Gate 2' },
    { number: 5,  name: '2A',  direction: 'input',  description: 'Gate 2, Input A',               group: 'Gate 2' },
    { number: 6,  name: '2B',  direction: 'input',  description: 'Gate 2, Input B',               group: 'Gate 2' },
    { number: 7,  name: 'GND', direction: 'ground', description: 'Ground (0V)',                   group: 'Power' },
    // Right side (pins 8-14) — NOTE: inputs first (pins 8,9), then output (pin 10)
    { number: 8,  name: '3A',  direction: 'input',  description: 'Gate 3, Input A',               group: 'Gate 3' },
    { number: 9,  name: '3B',  direction: 'input',  description: 'Gate 3, Input B',               group: 'Gate 3' },
    { number: 10, name: '3Y',  direction: 'output', description: 'Gate 3, Output (NOT(3A OR 3B))', group: 'Gate 3' },
    { number: 11, name: '4A',  direction: 'input',  description: 'Gate 4, Input A',               group: 'Gate 4' },
    { number: 12, name: '4B',  direction: 'input',  description: 'Gate 4, Input B',               group: 'Gate 4' },
    { number: 13, name: '4Y',  direction: 'output', description: 'Gate 4, Output (NOT(4A OR 4B))', group: 'Gate 4' },
    { number: 14, name: 'VCC', direction: 'power',  description: 'Positive supply voltage (+5V)', group: 'Power' },
  ],
};

// ---------------------------------------------------------------------------
// Exported registry
// ---------------------------------------------------------------------------

/** All known IC chips, keyed by chip ID (e.g. "74LS283") */
export const IC_CHIPS: Record<string, ICChip> = {
  '74LS283': ic74LS283,
  '74LS08':  ic74LS08,
  '74LS32':  ic74LS32,
  '74LS04':  ic74LS04,
  '74LS86':  ic74LS86,
  '74LS00':  ic74LS00,
  '74LS02':  ic74LS02,
};

/**
 * Look up an IC chip definition by its ID.
 * Returns undefined if the chip is not in the knowledge base.
 */
export function getChip(id: string): ICChip | undefined {
  return IC_CHIPS[id];
}

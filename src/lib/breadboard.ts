import type {
  BreadboardHole,
  BreadboardColumn,
  BreadboardSection,
  ICPlacement,
  ConnectionPoint,
  BusStripPosition,
} from '@/types';

// ============================================
// Breadboard Coordinate Utilities
// ============================================

const LEFT_COLUMNS: BreadboardColumn[] = ['a', 'b', 'c', 'd', 'e'];
const RIGHT_COLUMNS: BreadboardColumn[] = ['f', 'g', 'h', 'i', 'j'];

/**
 * Format a breadboard hole as a human-readable string.
 * Example: "Row 5, Column e (Section 1)" or shorthand "5-e"
 */
export function formatHole(hole: BreadboardHole, verbose = false): string {
  if (verbose) {
    return `Row ${hole.row}, Column ${hole.column} (Section ${hole.section})`;
  }
  return `${hole.row}-${hole.column}`;
}

/**
 * Format any ConnectionPoint as a human-readable string.
 */
export function formatConnection(point: ConnectionPoint): string {
  switch (point.type) {
    case 'breadboard':
      return `breadboard hole ${formatHole(point.location)}`;
    case 'bus':
      return `${point.location.position} ${point.location.rail === 'power' ? 'red (+5V)' : 'blue (GND)'} bus strip`;
    case 'switch':
      return `data switch ${point.id}`;
    case 'led':
      return `${point.id} indicator`;
    case 'power':
      return `${point.terminal} power terminal`;
    case 'ic-pin':
      return `${point.chipId} Pin ${point.pin} (${point.description})`;
  }
}

/**
 * Given an IC placement and a pin number, return the breadboard hole
 * where that pin sits.
 *
 * DIP IC pin numbering (counterclockwise from pin 1):
 * - Pin 1 goes in column e, at pin1Row
 * - Pins 1..N/2 go down the left side (column e), rows pin1Row to pin1Row+(N/2-1)
 * - Pins (N/2+1)..N go up the right side (column f), from bottom to top
 */
export function getPinHole(placement: ICPlacement, pin: number, pinCount: number): BreadboardHole {
  const halfPins = pinCount / 2;

  if (pin >= 1 && pin <= halfPins) {
    // Left side: pins go down from pin1Row
    return {
      section: placement.section,
      row: placement.pin1Row + (pin - 1),
      column: 'e' as BreadboardColumn,
    };
  } else {
    // Right side: pins go up from bottom
    // Pin (halfPins+1) is at the bottom row (pin1Row + halfPins - 1), column f
    // Pin N is at the top row (pin1Row), column f
    const rightIndex = pin - halfPins - 1; // 0-based from bottom
    return {
      section: placement.section,
      row: placement.pin1Row + halfPins - 1 - rightIndex,
      column: 'f' as BreadboardColumn,
    };
  }
}

/**
 * Get all available connection holes for a given IC pin.
 * When an IC pin sits in column e, holes a-d in that row are available.
 * When in column f, holes g-j are available.
 */
export function getAvailableHoles(placement: ICPlacement, pin: number, pinCount: number): BreadboardHole[] {
  const pinHole = getPinHole(placement, pin, pinCount);
  const availableCols = pinHole.column === 'e'
    ? ['a', 'b', 'c', 'd'] as BreadboardColumn[]
    : ['g', 'h', 'i', 'j'] as BreadboardColumn[];

  return availableCols.map(col => ({
    section: pinHole.section,
    row: pinHole.row,
    column: col,
  }));
}

/**
 * Create a ConnectionPoint for an IC pin, with auto-calculated breadboard location.
 */
export function icPinPoint(
  placement: ICPlacement,
  pin: number,
  pinCount: number,
  description: string,
): ConnectionPoint {
  return {
    type: 'ic-pin',
    chipId: placement.label,
    pin,
    description,
  };
}

/**
 * Create a breadboard ConnectionPoint for wiring TO an IC pin
 * (uses an available hole in the same row, not the pin's own hole).
 */
export function wireToPin(
  placement: ICPlacement,
  pin: number,
  pinCount: number,
): ConnectionPoint {
  const available = getAvailableHoles(placement, pin, pinCount);
  // Use the first available hole (closest to the IC)
  return {
    type: 'breadboard',
    location: available[0],
  };
}

/**
 * Create a bus strip ConnectionPoint.
 */
export function busPoint(position: BusStripPosition, rail: 'power' | 'ground'): ConnectionPoint {
  return {
    type: 'bus',
    location: { position, rail },
  };
}

/**
 * Create a switch ConnectionPoint.
 */
export function switchPoint(id: `S${number}`): ConnectionPoint {
  return {
    type: 'switch',
    id: id as ConnectionPoint & { type: 'switch' } extends { id: infer T } ? T : never,
  } as ConnectionPoint;
}

/**
 * Create an LED ConnectionPoint.
 */
export function ledPoint(id: `LED${number}`): ConnectionPoint {
  return {
    type: 'led',
    id: id as ConnectionPoint & { type: 'led' } extends { id: infer T } ? T : never,
  } as ConnectionPoint;
}

/**
 * Determine which bus strip pair is closest to a given row in a section.
 */
export function nearestBusStrip(section: BreadboardSection, row: number): BusStripPosition {
  if (section === 1) {
    return row <= 32 ? 'top' : 'middle';
  }
  return row <= 32 ? 'middle' : 'bottom';
}

/**
 * Generate a human-readable description of where an IC is placed.
 */
export function describeICPlacement(placement: ICPlacement, pinCount: number): string {
  const lastLeftPin = pinCount / 2;
  const lastRow = placement.pin1Row + lastLeftPin - 1;
  return `${placement.label} placed straddling the center gap, Pin 1 at row ${placement.pin1Row} column e through Pin ${lastLeftPin} at row ${lastRow} column e (left side), Pin ${lastLeftPin + 1} at row ${lastRow} column f through Pin ${pinCount} at row ${placement.pin1Row} column f (right side)`;
}

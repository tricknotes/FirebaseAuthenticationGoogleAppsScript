// Ref: https://sites.google.com/site/nnillixxsource/Ferreira/GSUnit
declare module 'GSUnit' {
  namespace GSUnit {
    export function assert(value: unknown): void;
    export function assert(comment: string, value: unknown): void;

    export function assertArrayEquals(expected: unknown[], actual: unknown[]): void;
    export function assertArrayEquals(comment: string, expected: unknown[], actual: unknown[]): void;

    export function assertArrayEqualsIgnoringOrder(expected: unknown[], actual: []): void;
    export function assertArrayEqualsIgnoringOrder(comment: string, expected: unknown[], actual: []): void;

    export function assertContains(value: unknown, collection: unknown[]): void;
    export function assertContains(comment: string, value: unknown, collection: unknown[]): void;

    export function assertEquals(expected: unknown, actual: unknown): void;
    export function assertEquals(comment: string, expected: unknown, actual: unknown): void;

    export function assertEvaluatesToFalse(value: unknown): void;
    export function assertEvaluatesToFalse(comment: string, value: unknown): void;

    export function assertEvaluatesToTrue(value: unknown): void;
    export function assertEvaluatesToTrue(comment: string, value: unknown): void;

    export function assertFalse(value: unknown): void;
    export function assertFalse(comment: string, value: unknown): void;

    export function assertHashEquals(expected: object, actual: object): void;
    export function assertHashEquals(comment: string, expected: object, actual: object): void;

    export function assertNaN(value: unknown): void;
    export function assertNaN(comment: string, value: unknown): void;

    export function assertNotEquals(left: unknown, right: unknown): void;
    export function assertNotEquals(comment: string, left: unknown, right: unknown): void;

    export function assertNotNaN(value: unknown): void;
    export function assertNotNaN(comment: string, value: unknown): void;

    export function assertNotNull(value: unknown): void;
    export function assertNotNull(comment: string, value: unknown): void;

    export function assertNotUndefined(value: unknown): void;
    export function assertNotUndefined(comment: string, value: unknown): void;

    export function assertNull(value: unknown): void;
    export function assertNull(comment: string, value: unknown): void;

    export function assertObjectEquals(expected: object, actual: object): void;
    export function assertObjectEquals(comment: string, expected: object, actual: object): void;

    export function assertRoughlyEquals(expected: object, actual: object): void;
    export function assertRoughlyEquals(comment: string, expected: object, actual: object): void;

    export function assertTrue(value: unknown): void;
    export function assertTrue(comment: string, value: unknown): void;

    export function assertUndefined(value: unknown): void;
    export function assertUndefined(comment: string, value: unknown): void;

    export function fail(failureMessage: string): void;
  }

  export default GSUnit;
}
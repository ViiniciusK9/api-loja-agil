import { InvalidIdError } from './invalid-id.error.js';
import { UniqueId } from './unique-id.value-object.js';

const UUID_V7 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('UniqueId', () => {
  describe('create', () => {
    it('should generate a UUID v7', () => {
      const id = UniqueId.create();

      expect(id.toString()).toMatch(UUID_V7);
    });

    it('should generate a different value on each call', () => {
      const first = UniqueId.create();
      const second = UniqueId.create();

      expect(first.equals(second)).toBe(false);
    });

    it('should generate values that sort by creation time', async () => {
      const older = UniqueId.create();
      await new Promise((resolve) => setTimeout(resolve, 2));

      const newer = UniqueId.create();

      expect(older.toString() < newer.toString()).toBe(true);
    });
  });

  describe('from', () => {
    it('should restore an id from a valid UUID', () => {
      const original = UniqueId.create();

      const restored = UniqueId.from(original.toString());

      expect(restored.equals(original)).toBe(true);
    });

    it('should normalize the value to lowercase', () => {
      const id = UniqueId.from('01A21CD6-7E2F-75EB-A86E-A267EFF5E4F9');

      expect(id.toString()).toBe('01a21cd6-7e2f-75eb-a86e-a267eff5e4f9');
    });

    it.each(['', '123', 'not-a-uuid', '01a21cd6-7e2f-75eb-a86e-a267eff5e4f'])(
      'should reject the invalid value "%s"',
      (value) => {
        expect(() => UniqueId.from(value)).toThrow(InvalidIdError);
      },
    );

    it('should report the INVALID_ID code', () => {
      expect(() => UniqueId.from('123')).toThrow(
        expect.objectContaining({ code: 'INVALID_ID' }),
      );
    });
  });
});

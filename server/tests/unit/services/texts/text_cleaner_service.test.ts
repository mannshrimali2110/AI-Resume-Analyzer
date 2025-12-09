import { TextCleanerService } from "../../../../src/services/text/text_cleaner_service";

/**
 * Unit tests for TextCleanerService.
 * These tests validate text normalization, whitespace cleaning,
 * and safe handling of edge cases.
 */
describe("TextCleanerService", () => {
  let text_cleaner_service: TextCleanerService;

  /**
   * Initialize a fresh instance before each test.
   */
  beforeEach(() => {
    text_cleaner_service = new TextCleanerService();
  });

  /**
   * Should trim leading and trailing whitespace.
   */
  it("should trim leading and trailing whitespace", () => {
    const raw_text = "   Hello world   ";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(cleaned_text).toBe("Hello world");
  });

  /**
   * Should normalize multiple spaces into a single space.
   */
  it("should normalize multiple spaces into a single space", () => {
    const raw_text = "Hello     world     from     Jest";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(cleaned_text).toBe("Hello world from Jest");
  });

  /**
   * Should normalize multiple new lines into a single space.
   */
  /**
   * Should remove newlines and join text without inserting extra spaces.
   */
  it("should remove newlines and condense text", () => {
    const raw_text = "Hello\n\n\nworld\nfrom\n\nJest";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(cleaned_text).toBe("HelloworldfromJest");
  });

  /**
   * Should safely handle empty string input.
   */
  it("should return empty string when input is empty", () => {
    const raw_text = "";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(cleaned_text).toBe("");
  });

  /**
   * Should safely handle string with only whitespace.
   */
  it("should return empty string when input contains only whitespace", () => {
    const raw_text = "     \n   \n   ";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(cleaned_text).toBe("");
  });

  /**
   * Should handle special characters without crashing.
   */
  it("should safely handle special characters", () => {
    const raw_text = "Hello @@##$$%%% world!!";
    const cleaned_text = text_cleaner_service.clean_text(raw_text);

    expect(typeof cleaned_text).toBe("string");
    expect(cleaned_text.length).toBeGreaterThan(0);
  });

  /**
   * Should not throw when provided with valid string input.
   */
  it("should not throw for valid string input", () => {
    const raw_text = "Valid input for testing";

    expect(() => {
      text_cleaner_service.clean_text(raw_text);
    }).not.toThrow();
  });
});

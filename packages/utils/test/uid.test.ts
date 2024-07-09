import { generateUID } from "../src/uid";

describe("test generateUID function", () => {
    it("should return generated UID", () => {
        const uuid = generateUID();

        expect(uuid).toMatch(/^[0-9a-f]{32}$/);
    });
});

import fetch from "node-fetch";
import { PersonService } from "../../../src/services/moviedb";
import PERSON_DETAILS from "../../fixtures/person-details";

jest.mock("node-fetch");

describe("PersonService", () => {
    const API_URL = "https://movieland.api";
    const API_KEY = "a1b2c3d4";

    let mockedFetch: jest.Mock;

    beforeEach(() => {
        mockedFetch = fetch as unknown as jest.Mock;

        mockedFetch.mockResolvedValue({
            status: 200,
            async json() {
                return Promise.resolve(PERSON_DETAILS);
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should query API for person details", async () => {
        expect.assertions(4);
        const PERSON_ID = 543261;
        const service = new PersonService(API_URL, API_KEY);

        const result = await service.getPerson(PERSON_ID);

        expect(result.id).toBe(PERSON_ID);
        expect(mockedFetch.mock.calls[0][0]).toContain(API_KEY);
        expect(mockedFetch.mock.calls[0][0]).toContain(API_URL);
        expect(mockedFetch.mock.calls[0][0]).toContain(`/person/${PERSON_ID}`);
    });
});

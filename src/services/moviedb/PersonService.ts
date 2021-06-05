import fetch from "node-fetch";
import { PersonDetails, PersonService } from "../types";

class PersonServiceImpl implements PersonService {
    private readonly apiUrl: string;
    private readonly apiKey: string;

    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async getPerson(id: number): Promise<PersonDetails> {
        const apiResponse = await fetch(`${this.apiUrl}/person/${id}?api_key=${this.apiKey}`);
        return await apiResponse.json();
    }
}

export default PersonServiceImpl;

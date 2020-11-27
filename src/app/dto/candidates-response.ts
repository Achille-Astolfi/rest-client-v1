import { Candidate } from '../resource/candidate';

export interface CandidatesResponse {
    "_embedded": {
        "candidates": Candidate[]
    }
}
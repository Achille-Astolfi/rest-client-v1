import { Course } from '../resource/course';

export interface CoursesResponse {
    "_embedded": {
        "courses": Course[]
    }
}
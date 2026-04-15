import { IncidentType } from "../enums/incident-type.enum";

export interface IncidentCDto {
    title: string;
    lat: number;
    lon: number;
    description: string;
    type: IncidentType;
}
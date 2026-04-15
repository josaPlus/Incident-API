import { IncidentType } from "../enums/incident-type.enum";

export interface EmailOptions {
    to: string;
    subject: string;
    htmlBody: string;
    type: IncidentType;
}
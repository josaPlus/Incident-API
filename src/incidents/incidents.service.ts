import { Injectable } from '@nestjs/common';
import { IncidentType } from 'src/core/enums/incident-type.enum';
import { EmailOptions } from 'src/core/models/email-options.model';
import { EmailService } from 'src/email/email.service';
import { generateIncidentEmailTemplate } from './templates/incidents.template';
import { NumericType, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Incident } from 'src/core/entities/incident.entity';
import { IncidentCDto } from 'src/core/models/incident.model';
import Redis from 'ioredis';
import { env } from 'process';
import { envs } from 'src/config/envs';
import { CacheService } from 'src/cache/cache.service';

const CACHE_KEY_ALL_INCIDENTS = "incident:all"

@Injectable()
export class IncidentsService {

    constructor(
        @InjectRepository(Incident)
        private readonly incidentRepositery: Repository<Incident>,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ) { }
    

    async findAll(): Promise<Incident[]> {
        try {
            console.log("[IncidentService] ejecutando query de todos los incidentes");
            const incidentObject = await this.cacheService.get<Incident[]>(CACHE_KEY_ALL_INCIDENTS);
            const result = await this.incidentRepositery.find();
            console.log(`[IncidentService] se encontraron ${result.length} incidents`);
            await this.cacheService.set(CACHE_KEY_ALL_INCIDENTS, JSON.stringify(result))
            return result
        } catch (error) {
            console.error("[IncidentService] ocurrio un error es el service de incident")
            console.error(error);
            return []
        }
    }

    // IMPORTANTE
    async findInRadius(lat: number, lon: number, radius: number): Promise<Incident[]> {
        try {
            // UTILIZAR POSTGIS
            // AVECES SER NECESARIO APLICAR SQL
            const result = await this.incidentRepositery
                .createQueryBuilder()
                .where(
                    `
                                    ST_DWithin(
                                    incident.location::geography,
                                    ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
                                    :radius
        )
                                    `, { lat, lon, radius }
                )
                .getMany();
            return result
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createIncident(incident: IncidentCDto): Promise<Boolean> {
        // save
        // generar un nuevo registro de la entidad de incident
        const newIncident = this.incidentRepositery.create({
            title: incident.title,
            description: incident.description,
            type: incident.type,
            lat: incident.lat,
            lon: incident.lon,
            location: {
                type: 'Point',
                coordinates: [incident.lon, incident.lat]
            }
        })
        const generateIncident = await this.incidentRepositery.save(newIncident)
        await this.cacheService.delete(CACHE_KEY_ALL_INCIDENTS);
        const template = generateIncidentEmailTemplate(incident);
        const options: EmailOptions = {
            to: "josafat061@gmail.com",
            subject: incident.title,
            htmlBody: template,
            type: IncidentType.ACCIDENTS
        }
        const result = await this.emailService.sendEmail(options);
        return result;
    }
}

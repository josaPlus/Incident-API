import { Body, Controller, Get, ParseFloatPipe, Post, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import type { IncidentCDto } from 'src/core/models/incident.model';
import { Incident } from 'src/core/entities/incident.entity';
import { logger } from 'src/config/logger';

@Controller('incidents')
export class IncidentsController {

    constructor(private readonly incidentService: IncidentsService) {}

    @Get()
    async findAllIncident() {
        console.log("[IncidentController] recibieron solicitud de findAllIncident")
        const result = await this.incidentService.findAll();
        return result
    }

    // IMPORTANTE
    @Get('search/radius')
    async findIncidentByRadius(
        @Query('lat', ParseFloatPipe)lat: number,
        @Query('lon', ParseFloatPipe)lon: number,
        @Query('radiusInMeters', ParseFloatPipe)radiusInMeters: number
    ) {
        console.log(`[IncidentController] buscando incidentes en un radio de: ${radiusInMeters}`);
        const result = await this.incidentService.findInRadius(lat,lon,radiusInMeters);
        return result;
    }

    @Post()
    async createIncident(@Body() incident: IncidentCDto) {
        logger.info("[IncidentController] creando incidente")
        const result = this.incidentService.createIncident(incident);
        logger.info("[IncidentController] incidente creado")
        logger.info(result)
        return result;
    }
}

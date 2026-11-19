import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private disk: DiskHealthIndicator,
        private db: TypeOrmHealthIndicator
    ) {}

    @Get('ready')
    @HealthCheck()
    ready() {
        return this.health.check([
            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.9 }),
            () => this.db.pingCheck('database').withTimeout('1s')
        ])
    }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SystemSetting } from './entities/system-setting.entity';

@Injectable()
export class SystemSettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(SystemSetting)
    private readonly systemSettingRepository: Repository<SystemSetting>,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    try {
      // Bypasses synchronize: false by programmatically creating the table if it's missing
      await this.dataSource.query(`
        CREATE TABLE IF NOT EXISTS system_settings (
          \`key\` VARCHAR(255) PRIMARY KEY,
          \`value\` TEXT NOT NULL
        ) ENGINE=InnoDB;
      `);
      console.log('✅ Checked system_settings table');

      // Set default PIN if not exists
      const pinSetting = await this.systemSettingRepository.findOne({
        where: { key: 'registration_pin' },
      });
      if (!pinSetting) {
        const defaultPin = this.systemSettingRepository.create({
          key: 'registration_pin',
          value: '123456',
        });
        await this.systemSettingRepository.save(defaultPin);
        console.log('✅ Default registration PIN initialized to 123456');
      }
    } catch (err) {
      console.error('❌ Error during SystemSettings initialization:', err);
    }
  }

  async getSetting(key: string): Promise<string> {
    try {
      const setting = await this.systemSettingRepository.findOne({
        where: { key },
      });
      return setting ? setting.value : '';
    } catch (err) {
      console.error(`Error getting setting for key ${key}:`, err);
      return '';
    }
  }

  async setSetting(key: string, value: string): Promise<void> {
    let setting = await this.systemSettingRepository.findOne({
      where: { key },
    });
    if (setting) {
      setting.value = value;
    } else {
      setting = this.systemSettingRepository.create({ key, value });
    }
    await this.systemSettingRepository.save(setting);
  }

  async verifyPin(pin: string): Promise<boolean> {
    const validPin = await this.getSetting('registration_pin');
    return pin === (validPin || '123456');
  }
}

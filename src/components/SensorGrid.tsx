import React from 'react';
import { useTelemetry } from '../data/telemetryStore';
import { SensorCard } from './SensorCard';
import { Satellite, Activity, Gauge, Waves } from 'lucide-react';
import { formatHeading } from '../utils/formatters';

export const SensorGrid: React.FC = () => {
  const { gps, wheel, potentiometer, imu } = useTelemetry();

  const cards = [
    {
      title: 'GPS MODULE',
      icon: <Satellite size={11} />,
      status: gps.status,
      accent: '#718895',
      fields: [
        { label: 'Latitude', value: gps.latitude.toFixed(6) + '°', highlight: true },
        { label: 'Longitude', value: gps.longitude.toFixed(6) + '°', highlight: true },
        { label: 'Speed', value: `${gps.speed.toFixed(1)} km/h` },
        { label: 'Heading', value: formatHeading(gps.heading) },
        { label: 'Satellites', value: `${gps.satellites} / ${gps.fixType}` },
      ],
      detailFields: [
        { label: 'Latitude', value: gps.latitude.toFixed(8) + '°', highlight: true },
        { label: 'Longitude', value: gps.longitude.toFixed(8) + '°', highlight: true },
        { label: 'Altitude', value: `${gps.altitude.toFixed(1)} m` },
        { label: 'Speed', value: `${gps.speed.toFixed(2)} km/h`, highlight: true },
        { label: 'Heading', value: formatHeading(gps.heading) },
        { label: 'Satellites', value: `${gps.satellites}` },
        { label: 'Fix Type', value: gps.fixType, highlight: true },
        { label: 'HDOP', value: gps.hdop.toFixed(2) },
        { label: 'Status', value: gps.status.toUpperCase() },
      ],
    },
    {
      title: 'HALL SENSOR',
      icon: <Activity size={11} />,
      status: wheel.status,
      accent: '#D99A2B',
      fields: [
        { label: 'Wheel RPM', value: wheel.rpm.toFixed(0), highlight: true, unit: 'RPM' },
        { label: 'Wheel Speed', value: `${wheel.speed.toFixed(1)} km/h` },
        { label: 'Pulse Freq', value: `${wheel.pulseFrequency.toFixed(1)} Hz` },
        { label: 'Pulse Count', value: wheel.pulseCount.toLocaleString() },
      ],
      detailFields: [
        { label: 'Wheel RPM', value: wheel.rpm.toFixed(2), highlight: true, unit: 'RPM' },
        { label: 'Wheel Speed', value: `${wheel.speed.toFixed(3)} km/h`, highlight: true },
        { label: 'Pulse Frequency', value: `${wheel.pulseFrequency.toFixed(2)} Hz` },
        { label: 'Total Pulse Count', value: wheel.pulseCount.toLocaleString() },
        { label: 'Wheel Circumference', value: '1.90 m' },
        { label: 'Magnets per Revolution', value: '20' },
        { label: 'Status', value: wheel.status.toUpperCase() },
      ],
    },
    {
      title: 'LINEAR POT.',
      icon: <Gauge size={11} />,
      status: potentiometer.status,
      accent: '#D99A2B',
      fields: [
        { label: 'F. Travel', value: `${potentiometer.frontTravelPercent.toFixed(1)}%`, highlight: true },
        { label: 'F. Position', value: `${potentiometer.frontPosition.toFixed(1)} mm` },
        { label: 'F. Raw ADC', value: potentiometer.frontRawAdc.toString() },
        { label: 'R. Travel', value: `${potentiometer.rearTravelPercent.toFixed(1)}%`, highlight: true },
        { label: 'R. Position', value: `${potentiometer.rearPosition.toFixed(1)} mm` },
        { label: 'R. Raw ADC', value: potentiometer.rearRawAdc.toString() },
      ],
      detailFields: [
        { label: 'Front Position', value: `${potentiometer.frontPosition.toFixed(2)} mm`, highlight: true },
        { label: 'Front Travel %', value: `${potentiometer.frontTravelPercent.toFixed(2)}%`, highlight: true },
        { label: 'Front Raw ADC', value: `${potentiometer.frontRawAdc} / 1023` },
        { label: 'Front Voltage', value: `${(potentiometer.frontRawAdc / 1023 * 3.3).toFixed(3)} V` },
        { label: 'Rear Position', value: `${potentiometer.rearPosition.toFixed(2)} mm`, highlight: true },
        { label: 'Rear Travel %', value: `${potentiometer.rearTravelPercent.toFixed(2)}%`, highlight: true },
        { label: 'Rear Raw ADC', value: `${potentiometer.rearRawAdc} / 1023` },
        { label: 'Rear Voltage', value: `${(potentiometer.rearRawAdc / 1023 * 3.3).toFixed(3)} V` },
        { label: 'Max Travel', value: '140 mm' },
        { label: 'Status', value: potentiometer.status.toUpperCase() },
      ],
    },
    {
      title: 'IMU 6-DOF',
      icon: <Waves size={11} />,
      status: imu.status,
      accent: '#718895',
      fields: [
        { label: 'Pitch', value: `${imu.pitch.toFixed(1)}°`, highlight: true },
        { label: 'Roll', value: `${imu.roll.toFixed(1)}°`, highlight: true },
        { label: 'Yaw', value: `${imu.yaw.toFixed(1)}°` },
        { label: 'Accel X', value: `${imu.ax.toFixed(2)} m/s²` },
        { label: 'Accel Y', value: `${imu.ay.toFixed(2)} m/s²` },
        { label: 'Accel Z', value: `${imu.az.toFixed(2)} m/s²` },
      ],
      detailFields: [
        { label: 'Pitch', value: `${imu.pitch.toFixed(3)}°`, highlight: true },
        { label: 'Roll', value: `${imu.roll.toFixed(3)}°`, highlight: true },
        { label: 'Yaw', value: `${imu.yaw.toFixed(3)}°` },
        { label: 'Accel X', value: `${imu.ax.toFixed(4)} m/s²`, highlight: true },
        { label: 'Accel Y', value: `${imu.ay.toFixed(4)} m/s²`, highlight: true },
        { label: 'Accel Z', value: `${imu.az.toFixed(4)} m/s²`, highlight: true },
        { label: 'Gyro X', value: `${imu.gx.toFixed(3)} °/s` },
        { label: 'Gyro Y', value: `${imu.gy.toFixed(3)} °/s` },
        { label: 'Gyro Z', value: `${imu.gz.toFixed(3)} °/s` },
        { label: 'Status', value: imu.status.toUpperCase() },
      ],
    },
  ];

  return (
    <div style={{
      background: '#181B1E',
      border: '1px solid #30363B',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '8px 12px',
        borderBottom: '1px solid #30363B',
        flexShrink: 0,
      }}>
        <span className="section-header">LIVE SENSOR TELEMETRY</span>
      </div>

      {/* Grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 8,
        padding: 8,
        background: '#101214',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {cards.map((card) => (
          <SensorCard key={card.title} {...card as any} />
        ))}
      </div>
    </div>
  );
};

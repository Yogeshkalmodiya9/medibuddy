import { LabReport, HealthMetric } from '../types';

/**
 * Derives Health Snapshot cards dynamically from the actual extracted parameters of a report.
 * NEVER fabricates missing parameters.
 */
export function deriveHealthMetricsFromReport(report: LabReport | null): HealthMetric[] {
  if (!report || !report.parameters || report.parameters.length === 0) {
    return [];
  }

  const metrics: HealthMetric[] = [];

  report.parameters.forEach((param) => {
    const nameLower = param.parameterName.toLowerCase();

    let iconType: HealthMetric['iconType'] = 'platelets';
    let isKeyMetric = false;

    if (nameLower.includes('hemoglobin') || nameLower.includes('haemoglobin') || nameLower === 'hb') {
      iconType = 'hemoglobin';
      isKeyMetric = true;
    } else if (nameLower.includes('wbc') || nameLower.includes('white blood') || nameLower.includes('leukocyte')) {
      iconType = 'wbc';
      isKeyMetric = true;
    } else if (nameLower.includes('platelet')) {
      iconType = 'platelets';
      isKeyMetric = true;
    } else if (nameLower.includes('temperature') || nameLower.includes('temp')) {
      iconType = 'temperature';
      isKeyMetric = true;
    } else if (nameLower.includes('blood pressure') || nameLower.includes('bp')) {
      iconType = 'bloodPressure';
      isKeyMetric = true;
    } else if (nameLower.includes('glucose') || nameLower.includes('sugar') || nameLower.includes('hba1c')) {
      iconType = 'bloodSugar';
      isKeyMetric = true;
    } else if (
      nameLower.includes('cholesterol') ||
      nameLower.includes('creatinine') ||
      nameLower.includes('bilirubin') ||
      nameLower.includes('tsh') ||
      nameLower.includes('sgpt') ||
      nameLower.includes('sgot')
    ) {
      iconType = 'platelets';
      isKeyMetric = true;
    }

    if (isKeyMetric || metrics.length < 6) {
      let statusColor: HealthMetric['statusColor'] = 'green';
      let statusLabel: HealthMetric['status'] = 'Within range';

      if (param.status === 'Above displayed range' || param.status === 'Below displayed range') {
        statusColor = 'amber';
        statusLabel = 'Needs attention';
      } else if (param.status === 'Cannot determine') {
        statusColor = 'amber';
        statusLabel = 'Normal';
      }

      metrics.push({
        id: 'metric-' + param.id,
        name: param.parameterName,
        value: param.result,
        unit: param.unit,
        referenceRange: param.referenceRange,
        status: statusLabel,
        statusColor,
        simpleExplanation: param.simpleExplanationEn || `${param.parameterName} as reported by laboratory.`,
        iconType,
      });
    }
  });

  return metrics.slice(0, 6);
}

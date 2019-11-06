import {
  graphHelpers,
  yAxisTickFormat,
  convertChartData,
  getChartXAxisLabelIncrement,
  getGraphLabels,
  getGranularityDateType
} from '../graphHelpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhelApiTypes';

describe('GraphHelpers', () => {
  it('should have specific functions', () => {
    expect(graphHelpers).toMatchSnapshot('graphHelpers');
  });

  it('should produce consistent y axis tick values', () => {
    const ticks = {};

    for (let i = 0; i < 11; i++) {
      const multiplier = Math.pow(10, i);
      const thirteenMultiplier = 13 * multiplier;
      const fifteenMultiplier = 15 * multiplier;

      ticks[multiplier] = yAxisTickFormat(multiplier);
      ticks[thirteenMultiplier] = yAxisTickFormat(thirteenMultiplier);
      ticks[fifteenMultiplier] = yAxisTickFormat(fifteenMultiplier);
    }

    expect(ticks).toMatchSnapshot('y axis tick values');
  });

  it('should convert graph data and return zeroed usage array if error', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      tooltipThresholdLabel: 'ipsum threshhold label',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z')
    };

    expect(convertChartData(props)).toMatchSnapshot('error is true');
  });

  it('should convert graph data and return zeroed usage array if usage is empty', () => {
    const props = {
      data: [],
      dataThreshold: [],
      tooltipLabel: 'lorem tooltip label',
      tooltipThresholdLabel: 'ipsum threshhold label',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z')
    };

    expect(convertChartData(props)).toMatchSnapshot('zeroed array');
  });

  it('should convert graph data and generate tooltips when usage is populated', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      tooltipLabelNoData: 'No lorem data',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [
        {
          date: '2019-06-01T00:00:00Z',
          y: 10,
          x: 0
        },
        {
          date: '2019-06-02T00:00:00Z',
          y: 12,
          x: 1
        },
        {
          date: '2019-06-03T00:00:00Z',
          y: 3,
          x: 2
        },
        {
          date: '2019-06-04T00:00:00Z',
          y: 0,
          x: 3
        },
        {
          date: '2019-06-05T00:00:00Z',
          y: 0,
          x: 4
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('usage populated');
  });

  it('should convert graph data and threshold data', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      tooltipThresholdLabel: 'ipsum threshhold label',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [
        {
          date: '2019-06-01T00:00:00Z',
          y: 10,
          x: 0
        },
        {
          date: '2019-06-02T00:00:00Z',
          y: 12,
          x: 1
        },
        {
          date: '2019-06-03T00:00:00Z',
          y: 3,
          x: 2
        },
        {
          date: '2019-06-04T00:00:00Z',
          y: 0,
          x: 3
        },
        {
          date: '2019-06-05T00:00:00Z',
          y: 1,
          x: 4
        }
      ],
      dataThreshold: [
        {
          date: '2019-06-01T00:00:00Z',
          y: 200,
          x: 0
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('threshold check');
  });

  it('should handle tooltips in a specific set of ways', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      tooltipThresholdLabel: 'ipsum threshhold label',
      tooltipLabelNoData: 'No lorem data',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [
        {
          date: '2019-06-01T00:00:00Z',
          y: 0,
          x: 0
        },
        {
          date: '2019-06-02T00:00:00Z',
          y: 0,
          x: 1
        },
        {
          date: '2019-06-03T00:00:00Z',
          y: 6,
          x: 2
        },
        {
          date: '2019-06-04T00:00:00Z',
          y: 0,
          x: 3
        },
        {
          date: '2019-06-05T00:00:00Z',
          y: 6,
          x: 4
        }
      ],
      dataThreshold: [
        {
          date: '2019-06-01T00:00:00Z',
          y: 150,
          x: 0
        },
        {
          date: '2019-06-02T00:00:00Z',
          y: 150,
          x: 1
        },
        {
          date: '2019-06-03T00:00:00Z',
          y: 150,
          x: 2
        },
        {
          date: '2019-06-04T00:00:00Z',
          y: 0,
          x: 3
        },
        {
          date: '2019-06-04T00:00:00Z',
          y: 0,
          x: 4
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('tooltip check');
  });

  it('should convert graph data and returned zeroed array when usage throws error', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2019-06-01T00:00:00Z'),
      endDate: new Date('2019-06-05T23:59:59Z'),
      data: [null]
    };

    expect(
      convertChartData({
        ...props
      })
    ).toMatchSnapshot('throws error');
  });

  it('should handle cross year labels', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      granularity: GRANULARITY_TYPES.DAILY,
      startDate: new Date('2018-12-31T00:00:00Z'),
      endDate: new Date('2019-01-06T00:00:00Z'),
      data: [
        {
          date: '2018-12-31T00:00:00Z',
          y: 10,
          x: 0
        },
        {
          date: '2019-01-01T00:00:00Z',
          y: 12,
          x: 1
        },
        {
          date: '2019-01-02T00:00:00Z',
          y: 12,
          x: 2
        },
        {
          date: '2019-01-03T00:00:00Z',
          y: 12,
          x: 3
        },
        {
          date: '2019-01-04T00:00:00Z',
          y: 12,
          x: 4
        },
        {
          date: '2019-01-05T00:00:00Z',
          y: 12,
          x: 5
        },
        {
          date: '2019-01-06T00:00:00Z',
          y: 12,
          x: 6
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('cross year');
  });

  it('should handle cross quarter labels', () => {
    const props = {
      tooltipLabel: 'lorem tooltip label',
      granularity: GRANULARITY_TYPES.QUARTERLY,
      startDate: new Date('2018-04-01T00:00:00Z'),
      endDate: new Date('2019-04-01T00:00:00Z'),
      data: [
        {
          date: '2018-04-01T00:00:00Z',
          y: 10,
          x: 0
        },
        {
          date: '2018-08-01T00:00:00Z',
          y: 12,
          x: 1
        },
        {
          date: '2018-12-01T00:00:00Z',
          y: 12,
          x: 2
        },
        {
          date: '2019-04-01T00:00:00Z',
          y: 12,
          x: 3
        },
        {
          date: '2019-08-01T00:00:00Z',
          y: 12,
          x: 4
        }
      ]
    };

    expect(convertChartData(props)).toMatchSnapshot('quarter granularity');
  });

  it('should return a x axis tick increment based on granularity', () => {
    const daily = getChartXAxisLabelIncrement(GRANULARITY_TYPES.DAILY);
    const weekly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.WEEKLY);
    const monthly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getChartXAxisLabelIncrement(GRANULARITY_TYPES.QUARTERLY);

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('x axis tick increment');
  });

  it('should return a label based on granularity', () => {
    const daily = getGraphLabels({ granularity: GRANULARITY_TYPES.DAILY, tooltipLabel: 'ipsum tooltip label' });
    const weekly = getGraphLabels({ granularity: GRANULARITY_TYPES.WEEKLY, tooltipLabel: 'ipsum tooltip label' });
    const monthly = getGraphLabels({ granularity: GRANULARITY_TYPES.MONTHLY, tooltipLabel: 'ipsum tooltip label' });
    const quarterly = getGraphLabels({ granularity: GRANULARITY_TYPES.QUARTERLY, tooltipLabel: 'ipsum tooltip label' });

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity based label');
  });

  it('should return a date type based on granularity', () => {
    const daily = getGranularityDateType(GRANULARITY_TYPES.DAILY);
    const weekly = getGranularityDateType(GRANULARITY_TYPES.WEEKLY);
    const monthly = getGranularityDateType(GRANULARITY_TYPES.MONTHLY);
    const quarterly = getGranularityDateType(GRANULARITY_TYPES.QUARTERLY);

    expect({ daily, weekly, monthly, quarterly }).toMatchSnapshot('granularity date type');
  });
});

import React from 'react';
import PropTypes from 'prop-types';
import { EyeIcon, EyeSlashIcon, SquareIcon, IconSize } from '@patternfly/react-icons';

/**
 * Emulate pf icon sizing for custom SVGs
 *
 * @param {string} size
 * @returns {string} em measurement
 */
const getSize = size => {
  if (!Number.isNaN(Number.parseFloat(size))) {
    return size;
  }

  switch (size) {
    case 'md':
      return '1.5em';
    case 'lg':
      return '2em';
    case 'xl':
      return '3em';
    case 'sm':
    default:
      return '1em';
  }
};

/**
 * Render an icon for use outside of Victory charts.
 *
 * @param {object} props
 * @param {string} props.fill
 * @param {string} props.symbol
 * @param {string} props.size
 * @param {string} props.title
 * @returns {React.ReactNode}
 */
const ChartIcon = ({ fill, symbol, size, title, ...props }) => {
  const svgProps = { ...props };
  const iconProps = { size, title, ...props };
  const fontProps = { style: { fontSize: getSize(size) }, title, ...props };
  const emSvgSize = getSize(size);

  if (title) {
    svgProps['aria-labelledby'] = title;
  } else {
    svgProps['aria-hidden'] = true;
  }

  if (fill) {
    iconProps.color = fill;
    fontProps.style.color = fill;
  }

  const setIcon = () => {
    switch (symbol) {
      case 'dash':
        return (
          <span
            style={{
              width: emSvgSize,
              height: `${Number.parseFloat(emSvgSize) / 2}em`
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 38 10" role="img" {...svgProps}>
              <rect y="5" width="10" height="10" fill={fill} />
              <rect x="14" y="5" width="10" height="10" fill={fill} />
              <rect x="28" y="5" width="10" height="10" fill={fill} />
            </svg>
          </span>
        );
      case 'threshold':
        return (
          <span style={{ width: `${Number.parseFloat(emSvgSize) * 2}em`, height: emSvgSize }}>
            <svg width="100%" height="100%" viewBox="0 0 18 10" role="img" {...svgProps}>
              <line
                x1={0}
                y1={(Number.parseFloat(emSvgSize) * 16) / 2}
                x2={Number.parseFloat(emSvgSize) * 16 * 3}
                y2={(Number.parseFloat(emSvgSize) * 16) / 2}
                stroke={fill}
                strokeWidth={3}
                strokeDasharray="4,3"
              />
            </svg>
          </span>
        );
      case 'eye':
        return <EyeIcon {...iconProps} />;
      case 'eyeSlash':
        return <EyeSlashIcon {...iconProps} />;
      case 'infinity':
        return (
          <span className="curiosity-icon__f-infinity" {...fontProps}>
            <span aria-hidden>&#x221e;</span>
          </span>
        );

      case 'square':
      default:
        return <SquareIcon {...iconProps} />;
    }
  };

  return <span className={`curiosity-chartarea__icon curiosity-chartarea__icon-${symbol}`}>{setIcon()}</span>;
};

/**
 * Prop types.
 *
 * @type {{symbol: string, size: string, fill: string, title: string}}
 */
ChartIcon.propTypes = {
  fill: PropTypes.string,
  size: PropTypes.oneOf([...Object.keys(IconSize)]),
  symbol: PropTypes.oneOf(['dash', 'eye', 'eyeSlash', 'infinity', 'square', 'threshold']),
  title: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{symbol: string, size: string, fill: null, title: null}}
 */
ChartIcon.defaultProps = {
  fill: null,
  size: 'sm',
  symbol: 'square',
  title: null
};

export { ChartIcon as default, ChartIcon };

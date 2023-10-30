import classNames from 'classnames';
import { anticipate, motion } from 'framer-motion';

import './Wheel.scss';

export interface IItem {
  label: string;
  id: number;
}

export interface IWheelProps {
  items: IItem[];
  targetDegrees?: number;
  animateTransition?: boolean;
  onComplete: () => void;
}
const gradientColors = ['#4B3524', '#624830', '#382217'];
function getGradient(numItems: number) {
  const wedgeDegrees = 360 / numItems;
  let gradientString = '';
  const modulus = numItems % 2 == 0 ? 2 : 3;
  for (let i = 0; i < numItems; i++) {
    const color = gradientColors[i % modulus];
    const startDegrees = i * wedgeDegrees;
    const endDegrees = (i + 1) * wedgeDegrees;
    gradientString = gradientString.concat(
      `${color} ${startDegrees}deg, ${color} ${endDegrees}deg,`,
    );
  }
  // Strip off trailing comma when returning.
  return `conic-gradient(${gradientString.substring(
    0,
    gradientString.length - 1,
  )})`;
}

function getRotation(numItems: number, itemIndex: number) {
  const wedgeDegrees = 360 / numItems;

  return `rotate(${wedgeDegrees * itemIndex - wedgeDegrees / 2 - 90}deg)`;
}

export function Wheel({
  items,
  targetDegrees,
  animateTransition,
  onComplete,
}: IWheelProps) {
  const wheelClasses = classNames('wheel center-contents');
  return (
    <div className="container">
      <motion.div
        className={wheelClasses}
        animate={{
          rotate: targetDegrees ?? 0,
        }}
        transition={{
          duration: animateTransition ? 3 : 0,
          ease: 'anticipate',
        }}
        onAnimationComplete={onComplete}
        style={{
          background: getGradient(items.length),
        }}
      >
        <div>
          {items.map((item: IItem, index: number) => {
            return (
              <div
                key={`${item.label}-${item.id} `}
                className="wedge center-contents"
                style={{ transform: getRotation(items.length, index) }}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
